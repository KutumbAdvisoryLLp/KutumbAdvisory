"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: "12+", label: "Years of Consistent Excellence", desc: "Over a decade of uninterrupted service to multi-generational families" },
  { value: "50+", label: "Awards Across Categories", desc: "Industry recognition for advisory excellence and client outcomes" },
  { value: "COT", label: "Court of the Table", desc: "MDRT's prestigious Council honouring top-performing advisors" },
  { value: "TOT", label: "Top of the Table", desc: "The highest tier of MDRT qualification for elite advisors" },
];

const recognitions = [
  { title: "MDRT Qualifications", desc: "Million Dollar Round Table — the global standard for financial advisory excellence", icon: "award" },
  { title: "COT — Court of the Table", desc: "Top 1% of advisors worldwide recognised for exceptional client outcomes", icon: "star" },
  { title: "TOT — Top of the Table", desc: "The most exclusive tier, reserved for the highest-performing advisors globally", icon: "star" },
  { title: "PFP", desc: "Personal Financial Planner certification for comprehensive wealth advisory", icon: "cert" },
];

function StatIcon({ i }: { i: number }) {
  const icons = [
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  ];
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[i]} />
    </svg>
  );
}

function RecogIcon({ icon }: { icon: string }) {
  if (icon === "award") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  }
  if (icon === "star") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export default function AboutTrust() {
  return (
    <AnimatedSection className="bg-cream py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Recognition & Achievements
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
            A Legacy of{" "}
            <span className="text-[#B8862B]">Professional Excellence</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Industry-leading qualifications and recognition that reflect our
            unwavering commitment to the highest standards of family advisory.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8862B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-[#B8862B] shadow-[0_0_0_1px_rgba(184,134,43,0.1)] transition-all duration-500 group-hover:bg-[#B8862B] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#B8862B]/20">
                <StatIcon i={i} />
              </div>
              <p className="mt-6 font-serif text-4xl font-semibold text-navy sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-[#B8862B]">{s.label}</p>
              <div className="mx-auto mt-4 h-px w-10 bg-[#B8862B]/20" />
              <p className="mt-4 text-sm leading-relaxed text-stone/70">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Professional Qualifications
            </p>
            <h3 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-4xl">
              Globally Recognised{" "}
              <span className="text-[#B8862B]">Standards of Excellence</span>
            </h3>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {recognitions.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-start gap-5 rounded-2xl border border-gold/10 bg-white p-6 transition-all duration-500 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 sm:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B8862B]/10 text-[#B8862B] transition-all duration-500 group-hover:bg-[#B8862B] group-hover:text-white">
                  <RecogIcon icon={r.icon} />
                </div>
                <div>
                  <p className="font-serif text-lg text-navy sm:text-xl">{r.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone/70">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
