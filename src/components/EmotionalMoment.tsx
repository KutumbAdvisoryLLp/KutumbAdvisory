"use client";

import { motion } from "framer-motion";

export default function EmotionalMoment() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="mx-auto max-w-5xl px-8 py-36 sm:py-44 lg:py-56 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="font-serif text-2xl leading-snug text-navy/30 sm:text-3xl lg:text-4xl">
            Your family deserves more than
          </p>
          <p className="mt-2 font-serif text-2xl leading-snug text-navy/30 sm:text-3xl lg:text-4xl">
            financial products.
          </p>

          <div className="mx-auto my-10 h-px w-14 bg-gold/40" />

          <p className="font-serif text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            It deserves
            <br />
            <span className="text-gold">financial architecture.</span>
          </p>

          <p className="mt-8 mx-auto max-w-2xl text-lg leading-relaxed text-stone/70 sm:text-xl">
            Every family&apos;s wealth is a unique structure. Financial Kundali
            provides the blueprint \u2014 revealing how each part supports the whole.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
