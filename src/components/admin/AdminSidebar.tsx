"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  JournalAdminIcon,
  ContactAdminIcon,
  NewsletterIcon,
  AnalyticsIcon,
  SettingsIcon,
  CloseIcon,
} from "@/components/icons/admin";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Journal", href: "/admin/journal", icon: JournalAdminIcon },
  { label: "Contact", href: "/admin/contact", icon: ContactAdminIcon },
  { label: "Newsletter", href: "/admin/newsletter", icon: NewsletterIcon },
  { label: "Analytics", href: "/admin/analytics", icon: AnalyticsIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-7 py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy">
          <span className="font-serif text-lg text-gold">K</span>
        </div>
        <div>
          <p className="font-serif text-lg leading-none text-navy">Kutumb</p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-navy text-white shadow-md"
                  : "text-stone/60 hover:bg-white hover:text-navy"
              )}
            >
              <item.icon
                size={18}
                className={
                  active
                    ? "text-gold"
                    : "text-stone/40 transition-colors duration-300 group-hover:text-gold"
                }
              />
              <span>{item.label}</span>
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-7 py-6">
        <div className="mb-6 h-px bg-navy/8" />
        <p className="text-[11px] leading-relaxed text-stone/40">
          Kutumb Advisory Admin — UI preview build. Backend wiring coming
          soon.
        </p>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop — persistent */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-navy/8 lg:bg-ivory/60">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile — slide-in overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl lg:hidden"
            >
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute right-4 top-6 flex h-9 w-9 items-center justify-center rounded-lg bg-ivory"
              >
                <CloseIcon size={16} className="text-navy" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
