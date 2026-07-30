"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "./Navbar";
import Footer from "./Footer";

function usePageViewTracking(pathname: string | null) {
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const supabase = createClient();
    supabase
      .from("page_views")
      .insert({ path: pathname, referrer: document.referrer || null })
      .then();
  }, [pathname]);
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  usePageViewTracking(pathname);

  const isAdmin = pathname?.startsWith("/admin");
  const isMykundaliDashboard = pathname?.startsWith("/mykundali/dashboard");

  if (isAdmin || isMykundaliDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
