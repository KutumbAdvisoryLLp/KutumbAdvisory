"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function AboutFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-32 sm:py-40 lg:py-48">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-8 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8862B" strokeWidth="1.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Begin Your Journey
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.15]">
            Your Family Already Has a Story.
            <br />
            <span className="text-[#B8862B]">Let&apos;s Help Write Its Financial Future.</span>
          </h2>

          <p className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            The Financial Kundali reveals the architecture of your family&apos;s
            wealth connecting every dimension into one clear, actionable view.
            Begin your journey toward complete financial clarity.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="gold"
              size="lg"
              href="/mykundali"
              className="min-w-[220px]"
              showArrow={false}
            >
              Start Your Financial Kundali
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/toolkit"
              className="!border-white/20 !bg-transparent !text-white hover:!border-gold/40 hover:!bg-gold hover:!text-white"
            >
              Explore Financial Toolkit
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
