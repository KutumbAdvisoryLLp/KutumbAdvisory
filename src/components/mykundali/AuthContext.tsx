"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "kutumb_mykundali_auth";

export interface MockUser {
  fullName: string;
  email: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  hydrated: boolean;
  user: MockUser | null;
  login: (user: MockUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function MykundaliAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  const login = useCallback((nextUser: MockUser) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, hydrated, user, login, logout }}>
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
