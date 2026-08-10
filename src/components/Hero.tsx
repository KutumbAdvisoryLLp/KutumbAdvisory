"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import { KundaliEmblem, FamiliesIcon, AssetsIcon, YearsIcon } from "./icons";

function KundaliIllustration() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[420px] lg:min-h-[520px]">
      <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.02] via-transparent to-gold/[0.02] rounded-3xl" />

      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-navy/8"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-dashed border-gold/15"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-navy/6"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-gold/10"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex items-center justify-center"
        >
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shadow-2xl shadow-navy/20">
              <KundaliEmblem size={44} className="text-white" />
            </div>
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-4 rounded-full bg-gold/10 blur-2xl -z-10"
            />
          </div>
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute w-2 h-2 rounded-full bg-gold/20"
              style={{
                transform: `rotate(${angle}deg) translateX(130px)`,
              }}
            />
          ))}
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={angle}
              className="absolute w-1.5 h-1.5 rounded-full bg-navy/10"
              style={{
                transform: `rotate(${angle}deg) translateX(100px)`,
              }}
            />
          ))}
        </motion.div>

        <svg
          className="absolute w-80 h-80 sm:w-96 sm:h-96"
          viewBox="0 0 400 400"
          fill="none"
        >
          <motion.path
            d="M 80 200 A 120 120 0 0 1 320 200"
            stroke="#A8791F"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M 50 200 A 150 150 0 0 0 350 200"
            stroke="#201B62"
            strokeWidth="0.5"
            strokeOpacity="0.1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
    </div>
  );
}

const stats = [
  { value: "400+", label: "Families Guided", icon: FamiliesIcon },
  { value: "\u20B9100Cr+", label: "Assets Protected", icon: AssetsIcon },
  { value: "12+", label: "Years of Excellence", icon: YearsIcon },
];

export default function Hero() {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-8 pt-36 pb-24 lg:px-10 lg:pt-44 lg:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-28">
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-xs font-medium tracking-[0.12em] uppercase text-[#B8862B]"
            >
              Premium Family Wealth Advisory
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 sm:mt-10 font-serif text-4xl sm:text-7xl lg:text-8xl leading-[1.1] sm:leading-[1.08] tracking-tight text-navy lg:leading-[1.06]"
            >
              Your family&apos;s finances are a universe.
              <br />
              <span className="text-gold">See it whole.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 sm:mt-8 max-w-xl text-lg sm:text-2xl leading-relaxed text-stone"
            >
              Most families don&apos;t have a money problem. They have a
              visibility problem. Financial Kundali brings every corner of your
              family&apos;s wealth into one connected view.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-col gap-4 sm:flex-row sm:items-end"
            >
              <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#B8862B]/70">
                  Premium Assessment
                </span>
                <Button variant="gold" size="lg" href="#financial-kundali" className="w-full sm:w-auto">
                  Start Your Financial Kundali
                </Button>
              </div>
              <Button variant="secondary" size="lg" href="#toolkit" className="w-full sm:w-auto sm:self-end">
                Explore Financial Toolkit
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-12 sm:mt-16 flex items-start justify-center sm:justify-start gap-6 sm:gap-10 lg:gap-16"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory shadow-[inset_0_1px_2px_rgba(32,27,98,0.03),0_4px_12px_rgba(32,27,98,0.04)] border border-gold/15">
                    <stat.icon size={18} className="text-gold" />
                  </div>
                  <span className="mt-3 font-serif text-2xl font-semibold text-navy sm:text-3xl leading-none">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-[10px] text-stone/50 tracking-wide font-medium uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-ivory/80 shadow-xl shadow-navy/5"
          >
            <KundaliIllustration />

            <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-navy/[0.02] blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
