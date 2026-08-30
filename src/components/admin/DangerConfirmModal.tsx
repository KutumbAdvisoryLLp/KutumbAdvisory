"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { createClient } from "@/lib/supabase/client";

interface DangerConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function DangerConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete Permanently",
  onCancel,
  onConfirm,
}: DangerConfirmModalProps) {
  const { adminEmail } = useAdminAuth();
  const [typed, setTyped] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = typed.trim().toLowerCase() === "delete" && password.length > 0;

  const handleClose = () => {
    if (submitting) return;
    setTyped("");
    setPassword("");
    setError("");
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting || !adminEmail) return;

    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password,
    });

    if (authError) {
      setSubmitting(false);
      setError("Incorrect password.");
      return;
    }

    try {
      await onConfirm();
      setTyped("");
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-6"
        >
          <motion.div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(32,27,98,0.2)]"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-serif text-2xl text-navy">{title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone/70">{description}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">
                  Type <span className="font-mono text-red-600">delete</span> to confirm
                </label>
                <input
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-red-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">
                  Confirm your admin password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-red-400 outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone/60 transition-colors duration-300 hover:text-navy"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? "Deleting..." : confirmLabel}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
