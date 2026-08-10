"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { createClient } from "@/lib/supabase/client";

const defaultFaqs = [
  {
    q: "What is Financial Kundali?",
    a: "Financial Kundali is Kutumb's proprietary framework for mapping your family's complete financial universe. Like a traditional kundali reveals the positions of celestial bodies at your birth, Financial Kundali reveals the nine dimensions of your family's wealth — investments, insurance, estate planning, retirement, tax, business, legacy, spending, and protection — in one connected view.",
  },
  {
    q: "How long does a consultation take?",
    a: "Your first consultation typically lasts 60–90 minutes. We take this time to understand your family's financial landscape, your goals, and your concerns.",
  },
  {
    q: "How much does Kutumb cost?",
    a: "Every family is different, and our approach reflects that. We discuss fees transparently during your first consultation. Our model is built on clarity from day one.",
  },
  {
    q: "Can I complete everything online?",
    a: "Yes. While we welcome in-person meetings at our studio, the entire Kutumb process can be completed remotely.",
  },
];

export default function ContactFAQ() {
  const supabase = useMemo(() => createClient(), []);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [faqList, setFaqList] = useState(defaultFaqs);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (data && data.length > 0) {
        setFaqList(
          data.map((d: any) => ({
            q: d.question,
            a: d.answer,
          }))
        );
      }
    })();
  }, [supabase]);

  return (
    <AnimatedSection className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Questions
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Frequently Asked Questions
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Everything you need to know before we speak.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqList.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.06)] transition-all duration-500 ${
                  isOpen
                    ? "shadow-[0_0_0_1px_rgba(168,121,31,0.15),0_4px_20px_rgba(32,27,98,0.06)]"
                    : "hover:shadow-[0_0_0_1px_rgba(168,121,31,0.1),0_2px_12px_rgba(32,27,98,0.04)]"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-all duration-300 sm:px-8"
                >
                  <span
                    className={`font-serif text-lg leading-snug transition-colors duration-300 sm:text-xl ${
                      isOpen ? "text-gold" : "text-navy"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-all duration-500 ${
                      isOpen
                        ? "rotate-45 text-gold"
                        : "text-stone/30"
                    }`}
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pt-0 text-sm leading-relaxed text-stone/70 sm:px-8 sm:text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
