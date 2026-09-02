import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Kutumb Advisory's refund and cancellation policy for the Financial Kundali unlock.",
  alternates: { canonical: "/refund-policy" },
};

const sections = [
  {
    heading: "Digital Product, Instant Access",
    body: [
      "The Financial Kundali unlock is a one-time payment for instant digital access to a report generated from the information you provide during the assessment. As soon as your payment is confirmed, your full report — including your 9-Graha breakdown, recommendations, and action plan — is unlocked in your dashboard.",
    ],
  },
  {
    heading: "All Sales Are Final",
    body: [
      "Because access is granted instantly and the report is generated specifically from your own inputs, we do not offer refunds or cancellations once a Financial Kundali payment has been completed and access granted.",
      "This applies regardless of whether you have viewed, downloaded, or acted on your report, and applies equally if you subsequently choose to retake the assessment — a retake resets your results but does not entitle you to a refund of, or a free re-unlock against, your original payment.",
    ],
  },
  {
    heading: "Exceptions",
    body: [
      "We recognise that technical errors happen. If you were charged more than once for the same unlock, charged but never granted access due to a technical failure on our end, or believe you were billed in error, contact us within 7 days of the transaction with your payment reference. We will review genuine cases like these at our sole discretion and, where warranted, issue a correction or refund through Razorpay to your original payment method.",
      "Reviewing your case does not obligate us to issue a refund outside of the circumstances described above.",
    ],
  },
  {
    heading: "Cancelling an In-Progress Payment",
    body: [
      "You can cancel or close the Razorpay checkout window at any point before completing payment with no charge and no consequence — simply return to the unlock page to try again whenever you're ready.",
    ],
  },
  {
    heading: "How to Reach Us for Billing Issues",
    body: [
      "Write to us at hello@kutumbadvisory.com with your registered email address and, if available, your payment/order ID. We aim to respond to billing enquiries within 2 business days.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.03] via-transparent to-gold/[0.04] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Legal
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.1]">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-6 text-base text-stone/60">
            Effective 2 September 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-lg leading-relaxed text-stone sm:text-xl">
            This policy explains how refunds and cancellations work for the
            Financial Kundali unlock on My Kundali. Please read it before
            completing your purchase.
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
              Billing question or payment issue? Write to us at{" "}
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
