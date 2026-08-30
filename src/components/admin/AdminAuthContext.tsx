"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDeviceId, getDeviceLabel } from "@/lib/deviceInfo";

export interface DeviceConflict {
  deviceLabel: string;
}

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminEmail: string | null;
  deviceConflict: DeviceConflict | null;
  login: (email: string, password: string) => Promise<boolean>;
  resolveDeviceConflict: () => Promise<void>;
  cancelDeviceConflict: () => Promise<void>;
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
  const [deviceConflict, setDeviceConflict] = useState<DeviceConflict | null>(null);
  const pendingLoginRef = useRef(false);
  const pendingUserRef = useRef<{ id: string; email: string | null } | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && (await isAdminUser(session.user.id))) {
        if (!active) return;
        currentUserIdRef.current = session.user.id;
        setIsAuthenticated(true);
        setAdminEmail(session.user.email ?? null);
      }
      if (active) setIsLoading(false);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      // While a login() call is resolving a possible device conflict, it
      // owns the authenticated-state transition — this listener would
      // otherwise race it and log the user in before the conflict modal
      // has a chance to be shown/resolved.
      if (pendingLoginRef.current) return;

      if (!session?.user) {
        currentUserIdRef.current = null;
        setIsAuthenticated(false);
        setAdminEmail(null);
        return;
      }
      const ok = await isAdminUser(session.user.id);
      currentUserIdRef.current = ok ? session.user.id : null;
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
      pendingLoginRef.current = true;
      try {
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

        const deviceId = getDeviceId();
        const { data: others } = await supabase
          .from("device_sessions")
          .select("device_label")
          .eq("user_id", data.user.id)
          .neq("device_id", deviceId);

        if (others && others.length > 0) {
          pendingUserRef.current = { id: data.user.id, email: data.user.email ?? null };
          setDeviceConflict({ deviceLabel: others[0].device_label || "another device" });
          return true;
        }

        await supabase.from("device_sessions").upsert(
          {
            user_id: data.user.id,
            user_type: "admin",
            device_id: deviceId,
            device_label: getDeviceLabel(),
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: "user_id,device_id" }
        );

        currentUserIdRef.current = data.user.id;
        setIsAuthenticated(true);
        setAdminEmail(data.user.email ?? null);
        return true;
      } finally {
        pendingLoginRef.current = false;
      }
    },
    [supabase]
  );

  const resolveDeviceConflict = useCallback(async () => {
    const pending = pendingUserRef.current;
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
        user_type: "admin",
        device_id: deviceId,
        device_label: getDeviceLabel(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "user_id,device_id" }
    );

    currentUserIdRef.current = pending.id;
    setIsAuthenticated(true);
    setAdminEmail(pending.email);
    setDeviceConflict(null);
    pendingUserRef.current = null;
  }, [supabase]);

  const cancelDeviceConflict = useCallback(async () => {
    await supabase.auth.signOut();
    setDeviceConflict(null);
    pendingUserRef.current = null;
  }, [supabase]);

  const logout = useCallback(() => {
    const uid = currentUserIdRef.current;
    if (uid) {
      supabase.from("device_sessions").delete().eq("user_id", uid).eq("device_id", getDeviceId()).then();
    }
    supabase.auth.signOut();
    currentUserIdRef.current = null;
    setIsAuthenticated(false);
    setAdminEmail(null);
  }, [supabase]);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        adminEmail,
        deviceConflict,
        login,
        resolveDeviceConflict,
        cancelDeviceConflict,
        logout,
      }}
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
