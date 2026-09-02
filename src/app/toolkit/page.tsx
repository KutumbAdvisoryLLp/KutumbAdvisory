import type { Metadata } from "next";
import { FinancialToolkitSection } from "@/components/toolkit/toolkit-section";

export const metadata: Metadata = {
  title: "Financial Toolkit",
  description:
    "Free calculators, checklists, and assessments to give you clarity on every dimension of your family's wealth. No login required.",
  alternates: { canonical: "/toolkit" },
  openGraph: {
    title: "Financial Toolkit — Kutumb Advisory",
    description: "Free calculators, checklists, and assessments to give you clarity on every dimension of your family's wealth.",
    url: "/toolkit",
  },
};

export default function ToolkitPage() {
  return (
    <div className="min-h-screen bg-white pt-28 lg:pt-32">
      <FinancialToolkitSection />
    </div>
  );
}
