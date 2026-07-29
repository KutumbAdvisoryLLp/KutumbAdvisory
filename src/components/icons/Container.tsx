"use client";

import { motion } from "framer-motion";

interface IconContainerProps {
  children: React.ReactNode;
  variant?: "circle" | "square" | "double-border";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-13 h-13",
  lg: "w-16 h-16",
};

const containerShadow = "shadow-[inset_0_1px_2px_rgba(32,27,98,0.03),0_4px_12px_rgba(32,27,98,0.04)]";

export function Container({
  children,
  variant = "circle",
  size = "md",
  className = "",
}: IconContainerProps) {
  const dim = sizeMap[size];
  const base = `relative flex items-center justify-center shrink-0 transition-all duration-500 ${dim} ${className}`;

  const shared = {
    initial: { scale: 1, y: 0 },
    whileHover: { scale: 1.05, y: -2 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  if (variant === "double-border") {
    return (
      <motion.div
        className={`${base} rounded-full bg-ivory ${containerShadow} group`}
        {...shared}
      >
        <div className="absolute inset-0 rounded-full bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 48 48"
          fill="none"
        >
          <circle cx="24" cy="24" r="22.5" stroke="#A8791F" strokeWidth="0.5" strokeOpacity="0.2" />
          <circle cx="24" cy="24" r="20" stroke="#201B62" strokeWidth="0.3" strokeOpacity="0.05" />
          {[0, 90, 180, 270].map((angle) => (
            <circle
              key={angle}
              cx={24 + 21 * Math.cos((angle * Math.PI) / 180)}
              cy={24 + 21 * Math.sin((angle * Math.PI) / 180)}
              r="1.2"
              fill="#A8791F"
              fillOpacity="0.2"
            />
          ))}
        </svg>
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      </motion.div>
    );
  }

  if (variant === "square") {
    return (
      <motion.div
        className={`${base} rounded-2xl bg-ivory ${containerShadow} group`}
        {...shared}
      >
        <div className="absolute inset-0 rounded-2xl bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 48 48"
          fill="none"
        >
          <rect x="1.5" y="1.5" width="45" height="45" rx="10" stroke="#A8791F" strokeWidth="0.5" strokeOpacity="0.18" />
          <rect x="4" y="4" width="40" height="40" rx="7" stroke="#201B62" strokeWidth="0.3" strokeOpacity="0.04" />
          <circle cx="24" cy="24" r="2" fill="#A8791F" fillOpacity="0.1" />
        </svg>
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${base} rounded-full bg-ivory ${containerShadow} border border-gold/12 group`}
      {...shared}
    >
      <div className="absolute inset-0 rounded-full bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 48 48"
        fill="none"
      >
        <circle cx="24" cy="24" r="22" stroke="#A8791F" strokeWidth="0.4" strokeOpacity="0.2" />
        <circle cx="24" cy="24" r="19.5" stroke="#201B62" strokeWidth="0.2" strokeOpacity="0.04" />
      </svg>
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
