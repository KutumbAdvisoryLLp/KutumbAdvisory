"use client";

import AnimatedSection from "./AnimatedSection";
import { latestInsights } from "@/lib/journal-data";
import JournalArticleCard from "./JournalArticleCard";

export default function JournalInsights() {
  const [first, second, third, ...rest] = latestInsights;

  return (
    <AnimatedSection className="bg-cream py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mb-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Journal
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
              Latest Insights
            </h2>
          </div>
          <div className="hidden items-center gap-3 text-xs text-stone/50 sm:flex">
            <span className="h-8 w-px bg-gold/20" />
            <span>{latestInsights.length} articles</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {first && <JournalArticleCard article={first} variant="featured" index={0} />}
          </div>
          <div className="flex flex-col gap-6">
            {second && <JournalArticleCard article={second} index={1} />}
            {third && <JournalArticleCard article={third} index={2} />}
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, i) => (
              <JournalArticleCard
                key={article.id}
                article={article}
                variant="compact"
                index={i + 3}
              />
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <button className="inline-flex items-center gap-2 rounded-[18px] border border-gold/20 bg-cream px-7 py-3 text-sm font-medium text-navy transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-lg hover:shadow-gold/10">
            Load More Articles
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}
