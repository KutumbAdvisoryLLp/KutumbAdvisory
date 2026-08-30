import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const fullName = (user.user_metadata?.full_name as string) || user.email!.split("@")[0];
  const phone = (user.user_metadata?.phone as string) || "";
  const email = user.email!;

  const admin = createAdminClient();

  const { error: insertError } = await admin.from("customers").upsert({
    id: user.id,
    full_name: fullName,
    email,
    phone,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Insert lead into leads table so user registration is tracked as a lead in admin/analytics
  await admin.from("leads").insert({
    full_name: fullName,
    email,
    phone,
    city: null,
    occupation: null,
    age_group: null,
    contact_as: null,
    primary_goal: "MyKundali Account Registration",
    preferred_meeting: null,
    preferred_date: null,
    preferred_time: null,
    notes: null,
    status: "new",
  } as any);

  // Fire-and-forget welcome email — don't block signup if it fails
  sendWelcomeEmail(email, fullName).catch((err) =>
    console.error("[signup/finalize] Welcome email failed:", err)
  );

  return NextResponse.json({ ok: true, fullName, email });
}
