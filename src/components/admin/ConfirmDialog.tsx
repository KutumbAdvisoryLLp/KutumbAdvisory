"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
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
          <motion.div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(32,27,98,0.2)]"
          >
            <h3 className="font-serif text-2xl text-navy">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone/70">
              {description}
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone/60 transition-colors duration-300 hover:text-navy"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 ${
                  danger
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-navy hover:bg-navy/90"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
