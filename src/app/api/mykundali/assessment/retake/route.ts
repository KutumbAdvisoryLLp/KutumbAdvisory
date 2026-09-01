import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logServerError } from "@/lib/errorLog";

// Retaking the assessment resets the customer's paywall AND their previous
// assessment content, so the next visit to /mykundali/dashboard bounces
// them through /mykundali/assessment/unlock again and the new attempt
// starts from a clean slate instead of mixing with old answers/results.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Clear the previous assessment content FIRST, and check every result —
  // if any of these fail, stop here and leave the payment status untouched,
  // so the customer never ends up paywalled again with stale old data still
  // sitting underneath (silently ignoring a partial failure here was the
  // exact bug this route previously had).
  const [resultsRes, answersRes, profilesRes] = await Promise.all([
    admin.from("assessment_results").delete().eq("customer_id", user.id),
    admin.from("assessment_answers").delete().eq("customer_id", user.id),
    admin.from("family_profiles").delete().eq("customer_id", user.id),
  ]);

  const cleanupError = resultsRes.error ?? answersRes.error ?? profilesRes.error;
  if (cleanupError) {
    console.error("[retake] Could not clear previous assessment data:", cleanupError);
    logServerError("assessment.retake", cleanupError.message, undefined, user.id);
    return NextResponse.json(
      { error: "Could not reset your previous assessment. Please try again." },
      { status: 500 }
    );
  }

  // Paid orders are kept as a permanent record (for accounting/disputes) —
  // just superseded so the payment gate no longer treats them as active.
  // Never-completed ("created"/"failed") rows carry no such value and are
  // safe to remove outright.
  const { error: supersedeError } = await admin
    .from("payments")
    .update({ status: "superseded_by_retake" })
    .eq("customer_id", user.id)
    .eq("status", "paid");
  if (supersedeError) {
    console.error("[retake] Could not supersede payment status:", supersedeError);
    logServerError("assessment.retake", supersedeError.message, undefined, user.id);
    return NextResponse.json({ error: "Could not reset payment status" }, { status: 500 });
  }

  await admin.from("payments").delete().eq("customer_id", user.id).in("status", ["created", "failed"]);

  return NextResponse.json({ ok: true });
}
