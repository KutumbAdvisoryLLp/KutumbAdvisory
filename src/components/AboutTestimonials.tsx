"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { createClient } from "@/lib/supabase/client";

const defaultTestimonials = [
  {
    quote: "Kutumb helped us see the complete picture of our family's finances. For the first time, we understand how everything connects — our investments, our insurance, our estate plan. It's transformed how we plan for our children's future.",
    author: "Vikram & Neha R.",
    title: "Business Owners, Mumbai",
    initials: "V&N",
    variant: "navy",
  },
  {
    quote: "What sets Kutumb apart is the depth of thinking. They don't just look at your portfolio — they look at your life. The Financial Kundali revealed gaps we didn't even know existed.",
    author: "Sundar K.",
    title: "Tech Professional, Bangalore",
    initials: "SK",
    variant: "ivory",
  },
  {
    quote: "We were with three different advisors before Kutumb. Now we have one complete view, one trusted relationship, and one plan that spans our entire family's future.",
    author: "Meera & Arun S.",
    title: "Entrepreneurs, Delhi",
    initials: "M&A",
    variant: "ivory",
  },
];

function QuoteMark({ variant = "navy" }: { variant?: string }) {
  return (
    <svg
      className={`h-7 w-7 transition-colors duration-300 ${
        variant === "navy" ? "text-gold/30" : "text-[#B8862B]/20"
      }`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

export default function AboutTestimonials() {
  const supabase = useMemo(() => createClient(), []);
  const [list, setList] = useState(defaultTestimonials);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true });

      if (data && data.length > 0) {
        setList(
          data.map((d: any, i: number) => ({
            quote: d.quote,
            author: d.name,
            title: `${d.role}, ${d.location}`,
            initials: d.name.split(" ").map((n: string) => n[0]).join(""),
            variant: i === 0 ? "navy" : "ivory",
          }))
        );
      }
    })();
  }, [supabase]);
  return (
    <AnimatedSection className="bg-white py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            What Families Say
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
            Trusted by{" "}
            <span className="text-[#B8862B]">400+ Indian Families</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            The families we serve are our strongest endorsement. Here is what
            they have to say about the Kutumb experience.
          </p>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {list.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-2xl p-8 sm:p-10 flex flex-col transition-all duration-300 ${
                t.variant === "navy"
                  ? "bg-navy text-white shadow-lg shadow-navy/15 hover:shadow-xl hover:shadow-navy/25"
                  : "bg-ivory text-navy shadow-sm hover:shadow-xl hover:shadow-gold/5"
              } hover:-translate-y-1.5 hover:ring-1 hover:ring-[#B8862B]/20`}
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, si) => (
                  <svg
                    key={si}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill={t.variant === "navy" ? "#B8862B" : "#B8862B"}
                    className={t.variant === "navy" ? "" : ""}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <div className="mb-5 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
                <QuoteMark variant={t.variant} />
              </div>

              <blockquote
                className={`flex-1 font-serif text-base leading-relaxed sm:text-lg ${
                  t.variant === "navy" ? "text-white/90" : "text-stone/90"
                }`}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div
                className={`mt-8 pt-6 ${
                  t.variant === "navy" ? "border-t border-gold/15" : "border-t border-gold/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                      t.variant === "navy"
                        ? "bg-gold/10 ring-2 ring-gold/20 group-hover:ring-gold/30"
                        : "bg-navy ring-2 ring-navy/10 group-hover:ring-[#B8862B]/20"
                    }`}
                  >
                    <span
                      className={`font-serif text-sm font-semibold ${
                        t.variant === "navy" ? "text-gold" : "text-white"
                      }`}
                    >
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        t.variant === "navy" ? "text-white" : "text-navy"
                      }`}
                    >
                      {t.author}
                    </p>
                    <p
                      className={`text-xs ${
                        t.variant === "navy" ? "text-white/40" : "text-stone/50"
                      }`}
                    >
                      {t.title}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={t.variant === "navy" ? "#B8862B" : "#B8862B"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={t.variant === "navy" ? "opacity-50" : "opacity-40"}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span
                      className={`text-[10px] font-medium ${
                        t.variant === "navy" ? "text-white/30" : "text-stone/40"
                      }`}
                    >
                      Verified
                    </span>
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
