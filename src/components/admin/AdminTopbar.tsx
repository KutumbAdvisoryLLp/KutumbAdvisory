"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthContext";
import { MenuIcon, LogoutIcon } from "@/components/icons/admin";

export default function AdminTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { adminEmail, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy/8 bg-white/80 px-6 py-4 backdrop-blur-xl lg:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-ivory lg:hidden"
        >
          <MenuIcon size={18} className="text-navy" />
        </button>
        <p className="hidden font-serif text-xl text-navy sm:block">
          Kutumb Admin
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-stone/60 sm:inline">
          {adminEmail}
        </span>
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 rounded-xl border border-navy/10 px-4 py-2.5 text-sm font-medium text-navy transition-all duration-300 hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
        >
          <LogoutIcon size={15} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}
