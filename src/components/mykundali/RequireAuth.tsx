"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMykundaliAuth } from "./AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, hydrated } = useMykundaliAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace("/mykundali/login");
    }
  }, [hydrated, isLoggedIn, router]);

  if (!hydrated || !isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
