"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { financialGuides } from "@/lib/journal-data";

const guideIcons: Record<string, string> = {
  estate: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  insurance: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  retirement: "M2 20h20M4 20V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12M8 20V6M16 20V6",
  documents: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  investment: "M2 12h20M12 2v20",
};

export default function JournalGuides() {
  return (
    <AnimatedSection className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Resources
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Financial Guides
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Premium resources designed to help your family take the next step
            toward complete financial clarity.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {financialGuides.map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative cursor-pointer rounded-2xl border border-navy/5 bg-cream p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-navy shadow-[0_0_0_1px_rgba(168,121,31,0.06)] transition-all duration-500 group-hover:bg-gold/10 group-hover:text-gold">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={guideIcons[guide.icon] || "M12 2v20M2 12h20"} />
                  </svg>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A8791F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500 group-hover:translate-x-1"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <h3 className="mt-6 font-serif text-xl text-navy sm:text-2xl">
                {guide.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone/80">
                {guide.desc}
              </p>
              <p className="mt-4 text-xs text-stone/50">{guide.pages}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
