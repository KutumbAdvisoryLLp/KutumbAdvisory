"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/ToastContext";
import { AdminToggle } from "@/components/admin/FormControls";
import type { FeatureFlagKey } from "@/lib/featureFlags";

const FLAG_META: { key: FeatureFlagKey; label: string; description: string }[] = [
  {
    key: "maintenance_mode_customer_portal",
    label: "Maintenance Mode (Customer Portal)",
    description:
      "Redirects the My Kundali login, dashboard, and assessment pages to a maintenance notice. The admin panel and public marketing site stay unaffected.",
  },
  {
    key: "pause_new_signups",
    label: "Pause New Signups",
    description: "Blocks new customer signups at the verification-code step. Existing customers can still log in.",
  },
  {
    key: "pause_payments",
    label: "Pause Payments",
    description: "Blocks new Financial Kundali unlock payments. Existing paid customers keep dashboard access.",
  },
  {
    key: "pause_testimonial_submissions",
    label: "Pause Testimonial Submissions",
    description: "Hides the \"Leave Testimonial\" button in the customer dashboard.",
  },
];

export default function AdminFeatureFlagsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("feature_flags").select("flag_key, enabled");
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((f: { flag_key: string; enabled: boolean }) => {
        map[f.flag_key] = f.enabled;
      });
      setFlags(map);
      setLoading(false);
    })();
  }, [supabase]);

  const toggle = async (flagKey: FeatureFlagKey, next: boolean) => {
    setFlags((prev) => ({ ...prev, [flagKey]: next }));
    const res = await fetch("/api/admin/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagKey, enabled: next }),
    });
    if (!res.ok) {
      setFlags((prev) => ({ ...prev, [flagKey]: !next }));
      const body = await res.json();
      showToast(body.error ?? "Could not update flag", "error");
      return;
    }
    showToast(next ? "Enabled" : "Disabled", "success");
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">Feature Flags</p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Feature Flags</h1>
        <p className="mt-2 text-sm text-stone/60">
          Operational kill switches — changes take effect immediately, no deploy needed.
        </p>
      </motion.div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 space-y-4"
        >
          {FLAG_META.map((f) => (
            <AdminToggle
              key={f.key}
              label={f.label}
              description={f.description}
              checked={!!flags[f.key]}
              onChange={(next) => toggle(f.key, next)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
