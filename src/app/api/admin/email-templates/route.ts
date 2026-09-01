import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { logAdminAction } from "@/lib/auditLog";
import type { EmailTemplateKey } from "@/lib/email";

export async function POST(request: Request) {
  const { templateKey, subject, heading, introText, footerText } = await request.json();
  if (!templateKey || !subject?.trim() || !heading?.trim() || !introText?.trim()) {
    return NextResponse.json({ error: "Subject, heading, and intro text are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();
  if (!adminRow) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("email_templates")
    .update({
      subject: subject.trim(),
      heading: heading.trim(),
      intro_text: introText.trim(),
      footer_text: footerText?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("template_key", templateKey as EmailTemplateKey);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logAdminAction({
    adminId: user.id,
    adminEmail: user.email ?? "unknown",
    action: "email_template.save",
    targetType: "email_template",
    targetId: templateKey,
    request,
  });

  return NextResponse.json({ ok: true });
}
