"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    quote:
      "For years, I thought our finances were in order. Financial Kundali showed me gaps I didn't know existed — and connected everything into a plan my entire family understands.",
    name: "Arun Mehta",
    title: "Business Owner",
    location: "Mumbai",
    type: "Financial Kundali Client",
    verified: true,
    date: "March 2026",
  },
  {
    quote:
      "What sets Kutumb apart is that they treat family wealth as a living system, not a collection of products. Our Financial Kundali changed how we think about money across generations.",
    name: "Priya Sundararajan",
    title: "Physician",
    location: "Chennai",
    type: "Financial Kundali Client",
    verified: true,
    date: "February 2026",
  },
];

export default function Trust() {
  return (
    <AnimatedSection className="bg-white py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Testimonials
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
            Trusted by families across India
          </h2>
        </div>

        <div className="relative mt-20 grid gap-8 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col rounded-2xl bg-ivory/60 p-10 shadow-sm border-l border-gold/15"
            >
              <div className="flex-1">
                <div className="flex items-start gap-5">
                  <span className="font-serif text-5xl leading-none text-gold/20 select-none shrink-0">
                    &ldquo;
                  </span>
                  <blockquote className="text-base leading-relaxed text-stone/80 sm:text-lg -mt-1">
                    {t.quote}
                  </blockquote>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gold/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-light text-xs font-semibold text-white shadow-sm">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-navy">{t.name}</p>
                      {t.verified && (
                        <span className="text-[10px] text-emerald-600/60 font-medium tracking-wide">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone/50">
                      {t.title}, {t.location}
                    </p>
                    <p className="text-[10px] text-stone/40 mt-0.5 tracking-wide">
                      {t.type} · {t.date}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
