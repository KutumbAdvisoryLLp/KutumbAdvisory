"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "./Button";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-36 pb-24 sm:pt-44 sm:pb-32 lg:pt-48 lg:pb-36">
      <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.03] via-transparent to-gold/[0.04] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy/[0.02] to-transparent pointer-events-none" />

      {/* Decorative gold circles */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full border border-gold/[0.04]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-gold/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Begin Your Journey
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              Let&apos;s Build Your Family&apos;s Financial Future Together.
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl max-w-xl">
              Whether you are planning retirement, protecting your family&apos;s
              wealth, preparing for the next generation, or seeking complete
              financial clarity. Kutumb is here to help.
            </p>
            <p className="mt-4 text-base leading-relaxed text-stone/70 max-w-xl">
              We don&apos;t sell financial products. We build financial
              architectures. One family at a time.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button variant="gold" size="lg" href="#consultation-form" showArrow={false}>
                Book a Consultation
              </Button>
              <Button variant="secondary" size="lg" href="/#financial-kundali">
                Explore Financial Kundali
              </Button>
            </div>
          </motion.div>

          {/* Right — Editorial Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_0_0_1px_rgba(168,121,31,0.1),0_8px_32px_rgba(32,27,98,0.06)]">
              <Image
                src="/images/3.png"
                alt="A golden winding path leading toward a glowing horizon, flanked by icons representing wealth, protection, and growth"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 rounded-2xl bg-white/90 backdrop-blur-sm px-5 py-4 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_4px_20px_rgba(32,27,98,0.06)]">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                Response Time
              </p>
              <p className="mt-1 font-serif text-xl text-navy">Within 24 Hours</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
