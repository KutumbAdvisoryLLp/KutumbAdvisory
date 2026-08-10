"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  bg_color: string;
  text_color: string;
  is_active: boolean;
}

export default function AnnouncementBar() {
  const supabase = useMemo(() => createClient(), []);
  const [banner, setBanner] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setBanner(data as Announcement);
    })();
  }, [supabase]);

  if (!banner || !banner.is_active || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md"
        onClick={() => setDismissed(true)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-navy p-6 sm:p-8 text-white shadow-2xl border border-gold/20 select-none overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

          {/* Close X Button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-5 top-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Announcement"
          >
            <X size={18} />
          </button>

          {/* Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/30 mb-4">
            <Sparkles className="w-6 h-6 text-gold" />
          </div>

          {/* Header */}
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-gold/80 block mb-1">
            Announcement
          </span>

          {/* Content Message */}
          <p className="font-serif text-lg sm:text-xl text-white leading-relaxed mb-6">
            {banner.message}
          </p>

          {/* CTA Link Button */}
          {banner.link_text && banner.link_url && (
            <div className="pt-2">
              <Link
                href={banner.link_url}
                onClick={() => setDismissed(true)}
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gold text-navy font-medium text-sm hover:bg-gold-dark transition-all duration-300 shadow-md"
              >
                {banner.link_text}
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
