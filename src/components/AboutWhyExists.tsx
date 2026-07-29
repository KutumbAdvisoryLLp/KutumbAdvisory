"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function AboutWhyExists() {
  return (
    <AnimatedSection className="bg-white py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ivory shadow-lg"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy/5">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#201B62"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <p className="font-serif text-xl text-navy/40">
                  Financial Kundali Origin
                </p>
              </div>
            </div>
          </motion.div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Why Kutumb Exists
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
              Most Families Manage Finances in Silos. We Built Something
              Different.
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-stone sm:text-xl">
              <p>
                After years of working with families across India, we noticed
                the same pattern: investments with one advisor, insurance with
                another, estate plans sitting in a drawer, tax strategies
                disconnected from everything else.
              </p>
              <p>
                Financial Kundali was created to solve one problem — give every
                family a single, connected view of their entire financial
                universe. Not another dashboard. A complete architectural
                portrait.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 max-w-16 bg-gold/30" />
              <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                A new approach
              </span>
              <div className="h-px flex-1 max-w-16 bg-gold/30" />
            </div>

            <p className="mt-6 text-lg leading-relaxed text-stone/80 sm:text-xl">
              One family. One plan. One connected view. That is the Kutumb
              difference.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
