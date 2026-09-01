import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendWelcomeEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_ATTEMPTS = 5;

function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  const { email, otp, fullName, phone, password } = await request.json();

  if (!email?.trim() || !otp?.trim() || !fullName?.trim() || !phone?.trim() || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Per-code attempts already cap guessing a single OTP; this caps one
  // source from hammering many different emails' verify endpoints.
  const ip = getClientIp(request);
  const ipCheck = await checkRateLimit(`verify-otp:ip:${ip}`, 20, 60 * 60);
  if (!ipCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const admin = createAdminClient();
  const cleanEmail = email.trim().toLowerCase();

  const { data: otpRow } = await admin
    .from("signup_otp_codes")
    .select("*")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (!otpRow) {
    return NextResponse.json(
      { error: "No verification code found for this email. Please request a new one." },
      { status: 400 }
    );
  }

  if (new Date(otpRow.expires_at) < new Date()) {
    await admin.from("signup_otp_codes").delete().eq("email", cleanEmail);
    return NextResponse.json(
      { error: "This code has expired. Please request a new one." },
      { status: 400 }
    );
  }

  if (otpRow.attempts >= MAX_ATTEMPTS) {
    await admin.from("signup_otp_codes").delete().eq("email", cleanEmail);
    return NextResponse.json(
      { error: "Too many incorrect attempts. Please request a new code." },
      { status: 400 }
    );
  }

  if (hashOtp(otp.trim()) !== otpRow.otp_hash) {
    await admin
      .from("signup_otp_codes")
      .update({ attempts: otpRow.attempts + 1 })
      .eq("email", cleanEmail);
    return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  }

  // The code is correct — but it's deliberately NOT deleted yet. If account
  // creation below fails for a reason that isn't the user's fault (a
  // transient Supabase error, etc.), leaving the code in place means they
  // can immediately retry with the same, already-correct code instead of
  // being forced to request a whole new one.

  let created = await admin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName.trim(), phone: phone.trim() },
  });

  if (created.error) {
    // A ghost, never-confirmed auth user from before this fix (or an
    // abandoned earlier attempt) can be safely replaced — nothing else
    // references it since no customers/leads row is ever created until
    // this point. A real, already-confirmed account is left untouched.
    const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const ghost = listData?.users.find((u) => u.email === cleanEmail && !u.email_confirmed_at);

    if (ghost) {
      await admin.auth.admin.deleteUser(ghost.id);
      created = await admin.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName.trim(), phone: phone.trim() },
      });
    }
  }

  if (created.error || !created.data.user) {
    // Code stays valid (not deleted, attempts unchanged) — this failure is
    // ours, not theirs.
    return NextResponse.json(
      { error: created.error?.message ?? "Could not create your account. Please try again." },
      { status: 400 }
    );
  }

  const user = created.data.user;

  const { error: insertError } = await admin.from("customers").upsert({
    id: user.id,
    full_name: fullName.trim(),
    email: cleanEmail,
    phone: phone.trim(),
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(user.id);
    // Same reasoning — roll back the just-created auth user, but leave the
    // OTP code alone so the next attempt doesn't need a resend.
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Everything succeeded — only now is the code actually consumed.
  await admin.from("signup_otp_codes").delete().eq("email", cleanEmail);

  await admin.from("leads").insert({
    full_name: fullName.trim(),
    email: cleanEmail,
    phone: phone.trim(),
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

  sendWelcomeEmail(cleanEmail, fullName.trim()).catch((err) =>
    console.error("[verify-signup-otp] Welcome email failed:", err)
  );

  return NextResponse.json({ ok: true, fullName: fullName.trim(), email: cleanEmail });
}
