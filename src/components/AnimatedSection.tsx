"use client";

import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  variant?: "fade" | "scale" | "slide-up" | "slide-down";
}

const variants = {
  "fade": {
    initial: { opacity: 0, y: 48 },
    whileInView: { opacity: 1, y: 0 },
  },
  "scale": {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 64 },
    whileInView: { opacity: 1, y: 0 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -24 },
    whileInView: { opacity: 1, y: 0 },
  },
};

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  id,
  variant = "fade",
}: AnimatedSectionProps) {
  const anim = variants[variant];
  return (
    <motion.section
      id={id}
      initial={anim.initial}
      whileInView={anim.whileInView}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
