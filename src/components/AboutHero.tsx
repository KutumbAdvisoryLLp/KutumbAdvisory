"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function AboutHero() {
  return (
    <section className="relative min-h-[85dvh] overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-8 pt-36 pb-20 lg:px-10 lg:pt-44 lg:pb-28">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-xs font-medium tracking-[0.12em] uppercase text-[#B8862B]"
            >
              About Kutumb
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 font-serif text-5xl leading-[1.08] tracking-tight text-navy sm:text-6xl lg:text-7xl lg:leading-[1.06]"
            >
              Building Wealth.
              <br />
              Preserving Legacies.
              <br />
              <span className="text-gold">Guiding Families.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 max-w-xl text-lg leading-relaxed text-stone sm:text-xl"
            >
              Kutumb exists because most families manage their finances in
              isolation disconnected products, scattered advice, no unified
              view. We built Financial Kundali to change that.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-col gap-4 sm:flex-row"
            >
              <Button variant="gold" size="lg" href="/#financial-kundali" showArrow={false}>
                Start Your Financial Kundali
              </Button>
              <Button variant="secondary" size="lg" href="/#toolkit">
                Explore Financial Toolkit
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-lg lg:aspect-[3/4]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-navy/5">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#201B62"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <p className="font-serif text-xl text-navy/40">
                  Three Generations
                </p>
                <p className="mt-2 text-sm text-stone/40">Visual</p>
              </div>
            </div>

            <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-navy/[0.02] blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
