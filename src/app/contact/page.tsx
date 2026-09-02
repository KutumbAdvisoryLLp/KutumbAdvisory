import type { Metadata } from "next";
import ContactHero from "@/components/ContactHero";
import ContactWays from "@/components/ContactWays";
import ContactForm from "@/components/ContactForm";
import ContactTrust from "@/components/ContactTrust";
import ContactFAQ from "@/components/ContactFAQ";
import ContactCTA from "@/components/ContactCTA";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kutumb Advisory. Book a consultation or reach our team to start building your family's Financial Kundali.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Kutumb Advisory",
    description: "Book a consultation or reach our team to start building your family's Financial Kundali.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("question, answer")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const faqJsonLd =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f: { question: string; answer: string }) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ContactHero />
      <ContactWays />
      <ContactForm />
      <ContactTrust />
      <ContactFAQ />
      <ContactCTA />
    </>
  );
}
