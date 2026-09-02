"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function AboutWhyExists() {
  return (
    <AnimatedSection className="bg-white py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ivory shadow-lg"
          >
            <Image
              src="/images/4.png"
              alt="An abstract navy and gold architectural composition of arches and steps"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Why Kutumb Exists
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
              Most Families Manage Finances in Silos. We Built Something
              Different.
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-stone sm:text-xl">
              <p>
                After years of working with families across India, we noticed
                the same pattern: investments with one advisor, insurance with
                another, estate plans sitting in a drawer, tax strategies
                disconnected from everything else.
              </p>
              <p>
                Financial Kundali was created to solve one problem give every
                family a single, connected view of their entire financial
                universe. Not another dashboard. A complete architectural
                portrait.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 max-w-16 bg-gold/30" />
              <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                A new approach
              </span>
              <div className="h-px flex-1 max-w-16 bg-gold/30" />
            </div>

            <p className="mt-6 text-lg leading-relaxed text-stone/80 sm:text-xl">
              One family. One plan. One connected view. That is the Kutumb
              difference.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
