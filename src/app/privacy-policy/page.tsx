import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Kutumb Advisory",
  description:
    "How Kutumb Advisory collects, stores, and protects your family's information.",
};

const sections = [
  {
    heading: "Information We Collect",
    body: [
      "When you reach out through our consultation form, we collect the details you choose to share with us — your name, email address, phone number, city, occupation, financial goals, preferred meeting times, and any additional notes about your situation.",
      "If you subscribe to the Family Wealth Journal, we collect the email address you provide for that subscription.",
      "We do not collect sensitive financial account credentials, and we never ask for your passwords, PINs, or OTPs through our website.",
    ],
  },
  {
    heading: "How We Store Your Information",
    body: [
      "Your information is stored securely in a Supabase-managed Postgres database, protected by industry-standard access controls and encryption in transit.",
      "Access to this data is restricted to Kutumb Advisory team members who need it to prepare for and deliver your consultation or advisory services.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "We use the details you share to respond to your enquiry, schedule and prepare for consultations, and personalise the guidance we offer your family.",
      "If you subscribe to our journal, we use your email address solely to send you our published content and occasional updates about Kutumb Advisory.",
    ],
  },
  {
    heading: "How We Share Your Information",
    body: [
      "We do not sell your personal information, and we do not share it with third parties for their own marketing purposes.",
      "We may share limited information with trusted service providers — such as scheduling or communication tools — strictly to the extent necessary to deliver our services to you. These providers are not permitted to use your information for any other purpose.",
      "We may disclose information if required to do so by law or in good faith belief that such action is necessary to comply with a legal obligation.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You may request access to the personal information we hold about you, ask us to correct inaccuracies, or request that we delete your data at any time.",
      "To make any of these requests, please write to us at hello@kutumbadvisory.com and we will respond as promptly as we can.",
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "We may update this policy from time to time to reflect changes in our practices. We encourage you to review this page periodically.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.03] via-transparent to-gold/[0.04] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Legal
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
            Privacy Policy
          </h1>
          <p className="mt-6 text-base text-stone/60">
            Effective 30 July 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-lg leading-relaxed text-stone sm:text-xl">
            At Kutumb Advisory, we understand that your family&apos;s financial
            information is deeply personal. This policy explains what we
            collect, how we store it, and the rights you have over it.
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
              Questions about your data, or want to request access or
              deletion? Write to us at{" "}
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
