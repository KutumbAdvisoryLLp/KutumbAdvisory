import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendSignupOtpEmail } from "@/lib/email";
import { isAllowedEmailDomain, ALLOWED_EMAIL_PROVIDERS_LABEL } from "@/lib/allowedEmailDomains";

export async function POST(request: Request) {
  const { fullName, email, phone, password } = await request.json();

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!isAllowedEmailDomain(email)) {
    return NextResponse.json(
      { error: `Please use an email from one of these providers: ${ALLOWED_EMAIL_PROVIDERS_LABEL}.` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const cleanEmail = email.trim().toLowerCase();

  // generateLink with type "signup" creates the auth user (unconfirmed) as a
  // side effect and hands back a raw OTP — mirrors the forgot-password flow,
  // which does the same thing with type "recovery" for an existing user.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email: cleanEmail,
    password,
    options: { data: { full_name: fullName.trim(), phone: phone.trim() } },
  });

  if (error || !data?.properties?.email_otp) {
    return NextResponse.json(
      { error: error?.message ?? "Could not start signup. Please try again." },
      { status: 400 }
    );
  }

  const otp = data.properties.email_otp;

  const { error: emailError } = await sendSignupOtpEmail(cleanEmail, otp);
  if (emailError) {
    console.error("[send-signup-otp] Resend error:", emailError);
    return NextResponse.json(
      { error: "Could not send the verification email. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
