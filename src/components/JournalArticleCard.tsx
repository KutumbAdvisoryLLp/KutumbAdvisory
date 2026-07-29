"use client";

import { type JournalArticle } from "@/lib/journal-data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JournalArticleCardProps {
  article: JournalArticle;
  variant?: "standard" | "featured" | "compact";
  index?: number;
}

const titleSize = {
  standard: "text-base sm:text-lg",
  featured: "text-xl sm:text-2xl lg:text-3xl",
  compact: "text-sm sm:text-base",
};

const titleMinH = {
  standard: "min-h-[2.75rem] sm:min-h-[3rem]",
  featured: "min-h-[2.75rem] sm:min-h-[3rem] lg:min-h-[3.75rem]",
  compact: "min-h-[2.4rem]",
};

const excerptClasses = {
  standard: "line-clamp-2 min-h-[2.75rem]",
  featured: "line-clamp-2 min-h-[2.75rem] sm:min-h-[2.75rem]",
  compact: "hidden",
};

const metaSize = {
  standard: "text-[11px]",
  featured: "text-[11px] sm:text-xs",
  compact: "text-[10px]",
};

function ImagePlaceholder({ variant }: { variant: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[16/9] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-ivory via-cream to-ivory shadow-[0_0_0_1px_rgba(168,121,31,0.12)]",
        variant === "featured" && "rounded-2xl"
      )}
    >
      <div className="absolute inset-[12%] rounded-sm border border-gold/[0.06]" />
      <div className="absolute left-[38.2%] top-[12%] bottom-[12%] w-px bg-gold/[0.06]" />
      <div className="absolute top-[61.8%] left-[12%] right-[12%] h-px bg-gold/[0.06]" />
    </div>
  );
}

export default function JournalArticleCard({
  article,
  variant = "standard",
  index = 0,
}: JournalArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex h-full cursor-pointer flex-col"
    >
      <ImagePlaceholder variant={variant} />

      <div className="flex flex-1 flex-col pt-4">
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          {article.category}
        </span>

        <h3
          className={cn(
            "mt-1 font-serif leading-snug text-navy transition-colors duration-300 group-hover:text-gold line-clamp-2",
            titleSize[variant],
            titleMinH[variant]
          )}
        >
          {article.title}
        </h3>

        <p
          className={cn(
            "mt-1 text-sm leading-relaxed text-stone/70",
            excerptClasses[variant]
          )}
        >
          {article.excerpt}
        </p>

        <div
          className={cn(
            "mt-auto flex items-center gap-2.5 pt-2.5 text-stone/50",
            metaSize[variant]
          )}
        >
          <span>{article.date}</span>
          <span className="h-2.5 w-px bg-navy/10" />
          <span>{article.readTime}</span>
        </div>
      </div>
    </motion.article>
  );
}
