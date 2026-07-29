"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Container } from "./icons/Container";
import {
  InvestmentIcon,
  ProtectionIcon,
  LegacyIcon,
  RetirementIcon,
  TaxIcon,
  BusinessIcon,
  ArrowRight,
  CheckIcon,
} from "./icons";

const disconnected = [
  { label: "Investments", icon: InvestmentIcon },
  { label: "Insurance", icon: ProtectionIcon },
  { label: "Estate", icon: LegacyIcon },
  { label: "Retirement", icon: RetirementIcon },
  { label: "Tax", icon: TaxIcon },
  { label: "Business", icon: BusinessIcon },
];

function DisconnectedList() {
  return (
    <div className="space-y-3">
      {disconnected.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -24, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 rounded-xl bg-ivory/50 px-5 py-4 border border-gold/8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          <Container size="sm" variant="circle">
            <item.icon size={14} className="text-navy/35" />
          </Container>
          <span className="font-medium text-navy/60 text-base sm:text-lg">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ConnectedList() {
  return (
    <div className="relative">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[22px] top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-gold via-gold/40 to-transparent"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[22px] top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-gold/10 via-gold/20 to-transparent blur-sm"
      />
      <div className="space-y-3">
        {disconnected.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center gap-4 rounded-xl bg-navy px-5 py-4 shadow-[0_4px_16px_rgba(32,27,98,0.15),0_0_0_1px_rgba(168,121,31,0.08)]"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory shadow-[inset_0_1px_2px_rgba(32,27,98,0.02),0_2px_8px_rgba(32,27,98,0.04)] border border-gold/20"
            >
              <item.icon size={18} className="text-gold" />
            </motion.div>
            <span className="relative z-10 font-medium text-white text-base sm:text-lg">
              {item.label}
            </span>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.3 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gold/40">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Problem() {
  return (
    <AnimatedSection className="bg-white py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]"
          >
            The Problem
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]"
          >
            Most families don&apos;t have a money problem.
            <br />
            <span className="text-gold">They have a visibility problem.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-lg leading-relaxed text-stone sm:text-xl"
          >
            Your wealth is scattered across accounts, advisors, instruments, and
            intentions. Without a single source of truth, even the best plans
            unravel.
          </motion.p>
        </div>

        <div className="relative mt-28 lg:mt-36">
          <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-28">
            <div className="relative">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-serif text-2xl text-navy/40 mb-10 tracking-wide"
              >
                Disconnected
              </motion.p>
              <DisconnectedList />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex items-center justify-center gap-3 text-stone/30"
              >
                <ArrowRight size={14} className="text-stone/30" />
                <span className="text-sm tracking-wide">No single view</span>
              </motion.div>
            </div>

            <div className="relative">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-serif text-2xl text-navy mb-10 tracking-wide"
              >
                Financial Kundali
              </motion.p>
              <ConnectedList />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex items-center justify-center gap-3 text-gold/60"
              >
                <CheckIcon size={16} className="text-gold" />
                <span className="text-sm tracking-wide">Unified view</span>
              </motion.div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center">
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute"
            >
              <motion.path
                d="M 10 60 Q 60 20, 110 60"
                stroke="#A8791F"
                strokeWidth="0.5"
                strokeOpacity="0.2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M 10 60 Q 60 100, 110 60"
                stroke="#A8791F"
                strokeWidth="0.5"
                strokeOpacity="0.15"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.circle
                r="2.5"
                fill="#A8791F"
                fillOpacity="0.6"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                style={{ offsetPath: "path('M 10 60 Q 60 20, 110 60')" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              />
              <motion.circle
                r="1.5"
                fill="#A8791F"
                fillOpacity="0.3"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                style={{ offsetPath: "path('M 10 60 Q 60 100, 110 60')" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1.5 }}
              />
            </motion.svg>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gold/10"
            >
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                Connected
              </span>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 mx-auto max-w-2xl text-center text-lg leading-relaxed text-stone/60 sm:text-xl"
        >
          Financial Kundali transforms scattered financial products into a
          connected architectural view of your family&apos;s wealth.
        </motion.p>
      </div>
    </AnimatedSection>
  );
}
