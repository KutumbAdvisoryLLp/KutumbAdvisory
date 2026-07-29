"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import Button from "./Button";
import { Container } from "./icons/Container";
import {
  InvestmentIcon,
  ProtectionIcon,
  RetirementIcon,
  LegacyIcon,
  TaxIcon,
} from "./icons";

const toolkitCategories = [
  {
    title: "Investment Planning",
    desc: "Understand your portfolio across asset classes, risk profiles, and time horizons.",
    icon: "investment",
    badge: "Flagship Tool",
  },
  {
    title: "Protection Planning",
    desc: "Identify gaps in your family's insurance coverage and optimize premiums.",
    icon: "protection",
    badge: "Risk Management",
  },
  {
    title: "Retirement Planning",
    desc: "Project your retirement corpus and build a plan that preserves your lifestyle.",
    icon: "retirement",
    badge: "Future Planning",
  },
  {
    title: "Legacy Planning",
    desc: "Structure your estate to ensure your family's wealth passes seamlessly.",
    icon: "legacy",
    badge: "Estate",
  },
  {
    title: "Tax Planning",
    desc: "Optimize your tax strategy across income, investments, and estate transfers.",
    icon: "tax",
    badge: "Optimization",
  },
];

const toolIcons: Record<string, React.ReactNode> = {
  investment: <InvestmentIcon size={20} />,
  protection: <ProtectionIcon size={20} />,
  retirement: <RetirementIcon size={20} />,
  legacy: <LegacyIcon size={20} />,
  tax: <TaxIcon size={20} />,
};

export default function FinancialToolkit() {
  return (
    <AnimatedSection id="toolkit" variant="slide-up" className="bg-cream py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Tools
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
            Financial Toolkit
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Purpose-built tools designed to give you clarity on every dimension
            of your family&apos;s wealth.
          </p>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {toolkitCategories.map((item, i) => {
            const isFeatured = i === 0;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative rounded-2xl transition-all duration-500 hover:-translate-y-1.5 ${
                  isFeatured
                    ? "bg-navy p-9 shadow-[0_8px_32px_rgba(32,27,98,0.2)] hover:shadow-[0_16px_48px_rgba(32,27,98,0.25)] row-span-1 sm:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-center"
                    : "bg-white p-9 shadow-[0_4px_20px_rgba(32,27,98,0.04),0_0_0_1px_rgba(168,121,31,0.06)] hover:shadow-[0_12px_40px_rgba(32,27,98,0.08),0_0_0_1px_rgba(168,121,31,0.12)]"
                }`}
              >
                {isFeatured && (
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,rgba(168,121,31,0.06),transparent_70%)]" />
                )}
                <div
                  className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${
                    isFeatured ? "via-gold/40 to-transparent opacity-100" : "via-gold/20 to-transparent group-hover:opacity-100"
                  } transition-opacity duration-500`}
                />
                <div className={`absolute inset-y-0 left-0 w-0.5 rounded-full bg-gradient-to-b from-transparent via-gold/20 to-transparent ${
                  isFeatured ? "opacity-100 via-gold/30" : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-500`} />

                <div className="relative z-10">
                  <span className={`inline-block text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 text-[#B8862B]`}>
                    {item.badge}
                  </span>

                  <div className="flex items-center gap-4">
                    <Container size={isFeatured ? "md" : "sm"} variant="circle">
                      <span className={isFeatured ? "text-gold" : "text-navy/50 group-hover:text-gold transition-colors duration-300"}>
                        {toolIcons[item.icon]}
                      </span>
                    </Container>
                  </div>

                  <h3
                    className={`mt-5 font-serif transition-colors duration-300 ${
                      isFeatured ? "text-2xl sm:text-3xl text-white" : "text-xl sm:text-2xl text-navy"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-4 text-base leading-relaxed ${
                      isFeatured ? "text-white/60" : "text-stone/80"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/12 bg-white/50 p-10 text-center shadow-sm"
          >
            <p className="font-serif text-xl text-navy/50">More tools coming</p>
            <p className="mt-3 text-sm text-stone/50">
              We&apos;re building the most comprehensive family wealth toolkit.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <Button variant="secondary" size="lg" href="#">
            Explore Full Toolkit
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
