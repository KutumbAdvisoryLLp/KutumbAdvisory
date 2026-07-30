"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMykundaliAuth } from "@/components/mykundali/AuthContext";

export default function MykundaliRootPage() {
  const router = useRouter();
  const { isLoggedIn, hydrated } = useMykundaliAuth();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(isLoggedIn ? "/mykundali/dashboard" : "/mykundali/login");
  }, [hydrated, isLoggedIn, router]);

  return null;
}
