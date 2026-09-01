import { NextResponse } from "next/server";
import { randomInt, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendSignupOtpEmail } from "@/lib/email";
import { isAllowedEmailDomain, ALLOWED_EMAIL_PROVIDERS_LABEL } from "@/lib/allowedEmailDomains";
import { checkRateLimit, releaseRateLimitHit, getClientIp } from "@/lib/rateLimit";

const OTP_TTL_MINUTES = 15;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  const { fullName, email, phone, password } = await request.json();

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!isAllowedEmailDomain(email)) {
    return NextResponse.json(
      { error: `Please use an email from one of these providers: ${ALLOWED_EMAIL_PROVIDERS_LABEL}.` },
      { status: 400 }
    );
  }

  const cleanEmail = email.trim().toLowerCase();

  // Per-email cooldown (stops immediate resend spam) and a per-IP cap (stops
  // one source from cycling through many different addresses) — each send
  // fires a real email against a shared daily provider quota. Both hits are
  // recorded now (so concurrent requests are still blocked correctly) but
  // released below if the send never actually happens — a failure on our
  // end shouldn't cost the caller their retry window.
  const ip = getClientIp(request);
  const emailCheck = await checkRateLimit(`signup-otp:email:${cleanEmail}`, 1, 60);
  if (!emailCheck.allowed) {
    return NextResponse.json(
      { error: "Please wait a moment before requesting another code." },
      { status: 429 }
    );
  }
  const ipCheck = await checkRateLimit(`signup-otp:ip:${ip}`, 10, 60 * 60);
  if (!ipCheck.allowed) {
    await releaseRateLimitHit(emailCheck.hitId);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const releaseHits = () =>
    Promise.all([releaseRateLimitHit(emailCheck.hitId), releaseRateLimitHit(ipCheck.hitId)]);

  const admin = createAdminClient();

  // Opportunistic cleanup of long-abandoned codes — cheap, and keeps this
  // table from growing forever without needing a separate cron job.
  admin.from("signup_otp_codes").delete().lt("expires_at", new Date().toISOString()).then();

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
    await releaseHits();
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
    await releaseHits();
    return NextResponse.json({ error: "Could not start signup. Please try again." }, { status: 500 });
  }

  const { error: emailError } = await sendSignupOtpEmail(cleanEmail, otp);
  if (emailError) {
    console.error("[send-signup-otp] Resend error:", emailError);
    await releaseHits();
    return NextResponse.json(
      { error: "Could not send the verification email. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
