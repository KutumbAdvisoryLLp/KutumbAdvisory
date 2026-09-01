import { NextResponse } from "next/server";
import { randomInt, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendSignupOtpEmail } from "@/lib/email";
import { isAllowedEmailDomain, ALLOWED_EMAIL_PROVIDERS_LABEL } from "@/lib/allowedEmailDomains";

const OTP_TTL_MINUTES = 15;

function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

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

  // Only block on an email that's actually a real, confirmed customer —
  // never on Supabase's own auth.users side effects, since this route no
  // longer creates any account. That's the whole point: a failed/expired
  // OTP here leaves nothing behind to get stuck on.
  const { data: existingCustomer } = await admin
    .from("customers")
    .select("id")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (existingCustomer) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in instead." },
      { status: 400 }
    );
  }

  const otp = randomInt(0, 100000000).toString().padStart(8, "0");
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  const { error: upsertError } = await admin.from("signup_otp_codes").upsert(
    {
      email: cleanEmail,
      otp_hash: hashOtp(otp),
      attempts: 0,
      expires_at: expiresAt,
    },
    { onConflict: "email" }
  );

  if (upsertError) {
    return NextResponse.json({ error: "Could not start signup. Please try again." }, { status: 500 });
  }

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
