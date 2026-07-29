"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import Button from "./Button";
import {
  DhanaIcon,
  VidyaIcon,
  KarmaIcon,
  RakshaIcon,
  SampattiIcon,
  VishramaIcon,
  KarzaIcon,
  VyayaIcon,
  DayaIcon,
} from "./icons";

const grahas = [
  { name: "Dhana Graha", desc: "Wealth & Assets", icon: DhanaIcon },
  { name: "Vidya Graha", desc: "Financial Knowledge", icon: VidyaIcon },
  { name: "Karma Graha", desc: "Income & Profession", icon: KarmaIcon },
  { name: "Raksha Graha", desc: "Insurance & Protection", icon: RakshaIcon },
  { name: "Sampatti Graha", desc: "Estate & Property", icon: SampattiIcon },
  { name: "Vishrama Graha", desc: "Retirement", icon: VishramaIcon },
  { name: "Karza Graha", desc: "Liabilities & Debt", icon: KarzaIcon },
  { name: "Vyaya Graha", desc: "Spending & Cashflow", icon: VyayaIcon },
  { name: "Daya Graha", desc: "Legacy & Inheritance", icon: DayaIcon },
];

export default function FinancialKundali() {
  return (
    <AnimatedSection
      id="financial-kundali"
      variant="scale"
      className="bg-ivory py-28 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Flagship Product
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
              Financial Kundali
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
              Inspired by Jyotish Shastra, the Financial Kundali maps nine
              fundamental dimensions of your family&apos;s financial life into a
              single, holistic portrait.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-stone sm:text-xl">
              Unlike a spreadsheet or a dashboard, it reveals the relationships
              between each area \u2014 where one affects another, where gaps hide,
              and where your family&apos;s true financial strength lies.
            </p>

            <div className="mt-12">
              <Button variant="gold" size="lg" href="#">
                Start Your Financial Kundali
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-navy/5 sm:p-8">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {grahas.map((graha, i) => (
                  <motion.div
                    key={graha.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative rounded-xl bg-cream p-3 sm:p-4 transition-all duration-400 hover:bg-navy hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-navy/15 cursor-default"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-[2px]" />

                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-ivory border border-gold/12 transition-all duration-400 shadow-[inset_0_1px_2px_rgba(32,27,98,0.02)] group-hover:h-9 group-hover:w-9 group-hover:rounded-full group-hover:bg-white group-hover:border-gold/40 group-hover:shadow-lg group-hover:shadow-gold/15">
                      <graha.icon size={16} className="text-navy transition-all duration-400 group-hover:text-[#D4AF37] group-hover:scale-[1.1]" />
                    </div>
                    <p className="relative z-10 mt-2.5 text-[10px] font-semibold text-navy group-hover:text-white transition-colors duration-400 sm:text-xs">
                      {graha.name}
                    </p>
                    <p className="relative z-10 text-[9px] text-stone/60 group-hover:text-white/80 transition-colors duration-400 sm:text-[10px]">
                      {graha.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-gold/20" />
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
