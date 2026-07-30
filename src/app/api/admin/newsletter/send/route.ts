import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/supabase/admin-guard";

// Resend's batch endpoint accepts up to 100 emails per call as of writing —
// check Resend's docs if this changes.
const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function POST(request: Request) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!isAdmin || !user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { subject, body } = await request.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
  }

  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!fromEmail || !apiKey) {
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

  const resend = new Resend(apiKey);
  const html = body.replace(/\n/g, "<br />");

  try {
    for (const batch of chunk(recipients, BATCH_SIZE)) {
      const { error } = await resend.batch.send(
        batch.map((to) => ({ from: fromEmail, to, subject, html }))
      );
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 502 });
      }
    }
  } catch {
    return NextResponse.json({ error: "Failed to send newsletter via Resend" }, { status: 502 });
  }

  const { error: insertError } = await supabase.from("newsletter_sends").insert({
    subject,
    body,
    sent_by: user.id,
    recipient_count: recipients.length,
  });
  if (insertError) {
    return NextResponse.json(
      { error: "Newsletter sent, but the send history could not be recorded" },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true, recipientCount: recipients.length });
}
