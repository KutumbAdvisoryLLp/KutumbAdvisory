"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  showArrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  onClick,
  type = "button",
  showArrow = true,
  loading = false,
  disabled = false,
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-3 font-medium transition-all duration-500 tracking-wide leading-none overflow-hidden";

  const variants = {
    primary:
      "rounded-[14px] bg-gradient-to-b from-gold-light to-gold text-white shadow-[0_4px_20px_rgba(168,121,31,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(168,121,31,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "rounded-[14px] bg-ivory text-navy border border-navy/12 hover:bg-navy hover:text-white hover:border-navy shadow-[0_2px_8px_rgba(32,27,98,0.03)] hover:shadow-[0_8px_24px_rgba(32,27,98,0.1)] hover:-translate-y-0.5 active:translate-y-0",
    ghost:
      "text-navy/60 hover:text-gold transition-colors rounded-[14px] hover:bg-ivory px-4 py-2",
    gold:
      "rounded-[14px] bg-gradient-to-b from-gold-light to-gold text-white shadow-[0_4px_20px_rgba(168,121,31,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(168,121,31,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-7 py-3.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const isDisabled = disabled || loading;

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    isDisabled && "opacity-50 pointer-events-none",
    className
  );

  const inner = (
    <>
      <span className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 flex items-center gap-3">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        <span>{children}</span>
        {showArrow && !loading && (
          <ArrowRight size={16} className="transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
        )}
      </span>
    </>
  );

  if (href) {
    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={isDisabled} className={classes}>
      {inner}
    </button>
  );
}
