"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function JournalCTA() {
  return (
    <section className="relative overflow-hidden bg-cream py-28 sm:py-36 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-navy/[0.02] blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-8 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Next Step
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl lg:leading-[1.15]">
            Knowledge Is the Foundation.
            <br />
            <span className="text-gold">Your Financial Kundali Is the Blueprint.</span>
          </h2>

          <p className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-stone sm:text-xl">
            You have read the insights. Now see where your own family stands.
            Financial Kundali reveals the complete architecture of your
            family&apos;s wealth — in one connected view.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="gold"
              size="lg"
              href="/#financial-kundali"
              className="min-w-[220px]"
              showArrow={false}
            >
              Start Your Financial Kundali
            </Button>
            <Button variant="secondary" size="lg" href="/#toolkit">
              Explore Financial Toolkit
            </Button>
          </div>

          <p className="mt-8 text-xs text-stone/50 tracking-wide">
            No commitment required. Understand your family&apos;s financial
            universe in minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
