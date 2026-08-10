"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const milestones = [
  {
    year: "12+ Years",
    title: "Advisory Experience",
    desc: "Our founder began working with families across India, uncovering the same recurring challenge disconnected financial advice.",
    icon: "compass",
  },
  {
    year: "Recognised",
    title: "The Gap",
    desc: "Families had investments, insurance, estate plans and tax strategies but no single view connecting them. The industry was solving pieces, not the whole.",
    icon: "eye",
  },
  {
    year: "Innovation",
    title: "Financial Kundali",
    desc: "Drawing from Jyotish Shastra's holistic framework, we created a proprietary system that maps nine dimensions of family wealth into one unified portrait.",
    icon: "star",
  },
  {
    year: "Founded",
    title: "Kutumb Advisory",
    desc: "Built around the belief that every family deserves financial architecture not more financial products. A platform designed for generations, not quarters.",
    icon: "home",
  },
  {
    year: "The Future",
    title: "India's Family Wealth Architecture",
    desc: "Our vision is to establish Financial Kundali as the definitive framework for family wealth management across India bringing clarity to every family's financial universe.",
    icon: "compass",
  },
];

function MilestoneIcon({ icon }: { icon: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon === "compass" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </>
      )}
      {icon === "eye" && (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {icon === "star" && (
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      )}
      {icon === "home" && (
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      )}
    </svg>
  );
}

export default function AboutJourney() {
  return (
    <AnimatedSection className="bg-white py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Our Journey
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            The Kutumb Journey
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            From years of advisory experience to a vision for India&apos;s first
            family wealth architecture.
          </p>
        </div>

        <div className="relative mt-24 lg:mt-32">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#B8862B]/30 via-[#B8862B]/10 to-[#B8862B]/5 -translate-x-1/2" />

          <div className="relative space-y-16 lg:space-y-24">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-start gap-8 lg:gap-12`}
              >
                <div className="flex-1 w-full lg:w-auto">
                  <div
                    className={`rounded-2xl bg-cream p-8 shadow-sm transition-all duration-500 hover:shadow-md lg:p-10 ${
                      i % 2 === 0 ? "lg:text-right" : ""
                    }`}
                  >
                    <span className="font-serif text-xs tracking-[0.15em] uppercase text-[#B8862B]">
                      {m.year}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl text-navy sm:text-3xl">
                      {m.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-stone/80 sm:text-lg">
                      {m.desc}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center shrink-0">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#B8862B] text-white shadow-md shadow-[#B8862B]/20">
                    <MilestoneIcon icon={m.icon} />
                  </div>
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-center pt-8"
            >
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 -top-12 w-px h-12 bg-gradient-to-b from-transparent to-[#B8862B]/10" />
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B8862B]/10 ring-2 ring-[#B8862B]/20">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8862B" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <p className="font-serif text-lg text-navy">Today</p>
                <p className="text-xs text-stone/50">The Journey Continues</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
