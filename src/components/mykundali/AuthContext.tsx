"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDeviceId, getDeviceLabel } from "@/lib/deviceInfo";

export interface MykundaliUser {
  fullName: string;
  email: string;
}

export interface DeviceConflict {
  deviceLabel: string;
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
  deviceConflict?: boolean;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  hydrated: boolean;
  user: MykundaliUser | null;
  userId: string | null;
  hasPaid: boolean;
  deviceConflict: DeviceConflict | null;
  sendSignupOtp: (params: SignUpParams) => Promise<AuthResult>;
  verifySignupOtp: (email: string, otp: string) => Promise<AuthResult>;
  login: (params: LoginParams) => Promise<AuthResult>;
  resolveDeviceConflict: () => Promise<void>;
  cancelDeviceConflict: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  verifyOtpAndResetPassword: (email: string, otp: string, newPassword: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCustomer(userId: string): Promise<MykundaliUser | null> {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("customers")
      .select("full_name, email")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      return { fullName: data.full_name, email: data.email };
    }

    // Fallback: If user is authenticated in Supabase Auth but missing from public.customers
    // (e.g. from schema resets), auto-create the customer row so they aren't blocked.
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user && authData.user.id === userId) {
      const email = authData.user.email ?? "";
      const fullName =
        (authData.user.user_metadata?.full_name as string) ||
        (authData.user.user_metadata?.name as string) ||
        email.split("@")[0] ||
        "Customer";

      await supabase.from("customers").upsert({
        id: userId,
        full_name: fullName,
        email: email,
      });

      return { fullName, email };
    }

    return null;
  } catch (err) {
    console.error("[MykundaliAuth] fetchCustomer failed:", err);
    return null;
  }
}

export function MykundaliAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<MykundaliUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [deviceConflict, setDeviceConflict] = useState<DeviceConflict | null>(null);
  const pendingLoginRef = useRef(false);
  const pendingCustomerRef = useRef<{ id: string; customer: MykundaliUser } | null>(null);

  // Reacts to userId however it gets set (login, hydration, signup, device
  // conflict resolution) — single source of truth for "has this customer
  // unlocked their dashboard" instead of duplicating a payments fetch at
  // every place userId can change.
  useEffect(() => {
    let active = true;
    if (!userId) {
      setHasPaid(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("payments")
        .select("id")
        .eq("customer_id", userId)
        .eq("status", "paid")
        .maybeSingle();
      if (active) setHasPaid(!!data);
    })();
    return () => {
      active = false;
    };
  }, [userId, supabase]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
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
      } catch (err) {
        console.error("[MykundaliAuth] session hydration failed:", err);
      } finally {
        if (active) setHydrated(true);
      }
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      // While login() is resolving a possible device conflict, it owns the
      // authenticated-state transition — this listener would otherwise race
      // it and log the user in before the conflict modal can be shown.
      if (pendingLoginRef.current) return;

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

  const sendSignupOtp = useCallback(async ({ fullName, email, phone, password }: SignUpParams): Promise<AuthResult> => {
    const res = await fetch("/api/mykundali/auth/send-signup-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password }),
    });
    const body = await res.json();
    if (!res.ok) {
      return { ok: false, error: body.error ?? "Could not start signup" };
    }
    return { ok: true };
  }, []);

  const verifySignupOtp = useCallback(
    async (email: string, otp: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "signup",
      });
      if (error || !data.session || !data.user) {
        return { ok: false, error: error?.message ?? "Invalid or expired verification code." };
      }

      const res = await fetch("/api/mykundali/signup/finalize", { method: "POST" });
      const body = await res.json();
      if (!res.ok) {
        return { ok: false, error: body.error ?? "Could not finish creating your account." };
      }

      await supabase.from("device_sessions").upsert(
        {
          user_id: data.user.id,
          user_type: "mykundali",
          device_id: getDeviceId(),
          device_label: getDeviceLabel(),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,device_id" }
      );

      setUser({ fullName: body.fullName, email: body.email });
      setUserId(data.user.id);
      return { ok: true };
    },
    [supabase]
  );

  const login = useCallback(
    async ({ email, password }: LoginParams): Promise<AuthResult> => {
      pendingLoginRef.current = true;
      try {
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

        const deviceId = getDeviceId();
        const { data: others } = await supabase
          .from("device_sessions")
          .select("device_label")
          .eq("user_id", data.user.id)
          .neq("device_id", deviceId);

        if (others && others.length > 0) {
          pendingCustomerRef.current = { id: data.user.id, customer };
          setDeviceConflict({ deviceLabel: others[0].device_label || "another device" });
          return { ok: true, deviceConflict: true };
        }

        await supabase.from("device_sessions").upsert(
          {
            user_id: data.user.id,
            user_type: "mykundali",
            device_id: deviceId,
            device_label: getDeviceLabel(),
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: "user_id,device_id" }
        );

        setUser(customer);
        setUserId(data.user.id);
        return { ok: true };
      } finally {
        pendingLoginRef.current = false;
      }
    },
    [supabase]
  );

  const resolveDeviceConflict = useCallback(async () => {
    const pending = pendingCustomerRef.current;
    if (!pending) return;

    const deviceId = getDeviceId();
    await supabase.auth.signOut({ scope: "others" });
    await supabase
      .from("device_sessions")
      .delete()
      .eq("user_id", pending.id)
      .neq("device_id", deviceId);
    await supabase.from("device_sessions").upsert(
      {
        user_id: pending.id,
        user_type: "mykundali",
        device_id: deviceId,
        device_label: getDeviceLabel(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "user_id,device_id" }
    );

    setUser(pending.customer);
    setUserId(pending.id);
    setDeviceConflict(null);
    pendingCustomerRef.current = null;
  }, [supabase]);

  const cancelDeviceConflict = useCallback(async () => {
    await supabase.auth.signOut();
    setDeviceConflict(null);
    pendingCustomerRef.current = null;
  }, [supabase]);

  const requestPasswordReset = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        const res = await fetch("/api/mykundali/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const body = await res.json();
        if (!res.ok) {
          return { ok: false, error: body.error ?? "Failed to send reset OTP code." };
        }
        return { ok: true };
      } catch (err: any) {
        return { ok: false, error: err?.message ?? "Failed to send reset code." };
      }
    },
    []
  );

  const verifyOtpAndResetPassword = useCallback(
    async (email: string, otp: string, newPassword: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "recovery",
      });
      if (error || !data.session) {
        return { ok: false, error: error?.message ?? "Invalid or expired OTP code." };
      }
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        return { ok: false, error: updateError.message };
      }
      return { ok: true };
    },
    [supabase]
  );

  const logout = useCallback(() => {
    if (userId) {
      supabase.from("device_sessions").delete().eq("user_id", userId).eq("device_id", getDeviceId()).then();
    }
    supabase.auth.signOut();
    setUser(null);
    setUserId(null);
  }, [supabase, userId]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        hydrated,
        user,
        userId,
        hasPaid,
        deviceConflict,
        sendSignupOtp,
        verifySignupOtp,
        login,
        resolveDeviceConflict,
        cancelDeviceConflict,
        requestPasswordReset,
        verifyOtpAndResetPassword,
        logout,
      }}
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
