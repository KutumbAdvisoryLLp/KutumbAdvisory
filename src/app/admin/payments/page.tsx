"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/ToastContext";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { SearchIcon, CloseIcon, ChevronDownIcon } from "@/components/icons/admin";
import { CreditCard } from "lucide-react";

interface PaymentRow {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  source: string;
  createdAt: string;
  paidAt: string | null;
}

interface CustomerOption {
  id: string;
  fullName: string;
  email: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-600",
  created: "bg-stone/10 text-stone/60",
  failed: "bg-red-50 text-red-500",
  revoked: "bg-red-50 text-red-500",
  refunded: "bg-amber-50 text-amber-600",
  superseded_by_retake: "bg-stone/10 text-stone/50",
};

const STATUS_FILTERS = ["all", "paid", "created", "revoked", "refunded", "failed"];

export default function AdminPaymentsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();

  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [grantOpen, setGrantOpen] = useState(false);
  const [grantCustomerId, setGrantCustomerId] = useState("");
  const [granting, setGranting] = useState(false);

  const [revokeTarget, setRevokeTarget] = useState<PaymentRow | null>(null);
  const [refundTarget, setRefundTarget] = useState<PaymentRow | null>(null);
  const [refundNote, setRefundNote] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchData = async () => {
    const [paymentsRes, customersRes] = await Promise.all([
      supabase
        .from("payments")
        .select("id, customer_id, amount, status, source, created_at, paid_at, customers(full_name, email)")
        .order("created_at", { ascending: false }),
      supabase.from("customers").select("id, full_name, email").order("full_name"),
    ]);

    const rows: PaymentRow[] = (paymentsRes.data ?? []).map(
      (p: {
        id: string;
        customer_id: string;
        amount: number;
        status: string;
        source: string;
        created_at: string;
        paid_at: string | null;
        customers: { full_name: string; email: string } | null;
      }) => ({
        id: p.id,
        customerId: p.customer_id,
        customerName: p.customers?.full_name ?? "Unknown",
        customerEmail: p.customers?.email ?? "",
        amount: p.amount,
        status: p.status,
        source: p.source,
        createdAt: p.created_at,
        paidAt: p.paid_at,
      })
    );

    setPayments(rows);
    setCustomers(
      (customersRes.data ?? []).map((c: { id: string; full_name: string; email: string }) => ({
        id: c.id,
        fullName: c.full_name,
        email: c.email,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return p.customerName.toLowerCase().includes(q) || p.customerEmail.toLowerCase().includes(q);
    });
  }, [payments, search, statusFilter]);

  const handleGrant = async () => {
    if (!grantCustomerId) return;
    setGranting(true);
    const res = await fetch("/api/admin/payments/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: grantCustomerId }),
    });
    const body = await res.json();
    setGranting(false);
    if (!res.ok) {
      showToast(body.error ?? "Could not grant access", "error");
      return;
    }
    showToast("Access granted", "success");
    setGrantOpen(false);
    setGrantCustomerId("");
    fetchData();
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setBusy(true);
    const res = await fetch("/api/admin/payments/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: revokeTarget.id }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json();
      showToast(body.error ?? "Could not revoke access", "error");
      return;
    }
    showToast(`Revoked access for ${revokeTarget.customerName}`, "success");
    setRevokeTarget(null);
    fetchData();
  };

  const handleRefund = async () => {
    if (!refundTarget) return;
    setBusy(true);
    const res = await fetch("/api/admin/payments/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: refundTarget.id, note: refundNote }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json();
      showToast(body.error ?? "Could not mark as refunded", "error");
      return;
    }
    showToast(`Marked as refunded for ${refundTarget.customerName}`, "success");
    setRefundTarget(null);
    setRefundNote("");
    fetchData();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">Payments</p>
          <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Payments</h1>
          <p className="mt-2 text-sm text-stone/60">
            {payments.length} total payment records across all customers.
          </p>
        </div>
        <button
          onClick={() => setGrantOpen(true)}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-navy px-5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90"
        >
          Grant Manual Access
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full max-w-sm">
          <SearchIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email"
            className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors duration-300 ${
                statusFilter === s ? "bg-navy text-white" : "bg-white text-stone/60 hover:bg-cream/60"
              }`}
            >
              {s === "all" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
      >
        {!loading && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-stone/50">
            <CreditCard size={22} className="text-stone/20" />
            No payments match your filters.
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="grid w-full grid-cols-1 gap-3 p-5 text-left sm:grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr_auto] sm:items-center sm:gap-4 sm:p-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{p.customerName}</p>
                  <p className="truncate text-xs text-stone/50">{p.customerEmail}</p>
                </div>
                <p className="text-sm font-medium text-navy">₹{(p.amount / 100).toLocaleString("en-IN")}</p>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                      statusStyles[p.status] ?? "bg-stone/10 text-stone/60"
                    }`}
                  >
                    {p.status.replace(/_/g, " ")}
                  </span>
                  {p.source === "manual" && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-gold-dark">
                      Manual
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone/50">{formatDate(p.paidAt ?? p.createdAt)}</p>
                <div className="flex justify-end gap-2">
                  {p.status === "paid" && (
                    <>
                      <button
                        onClick={() => setRevokeTarget(p)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors duration-300 hover:bg-red-50"
                      >
                        Revoke
                      </button>
                      <button
                        onClick={() => setRefundTarget(p)}
                        className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors duration-300 hover:bg-amber-50"
                      >
                        Refund
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {grantOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-6"
          >
            <motion.div
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
              onClick={() => {
                setGrantOpen(false);
                setGrantCustomerId("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(32,27,98,0.2)]"
            >
              <button
                onClick={() => {
                  setGrantOpen(false);
                  setGrantCustomerId("");
                }}
                aria-label="Close"
                className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg bg-ivory"
              >
                <CloseIcon size={16} className="text-navy" />
              </button>
              <h3 className="font-serif text-2xl text-navy">Grant Manual Access</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone/70">
                Unlocks the Financial Kundali dashboard for the selected customer without a real payment.
              </p>
              <div className="relative mt-6">
                <select
                  value={grantCustomerId}
                  onChange={(e) => setGrantCustomerId(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-navy/10 bg-white px-5 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
                >
                  <option value="">Select a customer…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.email}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  size={14}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-stone/30"
                />
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setGrantOpen(false);
                    setGrantCustomerId("");
                  }}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone/60 transition-colors duration-300 hover:text-navy"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!grantCustomerId || granting}
                  onClick={handleGrant}
                  className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90 disabled:opacity-40"
                >
                  {granting ? "Granting..." : "Grant Access"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!revokeTarget}
        title="Revoke access?"
        description={`This immediately re-locks the Financial Kundali dashboard for ${revokeTarget?.customerName ?? "this customer"}. They'll be sent back to the unlock page next time they visit.`}
        confirmLabel={busy ? "Revoking..." : "Revoke Access"}
        onConfirm={handleRevoke}
        onCancel={() => setRevokeTarget(null)}
      />

      <ConfirmDialog
        open={!!refundTarget}
        title="Mark as refunded?"
        description={`This marks the payment for ${refundTarget?.customerName ?? "this customer"} as refunded and re-locks their dashboard. Process the actual refund in Razorpay separately — this only updates our records.`}
        confirmLabel={busy ? "Saving..." : "Mark Refunded"}
        onConfirm={handleRefund}
        onCancel={() => {
          setRefundTarget(null);
          setRefundNote("");
        }}
      />
    </div>
  );
}
