"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "./Button";
import { FamiliesIcon, AssetsIcon, YearsIcon } from "./icons";

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
            className="relative flex items-center justify-center self-start lg:mt-16 lg:justify-end"
          >
            <Image
              src="/images/hero-family-tree.png"
              alt="A family of three generations standing together beneath a tree"
              width={840}
              height={645}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full max-w-[670px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
