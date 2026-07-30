import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";

// Retaking the assessment resets the customer's paywall — clears their
// paid-order history so the next visit to /mykundali/dashboard bounces them
// through /mykundali/assessment/unlock again, same as a first-time customer.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("payments").delete().eq("customer_id", user.id);
  if (error) {
    return NextResponse.json({ error: "Could not reset payment status" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
