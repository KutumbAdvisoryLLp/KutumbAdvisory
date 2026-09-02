import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { MykundaliAuthProvider } from "@/components/mykundali/AuthContext";
import { LoadingOverlayProvider } from "@/components/LoadingOverlayContext";
import { SITE_URL, SITE_NAME, SITE_LOGO_URL, CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS } from "@/lib/site";
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

const SITE_TITLE = "Kutumb Advisory — Family Wealth Platform";
const SITE_DESCRIPTION =
  "Kutumb is a premium Family Wealth Advisory platform. Discover your Financial Kundali — a 9-pillar assessment that brings every corner of your family's wealth into one connected view.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "family wealth",
    "financial kundali",
    "wealth advisory",
    "financial planning India",
    "family office India",
    "wealth management",
    "Kutumb",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [
      {
        url: SITE_LOGO_URL,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_LOGO_URL],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_LOGO_URL,
  description: SITE_DESCRIPTION,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  sameAs: SOCIAL_LINKS,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <LoadingOverlayProvider>
          <MykundaliAuthProvider>
            <SiteChrome>{children}</SiteChrome>
          </MykundaliAuthProvider>
        </LoadingOverlayProvider>
      </body>
    </html>
  );
}
