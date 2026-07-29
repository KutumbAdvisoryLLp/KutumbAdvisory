import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ivory">
      <div className="mx-auto max-w-7xl px-8 py-20 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-5">
              <Image
                src="/logoV2.png"
                alt="Kutumb Advisory"
                width={41}
                height={41}
                className="h-[41px] w-auto object-contain"
              />
              <span className="font-serif text-xl tracking-wide text-navy">
                Kutumb
              </span>
            </a>
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
              {[
                "Home",
                "Financial Kundali",
                "About",
                "Family Wealth Journal",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-stone/70 hover:text-navy transition-colors duration-300"
                  >
                    {item}
                  </a>
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
              <li className="text-sm text-stone/70">+91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-navy/50 mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Disclaimer"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-stone/70 hover:text-navy transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-navy/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone/50">
            &copy; {new Date().getFullYear()} Kutumb Advisory. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "LinkedIn", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-stone/50 hover:text-navy transition-colors duration-300 tracking-wide"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
