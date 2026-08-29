"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Database } from "@/lib/supabase/types";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JournalArticles({ articles }: { articles: ArticleRow[] }) {
  if (articles.length === 0) {
    return (
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-8 text-center lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
              Knowledge Library
            </p>
            <h2 className="mt-6 font-serif text-4xl text-navy sm:text-5xl">
              Coming Soon
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone">
              We&apos;re preparing our first insights on building, protecting,
              and transferring legacy. Check back soon.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/journal/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col"
              >
                <div className="relative aspect-[16/9] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-ivory via-cream to-ivory shadow-[0_0_0_1px_rgba(168,121,31,0.12)]">
                  {article.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-[12%] rounded-sm border border-gold/[0.06]" />
                      <div className="absolute left-[38.2%] top-[12%] bottom-[12%] w-px bg-gold/[0.06]" />
                      <div className="absolute top-[61.8%] left-[12%] right-[12%] h-px bg-gold/[0.06]" />
                    </>
                  )}
                </div>

                <div className="flex flex-1 flex-col pt-4">
                  <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                    {article.category}
                  </span>
                  <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-serif text-lg leading-snug text-navy transition-colors duration-300 group-hover:text-gold">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-stone/70">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2.5 pt-2.5 text-[11px] text-stone/50">
                    <span>{formatDate(article.article_date)}</span>
                    {article.read_time && (
                      <>
                        <span className="h-2.5 w-px bg-navy/10" />
                        <span>{article.read_time}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gold transition-all duration-300 group-hover:gap-3">
                    <span>Read the full story</span>
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
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
