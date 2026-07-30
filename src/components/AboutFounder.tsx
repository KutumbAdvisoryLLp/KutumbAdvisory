"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

const FOUNDER_IMAGE_URL =
  "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780300586/deepika-founder_u8eiuz.jpg";

export default function AboutFounder() {
  return (
    <>
      <AnimatedSection className="bg-white py-32 sm:py-40 lg:py-48">
        <div className="mx-auto max-w-7xl px-8 lg:px-10">
          <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ivory shadow-xl shadow-navy/5">
                  <Image
                    src={FOUNDER_IMAGE_URL}
                    alt="Deepika, Founder, Kutumb Advisory"
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/20" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy/5 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
                <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-navy/[0.02] blur-3xl" />
              </div>
            </motion.div>

            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                Meet the Founder
              </p>
              <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
                Twelve Years of
                <br />
                <span className="text-[#B8862B]">Architecting Trust</span>
              </h2>

              <div className="mt-10 space-y-6 text-lg leading-relaxed text-stone sm:text-xl">
                <p>
                  With over twelve years of experience in wealth management and
                  financial advisory, Deepika recognised that most families
                  approach their finances the same way they manage their
                  day-to-day — in disconnected fragments. A portfolio here.
                  An insurance policy there. An estate plan buried in a drawer.
                </p>
                <p>
                  Financial Kundali was born from a simple but powerful belief:
                  every family deserves to see their complete financial universe
                  in one clear, connected view. Not just for today, but for
                  generations to come.
                </p>
                <p>
                  Today, Kutumb Advisory serves over four hundred families
                  across India, managing over a hundred crore rupees in
                  coverage. Deepika has been recognised seven times as a
                  National Top Advisor and holds the prestigious COT and TOT
                  qualifications from the Million Dollar Round Table.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border-l-4 border-[#B8862B] bg-cream/80 p-6 sm:p-8">
                <svg className="mb-3 h-6 w-6 text-[#B8862B]/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-serif text-xl leading-relaxed text-navy/80 sm:text-2xl">
                  Every family&apos;s wealth has a story. Our job is to help you
                  understand it, protect it, and pass it on — with clarity,
                  confidence, and purpose.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px w-8 bg-[#B8862B]/30" />
                  <span className="text-sm font-medium text-[#B8862B]">Deepika&apos;s Philosophy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <section className="bg-cream py-28 sm:py-36 lg:py-44">
        <div className="mx-auto max-w-7xl px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Founder Achievements
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
              A Track Record of{" "}
              <span className="text-[#B8862B]">Excellence</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { value: "12+", label: "Years of Family Advisory" },
              { value: "400+", label: "Families Guided" },
              { value: "₹100Cr+", label: "Coverage Managed" },
              { value: "7×", label: "National Top Advisor" },
            ].map((s) => (
              <div key={s.label} className="group rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5">
                <p className="font-serif text-4xl font-semibold text-navy sm:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm font-medium text-[#B8862B]">{s.label}</p>
                <div className="mx-auto mt-4 h-px w-10 bg-[#B8862B]/20" />
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            {[
              { label: "COT Club Member", desc: "Court of the Table" },
              { label: "TOT Recognition", desc: "Top of the Table" },
              { label: "CEO Council", desc: "Axis Max Life" },
              { label: "Top Advisor", desc: "7 Consecutive Years" },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center gap-4 rounded-xl border border-gold/10 bg-white px-6 py-4 transition-all duration-300 hover:border-gold/20 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8862B]/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8862B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{r.label}</p>
                  <p className="text-xs text-stone/50">{r.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
