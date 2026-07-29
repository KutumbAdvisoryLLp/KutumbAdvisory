import JournalHero from "@/components/JournalHero";
import JournalFeatured from "@/components/JournalFeatured";
import JournalInsights from "@/components/JournalInsights";
import JournalTopics from "@/components/JournalTopics";
import JournalPicks from "@/components/JournalPicks";
import JournalGuides from "@/components/JournalGuides";
import JournalCTA from "@/components/JournalCTA";
import JournalNewsletter from "@/components/JournalNewsletter";

export default function JournalPage() {
  return (
    <>
      <JournalHero />
      <JournalFeatured />
      <JournalInsights />
      <JournalTopics />
      <JournalPicks />
      <JournalGuides />
      <JournalCTA />
      <JournalNewsletter />
    </>
  );
}
