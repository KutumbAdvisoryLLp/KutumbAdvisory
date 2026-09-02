import Image from "next/image";
import Link from "next/link";

const KUTUMB_LOGO_URL =
  "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780312133/tree_qw9bji.png";

const navigateLinks = [
  { label: "Home", href: "/" },
  { label: "Financial Kundali", href: "/#financial-kundali" },
  { label: "About", href: "/about" },
  { label: "Family Wealth Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kutumb_advisory?utm_source=qr&igsh=MTluenE0dmgzamx4aw==",
  },
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/in/deepika-jha-1a07a63a8",
  },
  { label: "YouTube", href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="bg-ivory">
      <div className="mx-auto max-w-7xl px-8 py-20 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src={KUTUMB_LOGO_URL}
                alt="Kutumb Advisory"
                width={41}
                height={41}
                style={{ width: "auto", height: "auto" }}
                className="h-[41px] w-auto object-contain"
              />
              <span className="font-serif text-xl tracking-wide text-navy">
                Kutumb
              </span>
            </Link>
            <p className="text-sm text-stone/70 leading-relaxed max-w-xs">
              A premium Family Wealth Advisory platform. Bringing clarity to
              your family&apos;s financial universe.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-navy/50 mb-6">
              Navigate
            </h4>
            <ul className="space-y-4">
              {navigateLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone/70 hover:text-navy transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-navy/50 mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              <li className="text-sm text-stone/70">hello@kutumbadvisory.com</li>
              <li className="text-sm text-stone/70">+91 98316 10210</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-navy/50 mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone/70 hover:text-navy transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-navy/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone/50">
            &copy; {new Date().getFullYear()} Kutumb Advisory. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone/50 hover:text-navy transition-colors duration-300 tracking-wide"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
