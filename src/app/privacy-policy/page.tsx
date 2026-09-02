import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kutumb Advisory collects, stores, and protects your family's information across our website and the My Kundali platform.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    heading: "Scope of This Policy",
    body: [
      "This policy covers the Kutumb Advisory marketing website and the My Kundali platform (account registration, the Financial Kundali assessment, and your dashboard) — together, the \"Service.\"",
    ],
  },
  {
    heading: "Information We Collect",
    body: [
      "Consultation form: when you reach out through our contact form, we collect the details you choose to share — your name, email, phone number, city, occupation, financial goals, preferred meeting times, and any notes about your situation.",
      "Newsletter: if you subscribe to the Family Wealth Journal, we collect the email address you provide.",
      "My Kundali account: creating an account collects your full name, email, phone number, and a password. Your password is hashed by our authentication provider — we never see or store it in plain text.",
      "Family financial information: to generate your Financial Kundali, you provide details about your family's income, expenses, assets, liabilities, existing investments and insurance, financial goals, and your answers to our 9-Graha assessment questions. This is the most sensitive information we hold, and we treat it accordingly — see \"How We Protect Your Information\" below.",
      "Payment information: when you unlock your Financial Kundali, payment is processed directly by Razorpay, our payment gateway partner. We never see or store your card, UPI, or net banking credentials — we only retain the transaction record (amount, status, and order/payment IDs) needed to confirm your purchase and provide support.",
      "Device and session information: to keep your account secure, we record a device label and approximate IP address when you sign in, and we limit each account to one active device at a time. Admin actions on your account (such as a password reset initiated by our support team) are logged with the same information for accountability.",
      "We do not collect sensitive financial account credentials such as net banking passwords, card PINs, or OTPs from other institutions, and we will never ask you for them.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "To create and secure your account, verify your identity via one-time codes, and enforce our single-device login policy.",
      "To generate your Financial Kundali assessment and results, and to let you view, retake, or download them from your dashboard.",
      "To process your payment, confirm your purchase by email, and provide billing support.",
      "To respond to consultation enquiries and, if you've subscribed, to send you Family Wealth Journal content and occasional updates — you can unsubscribe at any time via the link in any such email.",
      "To detect and prevent fraud, abuse, and unauthorized access (for example, rate-limiting repeated signup or login attempts).",
    ],
  },
  {
    heading: "How We Protect Your Information",
    body: [
      "Your information is stored in a Supabase-managed Postgres database. Row-level security policies ensure your account data — including your family financial profile and assessment results — is only ever readable by you and by authorized Kutumb Advisory team members, never by other customers.",
      "All data is encrypted in transit (HTTPS/TLS). Passwords and one-time verification codes are stored as one-way hashes, not in plain text.",
      "Access to customer data by our team is restricted to what's needed to provide support, and sensitive administrative actions (password resets, manual account changes) are logged for accountability.",
      "No method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security — but we design the Service to minimise what could go wrong and how much would be exposed if it did.",
    ],
  },
  {
    heading: "Third-Party Service Providers",
    body: [
      "We rely on a small number of specialist providers to run the Service, each of which only receives the information necessary to perform its function:",
      "Supabase — database hosting and account authentication.",
      "Razorpay — payment processing for the Financial Kundali unlock. Razorpay's own privacy policy governs how it handles your payment details.",
      "Resend — delivery of transactional emails (verification codes, welcome and payment confirmation emails) and, if you've subscribed, the Family Wealth Journal newsletter.",
      "Vercel — website and application hosting.",
      "We do not sell your personal information, and we do not share it with any third party for their own marketing purposes.",
      "We may disclose information if required to do so by law, or in a good-faith belief that doing so is necessary to comply with a legal obligation or protect the rights, property, or safety of Kutumb Advisory or our users.",
    ],
  },
  {
    heading: "Data Retention",
    body: [
      "We retain your account and assessment data for as long as your My Kundali account remains active, so you can return to your dashboard at any time.",
      "If you request account deletion, we permanently remove your profile, assessment answers and results, and associated records from active use. Payment records may be retained for a longer period where required for accounting, tax, or legal purposes.",
      "Security-related logs (such as rate-limiting records) are automatically purged on a rolling basis and are not retained long-term.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You may request access to the personal information we hold about you, ask us to correct inaccuracies, or request that we permanently delete your account and associated data at any time.",
      "You can unsubscribe from newsletter emails at any time using the link included in every email we send.",
      "To make any of these requests, write to us at hello@kutumbadvisory.com and we will respond as promptly as we can.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "We use essential cookies to keep you signed in to your My Kundali account. These are required for the Service to function and cannot be disabled without preventing login.",
      "We do not use third-party advertising or cross-site tracking cookies.",
    ],
  },
  {
    heading: "Children's Privacy",
    body: [
      "The Service is intended for adults managing their family's finances and is not directed at children under 18. We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "Grievance Redressal",
    body: [
      "In accordance with applicable Indian data protection and IT rules, if you have a grievance regarding the handling of your personal information, please write to our Grievance Officer at hello@kutumbadvisory.com. We aim to acknowledge grievances within 24 hours and resolve them within 15 days.",
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "We may update this policy from time to time to reflect changes in our practices or the Service. Material changes will be reflected by updating the effective date below. We encourage you to review this page periodically.",
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
            Effective 2 September 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-8 lg:px-10">
          <p className="text-lg leading-relaxed text-stone sm:text-xl">
            At Kutumb Advisory, we understand that your family&apos;s financial
            information is deeply personal. This policy explains what we
            collect across our website and the My Kundali platform, how we
            store it, and the rights you have over it.
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
