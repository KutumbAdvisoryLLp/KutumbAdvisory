"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { categories } from "@/lib/journal-data";

const topicIcons: Record<string, string> = {
  investment: "M2 12h20M12 2v20",
  insurance: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  retirement: "M2 20h20M4 20V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12M8 20V6M16 20V6",
  estate: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  tax: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  business: "M22 12h-4l-3 9L9 3l-3 9H2",
  legacy: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 22V12h6v10",
  family: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

export default function JournalTopics() {
  return (
    <AnimatedSection className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Topics
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Browse by Topic
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Explore our library of family wealth insights organised by the
            dimensions that matter most.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-pointer rounded-2xl border border-navy/5 bg-cream p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 sm:p-8"
            >
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
                  <path d={topicIcons[cat.icon] || "M12 2v20M2 12h20"} />
                </svg>
              </div>
              <h3 className="mt-5 font-serif text-xl text-navy sm:text-2xl">
                {cat.name}
              </h3>
              <p className="mt-2 text-sm text-stone/50">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
