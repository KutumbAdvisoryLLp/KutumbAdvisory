import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Kutumb Advisory website and the My Kundali platform.",
  alternates: { canonical: "/terms-of-service" },
};

const sections = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using the Kutumb Advisory website or the My Kundali platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.",
    ],
  },
  {
    heading: "Description of the Service",
    body: [
      "Kutumb Advisory operates a marketing website describing our Financial Kundali approach and Financial Toolkit, and My Kundali — a platform where you can create an account, complete a 9-Graha financial assessment about your family, and unlock a personalised Financial Kundali report for a one-time fee.",
    ],
  },
  {
    heading: "Eligibility and Account Registration",
    body: [
      "You must be at least 18 years old to create a My Kundali account. You agree to provide accurate, current information when registering and to keep your login credentials confidential.",
      "You are responsible for all activity that occurs under your account. For security, My Kundali accounts support one active signed-in device at a time; signing in on a new device may sign you out of a previous one.",
      "Please notify us immediately at hello@kutumbadvisory.com if you suspect unauthorized access to your account.",
    ],
  },
  {
    heading: "Payment and the Financial Kundali Unlock",
    body: [
      "Unlocking your full Financial Kundali report requires a one-time payment, processed securely through Razorpay, at the price displayed at checkout. Prices may change over time but will not affect an unlock you have already completed.",
      "All payments are final. Please see our Refund & Cancellation Policy for full details.",
      "Choosing to retake the assessment resets your current results and family profile inputs. Viewing a new Financial Kundali report after a retake requires unlocking it again — a retake is not a refund and does not entitle you to a second unlock at no cost.",
    ],
  },
  {
    heading: "Acceptable Use",
    body: [
      "You agree to use the Service only for lawful purposes, to provide accurate information in the consultation form, newsletter signup, and My Kundali account, and not to attempt to access another user's account or data.",
      "You agree not to reverse-engineer, scrape, or interfere with the operation of the Service, or to circumvent any security or rate-limiting measures we have in place.",
    ],
  },
  {
    heading: "No Guarantee of Outcomes",
    body: [
      "Nothing on this website or within My Kundali constitutes a guarantee of any particular financial outcome, return, or result. Financial planning depends on your individual circumstances, which are only properly assessed during a personal consultation.",
    ],
  },
  {
    heading: "Not Financial Advice",
    body: [
      "Your Financial Kundali score and recommendations are generated from the answers and figures you provide, using our own methodology. They are informational and educational in nature, not personalised financial, investment, tax, or legal advice. See our Disclaimer for more detail.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All content and functionality on this website and within My Kundali — including the Financial Kundali and 9-Graha framework, our assessment methodology, text, graphics, and design — is the property of Kutumb Advisory and may not be reproduced or distributed without our written permission.",
    ],
  },
  {
    heading: "Account Termination",
    body: [
      "You may request deletion of your My Kundali account at any time by writing to hello@kutumbadvisory.com.",
      "We may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or attempt to compromise the security of the Service.",
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
      "Kutumb Advisory shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or My Kundali, or reliance on the content or results either provides.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: [
      "We may revise these terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised terms.",
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
            Effective 2 September 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-lg leading-relaxed text-stone sm:text-xl">
            These terms govern your use of the Kutumb Advisory website and the
            My Kundali platform. Please read them carefully.
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
                {section.heading === "Payment and the Financial Kundali Unlock" && (
                  <p className="mt-4 text-base leading-relaxed text-stone/80 sm:text-lg">
                    Read the full{" "}
                    <Link href="/refund-policy" className="font-medium text-[#B8862B] hover:underline">
                      Refund &amp; Cancellation Policy
                    </Link>
                    .
                  </p>
                )}
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
