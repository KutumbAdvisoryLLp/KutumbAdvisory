import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { MykundaliAuthProvider } from "@/components/mykundali/AuthContext";
import { LoadingOverlayProvider } from "@/components/LoadingOverlayContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kutumb Advisory — Family Wealth Platform",
  description:
    "Kutumb is a premium Family Wealth Advisory platform. Discover your Financial Kundali and bring clarity to your family's financial universe.",
  keywords: [
    "family wealth",
    "financial kundali",
    "wealth advisory",
    "financial planning",
    "Kutumb",
  ],
  openGraph: {
    title: "Kutumb Advisory — Family Wealth Platform",
    description:
      "Discover your Financial Kundali and bring clarity to your family's financial universe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh flex flex-col bg-white">
        <LoadingOverlayProvider>
          <MykundaliAuthProvider>
            <SiteChrome>{children}</SiteChrome>
          </MykundaliAuthProvider>
        </LoadingOverlayProvider>
      </body>
    </html>
  );
}
