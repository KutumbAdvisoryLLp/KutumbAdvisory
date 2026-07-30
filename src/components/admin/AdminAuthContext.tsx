"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const SESSION_KEY = "kutumb_admin_session";

// Mock credential — frontend-only gate, no real auth yet.
// Replace with real backend-verified auth before going live.
const ADMIN_EMAIL = "hello@kutumbadvisory.com";
const ADMIN_PASSWORD = "admin@123";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    // sessionStorage is only available client-side; reading it post-mount
    // (rather than in a lazy useState initializer) avoids a server/client
    // hydration mismatch on the first render.
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
      setAdminEmail(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(SESSION_KEY, email.trim());
      setIsAuthenticated(true);
      setAdminEmail(email.trim());
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setAdminEmail(null);
  }, []);

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
