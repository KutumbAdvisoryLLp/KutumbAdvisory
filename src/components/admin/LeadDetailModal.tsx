"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Lead, LeadStatus } from "@/lib/admin-mock-data";
import { CloseIcon, PencilIcon } from "@/components/icons/admin";
import StatusPill from "./StatusPill";

const statusOptions: LeadStatus[] = ["new", "contacted", "scheduled", "closed"];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone/40">
        {label}
      </p>
      <p className="mt-1 text-sm text-navy">{value || "—"}</p>
    </div>
  );
}

function LeadDialogContent({
  lead,
  initialEditMode,
  onClose,
  onSave,
}: {
  lead: Lead;
  initialEditMode: boolean;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Lead>) => void;
}) {
  const [editMode, setEditMode] = useState(initialEditMode);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes);

  const handleSave = () => {
    onSave(lead.id, { status, notes });
    setEditMode(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(32,27,98,0.2)] sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg bg-ivory"
        >
          <CloseIcon size={16} className="text-navy" />
        </button>

        <div className="flex items-start justify-between gap-4 pr-10">
          <div>
            <h3 className="font-serif text-2xl text-navy">{lead.fullName}</h3>
            <p className="mt-1 text-sm text-stone/50">{lead.email}</p>
          </div>
          <StatusPill status={lead.status} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          <Field label="Phone" value={lead.phone} />
          <Field label="City" value={lead.city} />
          <Field label="Occupation" value={lead.occupation} />
          <Field label="Age Group" value={lead.ageGroup} />
          <Field label="Contacting As" value={lead.contactAs} />
          <Field label="Primary Goal" value={lead.primaryGoal} />
          <Field label="Preferred Meeting" value={lead.preferredMeeting} />
          <Field label="Preferred Date" value={lead.preferredDate} />
          <Field label="Preferred Time" value={lead.preferredTime} />
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone/40">
            Status
          </p>
          {editMode ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="mt-2 h-11 w-full max-w-xs rounded-xl border border-navy/10 bg-white px-4 text-sm text-navy outline-none focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-2">
              <StatusPill status={lead.status} />
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone/40">
            Notes
          </p>
          {editMode ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-navy/10 bg-white p-4 text-sm text-navy outline-none focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
            />
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-navy/80">
              {lead.notes || "—"}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-navy/8 pt-6 text-xs text-stone/40">
          <span>
            Submitted{" "}
            {new Date(lead.submittedAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone/60 transition-colors duration-300 hover:text-navy"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 rounded-xl border border-navy/10 px-5 py-2.5 text-sm font-medium text-navy transition-all duration-300 hover:border-gold/30 hover:text-gold"
              >
                <PencilIcon size={14} />
                Edit
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeadDetailModal({
  lead,
  initialEditMode = false,
  onClose,
  onSave,
}: {
  lead: Lead | null;
  initialEditMode?: boolean;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Lead>) => void;
}) {
  return (
    <AnimatePresence>
      {lead && (
        <LeadDialogContent
          key={lead.id}
          lead={lead}
          initialEditMode={initialEditMode}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </AnimatePresence>
  );
}
