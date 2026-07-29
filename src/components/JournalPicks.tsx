"use client";

import AnimatedSection from "./AnimatedSection";
import { editorPicks } from "@/lib/journal-data";
import JournalArticleCard from "./JournalArticleCard";

export default function JournalPicks() {
  return (
    <AnimatedSection className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mb-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Curated
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
              Editor&apos;s Picks
            </h2>
          </div>
          <span className="hidden text-xs text-stone/50 sm:block">
            Selected by the Kutumb team
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {editorPicks.map((pick, i) => (
            <JournalArticleCard key={pick.id} article={pick} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
