"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export interface MykundaliUser {
  fullName: string;
  email: string;
}

interface SignUpParams {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  hydrated: boolean;
  user: MykundaliUser | null;
  userId: string | null;
  signUp: (params: SignUpParams) => Promise<AuthResult>;
  login: (params: LoginParams) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCustomer(userId: string): Promise<MykundaliUser | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("customers")
    .select("full_name, email")
    .eq("id", userId)
    .maybeSingle();
  if (!data) return null;
  return { fullName: data.full_name, email: data.email };
}

export function MykundaliAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<MykundaliUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const customer = await fetchCustomer(session.user.id);
        if (active) {
          setUser(customer);
          setUserId(customer ? session.user.id : null);
        }
      }
      if (active) setHydrated(true);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (!session?.user) {
        setUser(null);
        setUserId(null);
        return;
      }
      const customer = await fetchCustomer(session.user.id);
      setUser(customer);
      setUserId(customer ? session.user.id : null);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(
    async ({ fullName, email, phone, password }: SignUpParams): Promise<AuthResult> => {
      const res = await fetch("/api/mykundali/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password }),
      });
      const body = await res.json();
      if (!res.ok) {
        return { ok: false, error: body.error ?? "Could not create account" };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.user) {
        return { ok: false, error: error?.message ?? "Account created — please sign in." };
      }

      setUser({ fullName: fullName.trim(), email: email.trim() });
      setUserId(data.user.id);
      return { ok: true };
    },
    [supabase]
  );

  const login = useCallback(
    async ({ email, password }: LoginParams): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return { ok: false, error: error?.message ?? "Incorrect email or password." };
      }

      const customer = await fetchCustomer(data.user.id);
      if (!customer) {
        await supabase.auth.signOut();
        return { ok: false, error: "This account is not registered as a customer." };
      }

      setUser(customer);
      setUserId(data.user.id);
      return { ok: true };
    },
    [supabase]
  );

  const logout = useCallback(() => {
    supabase.auth.signOut();
    setUser(null);
    setUserId(null);
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!user, hydrated, user, userId, signUp, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMykundaliAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useMykundaliAuth must be used within MykundaliAuthProvider");
  }
  return ctx;
}
