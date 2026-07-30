"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SearchIcon, UsersIcon } from "@/components/icons/admin";
import CustomerDetailModal from "@/components/admin/CustomerDetailModal";

export interface CustomerListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: "not-started" | "in-progress" | "completed";
  overallScore: number | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminCustomersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerListItem | null>(null);

  useEffect(() => {
    (async () => {
      const [customersRes, profilesRes, resultsRes] = await Promise.all([
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("family_profiles").select("customer_id"),
        supabase.from("assessment_results").select("customer_id, overall_score"),
      ]);

      const profileIds = new Set((profilesRes.data ?? []).map((p: any) => p.customer_id));
      const resultsById = new Map(
        (resultsRes.data ?? []).map((r: any) => [r.customer_id, r.overall_score])
      );

      const rows: CustomerListItem[] = (customersRes.data ?? []).map((c: any) => {
        const overallScore = resultsById.get(c.id) ?? null;
        const status: CustomerListItem["status"] =
          overallScore !== null ? "completed" : profileIds.has(c.id) ? "in-progress" : "not-started";
        return {
          id: c.id,
          fullName: c.full_name,
          email: c.email,
          phone: c.phone ?? "",
          createdAt: c.created_at,
          status,
          overallScore,
        };
      });

      setCustomers(rows);
      setLoading(false);
    })();
  }, [supabase]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter(
      (c) => !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const statusLabel: Record<CustomerListItem["status"], string> = {
    "not-started": "Not started",
    "in-progress": "Assessment in progress",
    completed: "Completed",
  };

  const statusStyles: Record<CustomerListItem["status"], string> = {
    "not-started": "bg-stone/10 text-stone/60",
    "in-progress": "bg-gold/10 text-gold-dark",
    completed: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          Customers
        </p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
          My Kutumb Customers
        </h1>
        <p className="mt-2 text-sm text-stone/60">
          {customers.length} registered customers.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-8 w-full max-w-sm"
      >
        <SearchIcon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone/30"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
      >
        {!loading && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-stone/50">
            <UsersIcon size={22} className="text-stone/20" />
            No customers match your search.
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="grid w-full grid-cols-1 gap-3 p-5 text-left sm:grid-cols-[1.6fr_1fr_1fr_auto] sm:items-center sm:gap-4 sm:p-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{c.fullName}</p>
                  <p className="truncate text-xs text-stone/50">
                    {c.email} &middot; {c.phone || "—"}
                  </p>
                </div>
                <div className="text-sm text-stone/70">
                  Signed up {formatDate(c.createdAt)}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[c.status]}`}
                  >
                    {statusLabel[c.status]}
                  </span>
                </div>
                <div className="text-sm font-medium text-navy sm:text-right">
                  {c.overallScore !== null ? `${c.overallScore}/90` : "—"}
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
