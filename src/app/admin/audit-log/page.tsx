"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { History } from "lucide-react";

type AuditLogRow = Database["public"]["Tables"]["admin_audit_log"]["Row"];

interface AuditRow {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  deviceLabel: string | null;
  ipAddress: string | null;
  createdAt: string;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const actionLabels: Record<string, string> = {
  "payment.grant": "Granted payment access",
  "payment.revoke": "Revoked payment access",
  "payment.refund": "Marked payment refunded",
  "customer.reset_password": "Reset customer password",
  "customer.resend_welcome_email": "Resent welcome email",
  "customer.delete": "Deleted customer",
  "customer.delete_all": "Deleted all customers",
  "feature_flag.toggle": "Toggled feature flag",
  "email_template.save": "Saved email template",
};

export default function AdminAuditLogPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      setRows(
        (data ?? []).map((r: AuditLogRow) => ({
          id: r.id,
          adminEmail: r.admin_email,
          action: r.action,
          targetType: r.target_type,
          targetId: r.target_id,
          deviceLabel: r.device_label,
          ipAddress: r.ip_address,
          createdAt: r.created_at,
        }))
      );
      setLoading(false);
    })();
  }, [supabase]);

  const actionTypes = useMemo(() => ["all", ...Array.from(new Set(rows.map((r) => r.action)))], [rows]);

  const filtered = useMemo(
    () => (actionFilter === "all" ? rows : rows.filter((r) => r.action === actionFilter)),
    [rows, actionFilter]
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">Audit Log</p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Admin Activity</h1>
        <p className="mt-2 text-sm text-stone/60">
          Every sensitive admin action — who did it, when, and from what device. Most recent 300 entries.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-wrap gap-2"
      >
        {actionTypes.map((a) => (
          <button
            key={a}
            onClick={() => setActionFilter(a)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${
              actionFilter === a ? "bg-navy text-white" : "bg-white text-stone/60 hover:bg-cream/60"
            }`}
          >
            {a === "all" ? "All actions" : actionLabels[a] ?? a}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
      >
        {!loading && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-stone/50">
            <History size={22} className="text-stone/20" />
            No activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {filtered.map((r) => (
              <div key={r.id} className="grid gap-2 p-5 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center sm:gap-4 sm:p-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{actionLabels[r.action] ?? r.action}</p>
                  <p className="truncate text-xs text-stone/50">
                    {r.adminEmail}
                    {r.targetId ? ` · ${r.targetType ?? "target"}: ${r.targetId.slice(0, 8)}…` : ""}
                  </p>
                </div>
                <p className="text-xs text-stone/50">{r.deviceLabel ?? "Unknown device"}</p>
                <p className="text-xs text-stone/40">{r.ipAddress ?? "—"}</p>
                <p className="text-xs text-stone/50 sm:text-right">{formatDateTime(r.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
