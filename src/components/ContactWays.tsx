"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const ways = [
  {
    id: "consultation",
    title: "Book a Consultation",
    desc: "Schedule a private conversation with a Kutumb advisor. We will take the time to understand your family's unique financial universe before designing a single recommendation.",
    meta: "Typically within 24 hours",
    icon: "calendar",
  },
  {
    id: "email",
    title: "Email Us",
    desc: "Prefer to write? Send us a detailed message and our team will respond with the care and depth your family deserves — no templates, no auto-replies.",
    meta: "We reply within 24–48 hours",
    icon: "email",
  },
  {
    id: "visit",
    title: "Visit Our Studio",
    desc: "Step into our space for a face-to-face conversation. Share a cup of tea and let us begin understanding your family's journey across generations.",
    meta: "Mon–Fri, 10 AM – 6 PM",
    icon: "visit",
  },
];

const iconPaths: Record<string, string> = {
  calendar:
    "M8 2v4M16 2v4M3 10h18M21 6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h18zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01",
  email:
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  visit:
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};

export default function ContactWays() {
  return (
    <AnimatedSection className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Connect
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Ways to Connect
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Every family is different. Choose the path that feels right for you.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {ways.map((way, i) => (
            <motion.div
              key={way.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col rounded-2xl bg-cream shadow-[0_0_0_1px_rgba(168,121,31,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(168,121,31,0.15),0_8px_32px_rgba(32,27,98,0.06)]"
            >
              {/* Gold accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

              <div className="flex flex-col p-8 sm:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-navy shadow-[0_0_0_1px_rgba(168,121,31,0.06)] transition-all duration-500 group-hover:bg-gold/10 group-hover:text-gold">
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
                    <path d={iconPaths[way.icon]} />
                  </svg>
                </div>

                <h3 className="mt-6 font-serif text-xl text-navy sm:text-2xl">
                  {way.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone/70">
                  {way.desc}
                </p>

                <div className="mt-8 flex items-center gap-2.5 border-t border-navy/5 pt-5 text-[11px] text-stone/50">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>{way.meta}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
