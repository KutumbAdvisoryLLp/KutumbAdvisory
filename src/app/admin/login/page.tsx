"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";

export default function AdminLoginPage() {
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const ok = login(email, password);
    if (ok) {
      router.push("/admin");
    } else {
      setError("Incorrect email or password. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-6 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/[0.02] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy">
          <span className="font-serif text-2xl text-gold">K</span>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Kutumb Admin
          </p>
          <h1 className="mt-3 font-serif text-3xl text-navy">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-stone/60">
            Sign in to manage your site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              className="peer h-16 w-full rounded-xl border border-navy/8 bg-white px-6 pt-5 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
            />
            <label
              htmlFor="email"
              className={`absolute left-6 top-5 text-sm text-stone/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-gold ${
                email ? "top-2 text-[10px] text-gold" : ""
              }`}
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="peer h-16 w-full rounded-xl border border-navy/8 bg-white px-6 pt-5 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
            />
            <label
              htmlFor="password"
              className={`absolute left-6 top-5 text-sm text-stone/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-gold ${
                password ? "top-2 text-[10px] text-gold" : ""
              }`}
            >
              Password
            </label>
          </div>

          {error && (
            <p className="text-center text-[13px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-navy px-8 py-4 font-serif text-lg text-white transition-all duration-500 hover:bg-navy/90 hover:shadow-xl hover:shadow-navy/20 disabled:opacity-60"
          >
            <span>Sign In</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 transition-all duration-500 group-hover:bg-gold/30 group-hover:translate-x-0.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-stone/40">
          Internal use only. This panel is not yet connected to a real
          authentication backend.
        </p>
      </motion.div>
    </div>
  );
}
