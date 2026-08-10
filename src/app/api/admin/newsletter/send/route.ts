import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { sendNewsletterBatch } from "@/lib/email";

export async function POST(request: Request) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!isAdmin || !user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { subject, body } = await request.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_FROM_EMAIL) {
    return NextResponse.json(
      { error: "Newsletter sending is not configured (missing RESEND_API_KEY / NEWSLETTER_FROM_EMAIL)" },
      { status: 500 }
    );
  }

  const { data: subscribers, error: subsError } = await supabase
    .from("newsletter_subscribers")
    .select("email");

  if (subsError) {
    return NextResponse.json({ error: "Could not load subscribers" }, { status: 500 });
  }

  const recipients: string[] = (subscribers ?? []).map((s: any) => s.email);
  if (recipients.length === 0) {
    return NextResponse.json({ error: "There are no subscribers to send to" }, { status: 400 });
  }

  const { sent, error } = await sendNewsletterBatch(recipients, subject, body);
  if (error) {
    return NextResponse.json({ error }, { status: 502 });
  }

  const { error: insertError } = await supabase.from("newsletter_sends").insert({
    subject,
    body,
    sent_by: user.id,
    recipient_count: sent,
  });
  if (insertError) {
    return NextResponse.json(
      { error: "Newsletter sent, but the send history could not be recorded" },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true, recipientCount: sent });
}
