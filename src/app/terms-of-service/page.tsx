import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Kutumb Advisory",
  description: "The terms that govern your use of the Kutumb Advisory website.",
};

const sections = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using the Kutumb Advisory website, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.",
    ],
  },
  {
    heading: "Use of This Website",
    body: [
      "This website is provided to help families understand our Financial Kundali approach, explore our toolkit, and connect with us for a consultation.",
      "You agree to use this site only for lawful purposes and to provide accurate information when submitting the consultation form or subscribing to our journal.",
    ],
  },
  {
    heading: "No Guarantee of Outcomes",
    body: [
      "Nothing on this website constitutes a guarantee of any particular financial outcome, return, or result. Financial planning depends on your individual circumstances, which are only properly assessed during a personal consultation.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All content on this website — including the Financial Kundali framework, text, graphics, and design — is the property of Kutumb Advisory and may not be reproduced or distributed without our written permission.",
    ],
  },
  {
    heading: "Third-Party Links",
    body: [
      "Our website may contain links to third-party sites. We are not responsible for the content or practices of any linked sites.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "Kutumb Advisory shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or reliance on its content.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: [
      "We may revise these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in India.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.03] via-transparent to-gold/[0.04] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Legal
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
            Terms of Service
          </h1>
          <p className="mt-6 text-base text-stone/60">
            Effective 30 July 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-lg leading-relaxed text-stone sm:text-xl">
            These terms govern your use of the Kutumb Advisory website. Please
            read them carefully.
          </p>

          <div className="mt-16 space-y-14">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-serif text-2xl text-navy sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-gold/40 to-transparent" />
                <div className="mt-5 space-y-4">
                  {section.body.map((para, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-stone/80 sm:text-lg"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border-l-4 border-[#B8862B] bg-cream/80 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-navy/80 sm:text-lg">
              Questions about these terms? Write to us at{" "}
              <a
                href="mailto:hello@kutumbadvisory.com"
                className="font-medium text-[#B8862B] hover:underline"
              >
                hello@kutumbadvisory.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
