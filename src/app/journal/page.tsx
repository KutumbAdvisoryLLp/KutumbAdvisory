import type { Metadata } from "next";
import JournalHero from "@/components/JournalHero";
import JournalArticles from "@/components/JournalArticles";
import JournalCTA from "@/components/JournalCTA";
import JournalNewsletter from "@/components/JournalNewsletter";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Family Wealth Journal",
  description:
    "Insights on family wealth, financial planning, and the philosophy behind Kutumb's Financial Kundali — from the Kutumb Advisory team.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Family Wealth Journal — Kutumb Advisory",
    description: "Insights on family wealth, financial planning, and the philosophy behind Financial Kundali.",
    url: "/journal",
    type: "website",
  },
};

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("article_date", { ascending: false });

  return (
    <>
      <JournalHero />
      <JournalArticles articles={articles ?? []} />
      <JournalCTA />
      <JournalNewsletter />
    </>
  );
}
