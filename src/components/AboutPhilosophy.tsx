"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const pillars = [
  {
    title: "Protect",
    desc: "We build financial resilience that safeguards your family against uncertainty ensuring your wealth endures through every stage of life.",
    icon: "protect",
  },
  {
    title: "Grow",
    desc: "Through disciplined, personalised strategies we help your wealth expand across generations not just for today, but for those who follow.",
    icon: "grow",
  },
  {
    title: "Manage",
    desc: "We bring order and clarity to your financial life consolidating every dimension into a single, visible, actionable architecture.",
    icon: "manage",
  },
  {
    title: "Transfer",
    desc: "We ensure your family's wealth moves seamlessly across generations with structures that honour your intentions and protect your legacy.",
    icon: "transfer",
  },
];

function PillarIcon({ icon }: { icon: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon === "protect" && (
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      )}
      {icon === "grow" && (
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      )}
      {icon === "manage" && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </>
      )}
      {icon === "transfer" && (
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      )}
    </svg>
  );
}

export default function AboutPhilosophy() {
  return (
    <AnimatedSection className="bg-cream py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Our Philosophy
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Four Pillars, One Purpose
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Every decision we make is guided by four timeless principles
            designed to protect, grow, manage and transfer your family&apos;s
            wealth across generations.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cream text-navy shadow-[0_0_0_1px_rgba(168,121,31,0.08)] transition-all duration-500 group-hover:bg-gold/10 group-hover:text-gold group-hover:shadow-[0_0_0_1px_rgba(168,121,31,0.2)]">
                <PillarIcon icon={pillar.icon} />
              </div>
              <h3 className="mt-8 font-serif text-2xl text-navy sm:text-3xl">
                {pillar.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-stone/80 sm:text-lg">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
