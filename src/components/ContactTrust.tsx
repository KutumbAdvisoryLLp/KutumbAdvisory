"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const cards = [
  {
    title: "Personalised Wealth Planning",
    desc: "Every recommendation is designed around your family's unique goals, not a template. We take the time to understand what matters to you before we design a single solution.",
    icon: "personal",
    navy: false,
  },
  {
    title: "Long-Term Relationships",
    desc: "We do not manage portfolios. We build lasting partnerships across generations. Our families stay with us because we stay with them — through every chapter.",
    icon: "relationship",
    navy: true,
  },
  {
    title: "Holistic Financial Clarity",
    desc: "Insurance, investments, estate planning and legacy planning working together as one connected architecture. No silos. No gaps. Just complete clarity.",
    icon: "holistic",
    navy: false,
  },
];

const iconPaths: Record<string, string> = {
  personal:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  relationship:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  holistic:
    "M2 12h20M12 2v20M20 12a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8z",
};

export default function ContactTrust() {
  return (
    <AnimatedSection className="bg-cream py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Why Kutumb
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Why Families Choose Kutumb
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            We earn trust one family at a time. Here is what sets us apart.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative flex flex-col rounded-2xl p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg sm:p-10 ${
                card.navy
                  ? "bg-navy text-white hover:shadow-navy/20"
                  : "bg-white text-navy hover:shadow-[0_0_0_1px_rgba(168,121,31,0.15),0_8px_32px_rgba(32,27,98,0.06)]"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-500 ${
                  card.navy
                    ? "bg-white/10 text-gold group-hover:bg-white/15 group-hover:scale-105"
                    : "bg-cream text-navy shadow-[0_0_0_1px_rgba(168,121,31,0.06)] group-hover:bg-gold/10 group-hover:text-gold group-hover:scale-105"
                }`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={iconPaths[card.icon]} />
                </svg>
              </div>

              <h3
                className={`mt-6 font-serif text-xl sm:text-2xl ${
                  card.navy ? "text-white" : "text-navy"
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  card.navy ? "text-white/60" : "text-stone/70"
                }`}
              >
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
