import JournalHero from "@/components/JournalHero";
import JournalArticles from "@/components/JournalArticles";
import JournalCTA from "@/components/JournalCTA";
import JournalNewsletter from "@/components/JournalNewsletter";
import { createClient } from "@/lib/supabase/server";

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
