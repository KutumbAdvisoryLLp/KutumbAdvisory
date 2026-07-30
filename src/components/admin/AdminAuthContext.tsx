"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

async function isAdminUser(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  return !!data;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && (await isAdminUser(session.user.id))) {
        if (!active) return;
        setIsAuthenticated(true);
        setAdminEmail(session.user.email ?? null);
      }
      if (active) setIsLoading(false);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (!session?.user) {
        setIsAuthenticated(false);
        setAdminEmail(null);
        return;
      }
      const ok = await isAdminUser(session.user.id);
      setIsAuthenticated(ok);
      setAdminEmail(ok ? session.user.email ?? null : null);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) return false;

      const ok = await isAdminUser(data.user.id);
      if (!ok) {
        await supabase.auth.signOut();
        return false;
      }

      setIsAuthenticated(true);
      setAdminEmail(data.user.email ?? null);
      return true;
    },
    [supabase]
  );

  const logout = useCallback(() => {
    supabase.auth.signOut();
    setIsAuthenticated(false);
    setAdminEmail(null);
  }, [supabase]);

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated, isLoading, adminEmail, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
