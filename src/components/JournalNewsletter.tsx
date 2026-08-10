"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function JournalNewsletter() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim() });

    if (error) {
      setStatus("error");
      return;
    }

    setEmail("");
    setStatus("success");
  };

  return (
    <section className="bg-navy py-28 sm:py-36 lg:py-40">
      <div className="mx-auto max-w-3xl px-8 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            className="mx-auto mb-6 h-8 w-8 text-gold/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>

          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Newsletter
          </p>

          <h2 className="mt-6 font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
            One Insight.
            <br />
            <span className="text-gold">Once a Month. No Noise.</span>
          </h2>

          <p className="mt-6 mx-auto max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
            No spam. No daily emails. Just one carefully crafted insight each
            month delivered to your inbox with the same care we put into our
            advisory work.
          </p>

          {status === "success" ? (
            <p className="mt-10 font-serif text-lg text-gold">
              You&apos;re subscribed. Thank you.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-[18px] border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-gold/40 focus:bg-white/10"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-[18px] bg-gold px-6 py-3 text-sm font-semibold text-white transition-all duration-500 hover:bg-gold-light hover:shadow-xl hover:shadow-gold/20 disabled:opacity-60"
              >
                {status === "submitting" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-4 text-[12px] text-red-300">
              Something went wrong — please try again.
            </p>
          )}

          <p className="mt-4 text-[11px] text-white/20 tracking-wide">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
