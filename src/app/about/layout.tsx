import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kutumb Advisory exists to give families one connected view of their entire financial universe. Learn about our approach, our team, and why we built Financial Kundali.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Kutumb Advisory",
    description:
      "Kutumb Advisory exists to give families one connected view of their entire financial universe.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
