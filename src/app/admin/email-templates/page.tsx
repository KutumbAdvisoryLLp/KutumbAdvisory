"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminInput, AdminTextarea } from "@/components/admin/FormControls";
import type { EmailTemplateKey } from "@/lib/email";

interface TemplateForm {
  subject: string;
  heading: string;
  introText: string;
  footerText: string;
}

const TEMPLATE_META: { key: EmailTemplateKey; title: string; subtitle: string }[] = [
  { key: "welcome", title: "Welcome Email", subtitle: "Sent right after a customer completes signup" },
  { key: "signup_otp", title: "Signup Verification Code", subtitle: "Sent with the OTP during account signup" },
  {
    key: "password_reset_otp",
    title: "Password Reset Code",
    subtitle: "Sent with the OTP when a customer requests a password reset",
  },
  {
    key: "payment_confirmation",
    title: "Payment Confirmation",
    subtitle: "Sent after a successful Financial Kundali unlock payment",
  },
];

function TemplateCard({
  templateKey,
  title,
  subtitle,
  delay,
}: {
  templateKey: EmailTemplateKey;
  title: string;
  subtitle: string;
  delay: number;
}) {
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();
  const [form, setForm] = useState<TemplateForm>({ subject: "", heading: "", introText: "", footerText: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("email_templates")
        .select("*")
        .eq("template_key", templateKey)
        .maybeSingle();
      if (data) {
        setForm({
          subject: data.subject,
          heading: data.heading,
          introText: data.intro_text,
          footerText: data.footer_text ?? "",
        });
      }
      setLoading(false);
    })();
  }, [supabase, templateKey]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/email-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey, ...form }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json();
      showToast(body.error ?? "Could not save template", "error");
      return;
    }
    showToast(`${title} saved`, "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] sm:p-8"
    >
      <h2 className="font-serif text-xl text-navy">{title}</h2>
      <p className="mt-1 text-xs text-stone/50">{subtitle}</p>

      {loading ? (
        <p className="mt-6 text-sm text-stone/50">Loading…</p>
      ) : (
        <div className="mt-6 space-y-5">
          <AdminInput
            label="Subject"
            name={`${templateKey}-subject`}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <AdminInput
            label="Heading"
            name={`${templateKey}-heading`}
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
          <AdminTextarea
            label="Intro Text"
            name={`${templateKey}-intro`}
            value={form.introText}
            onChange={(e) => setForm({ ...form, introText: e.target.value })}
            rows={3}
          />
          <AdminTextarea
            label="Footer Text (optional)"
            name={`${templateKey}-footer`}
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            rows={2}
          />
          <p className="text-[11px] text-stone/40">
            Use <code className="rounded bg-ivory px-1 py-0.5">{"{{first_name}}"}</code> or{" "}
            <code className="rounded bg-ivory px-1 py-0.5">{"{{otp}}"}</code> where relevant — they&apos;re replaced
            automatically when the email is sent.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-navy px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90 hover:shadow-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminEmailTemplatesPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">Email Templates</p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Email Templates</h1>
        <p className="mt-2 text-sm text-stone/60">
          Edit the subject line, heading, intro, and footer for each transactional email. Layout and branding
          stay fixed.
        </p>
      </motion.div>

      <div className="mt-10 space-y-6">
        {TEMPLATE_META.map((t, i) => (
          <TemplateCard key={t.key} templateKey={t.key} title={t.title} subtitle={t.subtitle} delay={0.05 + i * 0.05} />
        ))}
      </div>
    </div>
  );
}
