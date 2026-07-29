"use client";

import { motion } from "framer-motion";
import AboutHero from "@/components/AboutHero";
import AboutWhyExists from "@/components/AboutWhyExists";
import AboutPhilosophy from "@/components/AboutPhilosophy";
import AboutJourney from "@/components/AboutJourney";
import AboutFounder from "@/components/AboutFounder";
import AboutTeam from "@/components/AboutTeam";
import AboutTrust from "@/components/AboutTrust";
import AboutTestimonials from "@/components/AboutTestimonials";
import AboutFinalCTA from "@/components/AboutFinalCTA";

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Testimonial 1 — Editorial pull quote */}
      <div className="relative bg-ivory/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="mx-auto max-w-7xl px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl py-16 lg:py-20"
          >
            <div className="relative rounded-2xl bg-white p-8 shadow-sm sm:p-12">
              <span className="absolute -top-4 left-8 font-serif text-6xl leading-none text-gold/10 sm:text-8xl sm:left-10">
                &ldquo;
              </span>
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#B8862B">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <blockquote className="font-serif text-2xl leading-relaxed text-navy/85 sm:text-3xl sm:leading-snug">
                We had our finances with three different advisors and still
                couldn&apos;t see the full picture. Kutumb showed us everything
                in one place.
              </blockquote>
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-gold/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white ring-2 ring-gold/10">
                  VR
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Vikram Rathore</p>
                  <p className="text-xs text-stone/50">Business Owner, Delhi</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#B8862B" opacity="0.4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[10px] text-stone/40">Verified Client</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <AboutWhyExists />

      <div className="relative bg-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <AboutPhilosophy />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      </div>

      <AboutJourney />

      <AboutFounder />

      <AboutTeam />

      <AboutTrust />

      <AboutTestimonials />

      <AboutFinalCTA />
    </>
  );
}
