import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL, SITE_NAME } from "@/lib/site";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image, author, article_date, category")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/journal/${slug}`,
      type: "article",
      publishedTime: article.article_date,
      authors: [article.author],
      section: article.category,
      images: article.cover_image ? [{ url: article.cover_image }] : undefined,
    },
    twitter: {
      card: article.cover_image ? "summary_large_image" : "summary",
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!article) notFound();

  const paragraphs: string[] = (article.content as string).split(/\n\s*\n/).filter((p: string) => p.trim());

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image ? [article.cover_image] : undefined,
    datePublished: article.article_date,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/journal/${slug}`,
  };

  return (
    <article className="bg-white py-28 sm:py-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-8 lg:px-10">
        <Link
          href="/journal"
          className="text-sm font-medium text-gold transition-colors duration-300 hover:text-gold-light"
        >
          ← Back to Journal
        </Link>

        <p className="mt-8 text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          {article.category}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-6 flex items-center gap-2.5 text-sm text-stone/50">
          <span>{article.author}</span>
          <span className="h-2.5 w-px bg-navy/10" />
          <span>{formatDate(article.article_date)}</span>
          {article.read_time && (
            <>
              <span className="h-2.5 w-px bg-navy/10" />
              <span>{article.read_time}</span>
            </>
          )}
        </div>

        {article.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt={article.title}
            className="mt-10 w-full rounded-2xl object-cover shadow-[0_0_0_1px_rgba(168,121,31,0.12)]"
          />
        )}

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-stone">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
