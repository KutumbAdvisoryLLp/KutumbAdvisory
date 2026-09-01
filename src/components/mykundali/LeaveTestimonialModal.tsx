"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LeaveTestimonialModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  defaultName: string;
}

export default function LeaveTestimonialModal({
  open,
  onClose,
  userId,
  defaultName,
}: LeaveTestimonialModalProps) {
  const [name, setName] = useState(defaultName);
  const [testimonial, setTestimonial] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    onClose();
    // Reset after the close animation so the form is fresh next time it opens.
    setTimeout(() => {
      setName(defaultName);
      setTestimonial("");
      setSubmitted(false);
      setError("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !testimonial.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("testimonial_submissions").insert({
      customer_id: userId,
      name: name.trim(),
      testimonial: testimonial.trim(),
    });

    setSubmitting(false);
    if (insertError) {
      setError("Could not submit your testimonial. Please try again.");
      return;
    }
    setSubmitted(true);
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
          <motion.div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(32,27,98,0.2)]"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-stone/40 hover:bg-cream hover:text-navy transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <Check size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-serif text-xl text-navy">Thank you!</h3>
                <p className="mt-2 text-sm text-stone/70">
                  Your testimonial has been submitted for review.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl text-navy">Leave a Testimonial</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone/70">
                  Share your experience with Kutumb — we may feature it on our site.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={200}
                      className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">
                      Your Testimonial
                    </label>
                    <textarea
                      rows={4}
                      value={testimonial}
                      onChange={(e) => setTestimonial(e.target.value)}
                      placeholder="Tell us about your experience with Kutumb..."
                      maxLength={2000}
                      className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none resize-none"
                    />
                    <p className="mt-1 text-right text-[11px] text-stone/40">
                      {testimonial.length}/2000
                    </p>
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
                      disabled={submitting}
                      className="rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-navy shadow-md transition-all duration-300 hover:bg-gold-dark disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
