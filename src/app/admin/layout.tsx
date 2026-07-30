"use client";

import { usePathname } from "next/navigation";
import { AdminAuthProvider } from "@/components/admin/AdminAuthContext";
import { AdminDataProvider } from "@/components/admin/AdminDataContext";
import { ToastProvider } from "@/components/admin/ToastContext";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminDataProvider>
          {isLoginPage ? children : <AdminShell>{children}</AdminShell>}
        </AdminDataProvider>
      </ToastProvider>
    </AdminAuthProvider>
  );
}
