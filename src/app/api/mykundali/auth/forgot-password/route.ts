import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendPasswordResetOtpEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email: cleanEmail,
    });

    if (error || !data?.properties?.email_otp) {
      return NextResponse.json(
        { error: error?.message ?? "Could not generate password reset code." },
        { status: 400 }
      );
    }

    const otp = data.properties.email_otp;

    // Send the 6-digit OTP code directly to user's email via Resend
    const { error: emailError } = await sendPasswordResetOtpEmail(cleanEmail, otp);
    if (emailError) {
      console.error("[forgot-password] Resend error:", emailError);
      return NextResponse.json(
        { error: "Could not send the verification email. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[forgot-password] API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to send reset code. Please try again." },
      { status: 500 }
    );
  }
}
