"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-28 sm:py-36 lg:py-44">
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-gold/[0.02] to-transparent pointer-events-none" />
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-gold/[0.05]" />
      <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full border border-gold/[0.04]" />

      {/* Gold accent lines */}
      <div className="absolute left-8 right-8 top-[20%] h-px bg-gradient-to-r from-transparent via-gold/[0.07] to-transparent sm:left-16 sm:right-16" />
      <div className="absolute left-8 right-8 bottom-[20%] h-px bg-gradient-to-r from-transparent via-gold/[0.05] to-transparent sm:left-16 sm:right-16" />

      <div className="relative mx-auto max-w-4xl px-8 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gold icon */}
          <svg
            className="mx-auto h-10 w-10 text-gold/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>

          <p className="mt-6 text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Begin Your Journey
          </p>

          <h2 className="mt-8 font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            Every Meaningful Family Legacy
            <br />
            <span className="text-gold">Begins With One Conversation.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Not a sales pitch. Not a product demonstration. Just a genuine
            conversation about your family&apos;s financial future. Let us begin
            with a cup of tea and an open mind.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="gold"
              size="lg"
              href="#consultation-form"
              className="min-w-[220px]"
              showArrow={false}
            >
              Book a Consultation
            </Button>
            <Button variant="ghost" size="lg" href="/#financial-kundali">
              <span className="text-white/70 hover:text-gold transition-colors duration-300">
                Explore Financial Kundali
              </span>
            </Button>
          </div>

          <p className="mt-10 text-xs tracking-wide text-white/20">
            No commitment required. Just clarity.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
