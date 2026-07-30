import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

  const paragraphs = article.content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <article className="bg-white py-28 sm:py-36">
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
