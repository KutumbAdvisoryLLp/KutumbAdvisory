import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Kutumb Advisory",
  description:
    "Important information about the nature of the content on the Kutumb Advisory website.",
};

const sections = [
  {
    heading: "Informational Purposes Only",
    body: [
      "All content on this website — including descriptions of the Financial Kundali, the Financial Toolkit, articles in the Family Wealth Journal, and any figures or examples shown — is provided for general informational purposes only.",
      "Nothing on this site should be interpreted as personalised financial, investment, tax, legal, or estate planning advice for your specific circumstances.",
    ],
  },
  {
    heading: "Not a Substitute for Professional Advice",
    body: [
      "Every family's financial situation is unique. The general information on this website is not a substitute for advice from a qualified, licensed financial advisor who has reviewed your complete circumstances.",
      "We strongly encourage you to book a consultation with our team, or consult another appropriately licensed professional, before making any financial, investment, insurance, or estate planning decisions.",
    ],
  },
  {
    heading: "No Guarantee of Results",
    body: [
      "References to outcomes, coverage managed, or families served describe our track record and are not a promise or guarantee of future results. Investments and insurance products carry risk, and past performance is not indicative of future performance.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "Kutumb Advisory makes reasonable efforts to keep the information on this website accurate and up to date, but we make no warranties about its completeness or accuracy, and we are not liable for any decisions made solely on the basis of this website's content.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.03] via-transparent to-gold/[0.04] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Legal
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
            Disclaimer
          </h1>
          <p className="mt-6 text-base text-stone/60">
            Effective 30 July 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-lg leading-relaxed text-stone sm:text-xl">
            Please read this disclaimer carefully before using the Kutumb
            Advisory website or acting on any information found here.
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
              For guidance tailored to your family, book a consultation or
              write to us at{" "}
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
