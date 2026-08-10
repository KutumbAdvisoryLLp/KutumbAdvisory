import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  const { fullName, email, phone, password } = await request.json();

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // email_confirm: true marks the address confirmed immediately — signup
  // shouldn't depend on the project's "Confirm email" setting or on the
  // user actually receiving/clicking a confirmation email.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: email.trim(),
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName.trim(), phone: phone.trim() },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Could not create account" },
      { status: 400 }
    );
  }

  const { error: insertError } = await admin.from("customers").upsert({
    id: created.user.id,
    full_name: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Fire-and-forget welcome email — don't block signup if it fails
  sendWelcomeEmail(email.trim(), fullName.trim()).catch((err) =>
    console.error("[signup] Welcome email failed:", err)
  );

  return NextResponse.json({ ok: true });
}
