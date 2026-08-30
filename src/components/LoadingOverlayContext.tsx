"use client";

import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const KUTUMB_LOGO_URL =
  "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780312133/tree_qw9bji.png";

// How long to keep the overlay up after the route actually changes, so the
// destination page gets a moment to mount and paint before it's revealed.
const SETTLE_DELAY_MS = 400;
// Safety net — never block the UI forever if a caller shows the overlay
// and, for whatever reason, navigation never happens.
const MAX_DURATION_MS = 10000;

interface LoadingOverlayContextValue {
  show: (message?: string) => void;
  hide: () => void;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(null);

export function LoadingOverlayProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Signing you in...");
  const pathname = usePathname();
  const shownAtPathnameRef = useRef<string | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
  };

  const show = useCallback((msg?: string) => {
    clearTimers();
    setMessage(msg ?? "Signing you in...");
    setVisible(true);
    shownAtPathnameRef.current = window.location.pathname;
    maxTimerRef.current = setTimeout(() => setVisible(false), MAX_DURATION_MS);
  }, []);

  const hide = useCallback(() => {
    clearTimers();
    shownAtPathnameRef.current = null;
    setVisible(false);
  }, []);

  useEffect(() => {
    if (visible && shownAtPathnameRef.current !== null && pathname !== shownAtPathnameRef.current) {
      // The route changed while the overlay was up — the destination page
      // has started mounting. Give it a beat to paint, then reveal it.
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => setVisible(false), SETTLE_DELAY_MS);
    }
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clearTimers, []);

  return (
    <LoadingOverlayContext.Provider value={{ show, hide }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-navy"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={KUTUMB_LOGO_URL}
                alt="Kutumb Advisory"
                width={72}
                height={72}
                priority
                style={{ width: "auto", height: "72px" }}
                className="object-contain"
              />
            </motion.div>
            <p className="text-sm font-medium tracking-wide text-white/70">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const ctx = useContext(LoadingOverlayContext);
  if (!ctx) throw new Error("useLoadingOverlay must be used within LoadingOverlayProvider");
  return ctx;
}
