"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Financial Kundali", href: "#financial-kundali" },
  { label: "About", href: "/about" },
  { label: "Family Wealth Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "top-3 mx-3 lg:top-4 lg:mx-6"
          : "top-0"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between transition-all duration-500 rounded-[20px]",
          scrolled
            ? "bg-ivory/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(32,27,98,0.06),0_0_0_1px_rgba(168,121,31,0.12)] px-5 py-2 lg:px-7 lg:py-2.5"
            : "bg-transparent px-6 py-4 lg:px-8 lg:py-5"
        )}
      >
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <Image
            src="/logoV2.png"
            alt="Kutumb Advisory"
            width={62}
            height={62}
            className="h-[62px] w-auto object-contain transition-all duration-500 group-hover:scale-[1.03]"
          />
          <span className="hidden sm:inline font-serif text-2xl tracking-wide text-navy transition-all duration-300 group-hover:text-gold">
            Kutumb
          </span>
        </a>

        {/* -- Navigation Capsule -- */}
        <div className="hidden lg:flex items-center rounded-[16px] bg-white/70 backdrop-blur-sm shadow-[0_2px_12px_rgba(32,27,98,0.04),0_0_0_1px_rgba(168,121,31,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] px-4 py-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative px-4 py-3 text-[15px] font-medium text-stone/60 hover:text-navy transition-all duration-400 tracking-wide whitespace-nowrap"
            >
              <span className="relative z-10 transition-colors duration-300">
                {link.label}
              </span>
              <span className="absolute inset-0 left-2 right-2 rounded-[10px] bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <span className="absolute bottom-1.5 left-4 right-4 h-[1.5px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-gold/80 to-gold transition-transform duration-400 group-hover:scale-x-100" />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-px bg-navy/6 last:hidden" />
            </a>
          ))}
        </div>

        {/* -- CTA -- */}
        <div className="hidden lg:block">
          <a
            href="#my-kutumb"
            className="group relative inline-flex items-center gap-2.5 rounded-[14px] bg-white px-5 py-2.5 text-[15px] font-medium text-navy shadow-[0_2px_8px_rgba(32,27,98,0.04),0_0_0_1px_rgba(168,121,31,0.1)] transition-all duration-400 hover:bg-gold hover:text-white hover:shadow-[0_8px_24px_rgba(168,121,31,0.2),0_0_0_1px_rgba(168,121,31,0.2)] hover:-translate-y-0.5"
          >
            <span className="relative z-10">My Kutumb</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A8791F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 transition-all duration-400 group-hover:translate-x-1 group-hover:stroke-white"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* -- Hamburger -- */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden relative z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.1)]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col gap-1.5">
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[1.5px] w-5 bg-navy"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-[1.5px] w-5 bg-navy"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block h-[1.5px] w-5 bg-navy"
            />
          </div>
        </button>
      </div>

      {/* -- Mobile Overlay -- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-white/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl tracking-wide text-navy hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                  {i < navLinks.length - 1 && (
                    <span className="block mx-auto mt-4 h-px w-6 bg-gold/15" />
                  )}
                </motion.a>
              ))}
              <motion.a
                href="#my-kutumb"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center gap-3 rounded-[18px] bg-gold px-10 py-3.5 text-lg font-medium text-white shadow-xl shadow-gold/20 transition-all duration-300 hover:bg-gold-light"
              >
                My Kutumb
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
