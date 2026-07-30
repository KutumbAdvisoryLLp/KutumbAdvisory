"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { useToast } from "@/components/admin/ToastContext";
import StatusPill from "@/components/admin/StatusPill";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import LeadDetailModal from "@/components/admin/LeadDetailModal";
import type { Lead, LeadStatus } from "@/lib/admin-mock-data";
import {
  SearchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons/admin";

const statusFilters: (LeadStatus | "all")[] = [
  "all",
  "new",
  "contacted",
  "scheduled",
  "closed",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminContactPage() {
  const { leads, updateLead, deleteLead } = useAdminData();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activeMode, setActiveMode] = useState<"view" | "edit">("view");
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => (statusFilter === "all" ? true : l.status === statusFilter))
      .filter(
        (l) =>
          !q ||
          l.fullName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
      .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  }, [leads, search, statusFilter]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteLead(deleteTarget.id);
    showToast("Lead deleted");
    setDeleteTarget(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          Leads
        </p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
          Contact Submissions
        </h1>
        <p className="mt-2 text-sm text-stone/60">
          {leads.length} total submissions from the consultation form.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full sm:max-w-xs">
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
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-2 text-xs font-medium capitalize transition-all duration-300 ${
                statusFilter === s
                  ? "bg-navy text-white shadow-md"
                  : "bg-white text-stone/60 shadow-[0_0_0_1px_rgba(168,121,31,0.1)] hover:text-navy"
              }`}
            >
              {s}
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
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-stone/50">
            No leads match your search.
          </p>
        ) : (
          <div className="divide-y divide-navy/6">
            {filtered.map((lead) => (
              <div
                key={lead.id}
                className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-[1.6fr_1fr_1fr_auto] sm:items-center sm:gap-4 sm:p-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">
                    {lead.fullName}
                  </p>
                  <p className="truncate text-xs text-stone/50">
                    {lead.email} &middot; {lead.phone}
                  </p>
                </div>
                <div className="text-sm text-stone/70">
                  <p className="truncate">{lead.city || "—"}</p>
                  <p className="truncate text-xs text-stone/50">
                    {lead.primaryGoal}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={lead.status} />
                  <span className="text-xs text-stone/40">
                    {formatDate(lead.submittedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <button
                    onClick={() => {
                      setActiveLead(lead);
                      setActiveMode("view");
                    }}
                    aria-label="View lead"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory text-navy/60 transition-colors duration-300 hover:text-gold"
                  >
                    <EyeIcon size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setActiveLead(lead);
                      setActiveMode("edit");
                    }}
                    aria-label="Edit lead"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory text-navy/60 transition-colors duration-300 hover:text-gold"
                  >
                    <PencilIcon size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(lead)}
                    aria-label="Delete lead"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory text-navy/60 transition-colors duration-300 hover:text-red-500"
                  >
                    <TrashIcon size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <LeadDetailModal
        lead={activeLead}
        initialEditMode={activeMode === "edit"}
        onClose={() => setActiveLead(null)}
        onSave={(id, patch) => {
          updateLead(id, patch);
          showToast("Lead updated");
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this lead?"
        description={`This will permanently remove ${deleteTarget?.fullName ?? "this lead"}'s submission. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
