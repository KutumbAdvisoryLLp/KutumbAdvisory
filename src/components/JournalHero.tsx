"use client";

import { motion } from "framer-motion";
import { categories } from "@/lib/journal-data";

const categoryIcons: Record<string, string> = {
  Investment: "M2 12h20M12 2v20",
  Insurance: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  Retirement: "M2 20h20M4 20V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12M8 20V6M16 20V6",
  "Estate Planning": "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  Tax: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  Business: "M22 12h-4l-3 9L9 3l-3 9H2",
  Legacy: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 22V12h6v10",
  "Family Wealth": "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

export default function JournalHero() {
  return (
    <section className="relative min-h-[60dvh] overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-8 pt-36 pb-20 lg:px-10 lg:pt-44 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="inline-block rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-xs font-medium tracking-[0.12em] uppercase text-[#B8862B]">
            Knowledge Library
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[1.08] tracking-tight text-navy sm:text-6xl lg:text-7xl lg:leading-[1.06]">
            Family Wealth Journal
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone sm:text-xl">
            Thoughtful insights on building, protecting and transferring family
            wealth across generations. No noise. No fluff. Just timeless
            principles and practical guidance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full rounded-[18px] border border-navy/10 bg-white py-3.5 pl-11 pr-5 text-sm text-navy placeholder:text-stone/40 outline-none transition-all duration-300 focus:border-gold/40 focus:shadow-lg focus:shadow-gold/5"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="group inline-flex items-center gap-2 rounded-full border border-navy/8 bg-white px-4 py-2 text-xs font-medium text-stone/70 transition-all duration-300 hover:border-gold/30 hover:bg-cream hover:text-navy"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={categoryIcons[cat.name] || "M12 2v20M2 12h20"} />
              </svg>
              {cat.name}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
