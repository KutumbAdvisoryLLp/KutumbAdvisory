"use client";

import { motion } from "framer-motion";
import { featuredStory } from "@/lib/journal-data";
import JournalArticleCard from "./JournalArticleCard";

export default function JournalFeatured() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <JournalArticleCard article={featuredStory} variant="featured" />

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gold transition-all duration-300 hover:gap-3">
            <span>Read the full story</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
