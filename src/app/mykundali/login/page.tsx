"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import { useMykundaliAuth } from "@/components/mykundali/AuthContext";

type Mode = "signin" | "signup";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

function FloatingInput({
  label,
  name,
  type = "text",
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={type === "password" ? "current-password" : undefined}
        className={`peer h-16 w-full rounded-xl border bg-white px-6 pt-5 text-sm text-navy outline-none transition-all duration-300 focus:ring-0 ${
          error
            ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(252,165,165,0.15)]"
            : "border-navy/8 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute left-6 top-5 text-sm transition-all duration-300 pointer-events-none ${
          error ? "text-red-400" : "text-stone/40"
        } peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-gold ${
          value ? "top-2 text-[10px] text-gold" : ""
        }`}
      >
        {label}
      </label>
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

export default function MykundaliLoginPage() {
  const router = useRouter();
  const { login } = useMykundaliAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [skipToDashboard, setSkipToDashboard] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [errors]
  );

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (mode === "signup" && !form.fullName.trim()) {
      errs.fullName = "Please enter your full name";
    }
    if (!form.email.trim()) {
      errs.email = "Please enter your email";
    }
    if (mode === "signup" && !form.phone.trim()) {
      errs.phone = "Please enter your phone number";
    }
    if (!form.password.trim()) {
      errs.password = "Please enter a password";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    login({
      fullName: form.fullName || form.email.split("@")[0],
      email: form.email,
    });

    router.push(skipToDashboard ? "/mykundali/dashboard" : "/mykundali/assessment/landing");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-4">
            My Kutumb
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy leading-tight">
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="mt-3 text-sm text-stone/70">
            {mode === "signin"
              ? "Sign in to continue your Financial Kundali."
              : "Begin your family's Financial Kundali journey."}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center rounded-xl bg-white border border-navy/8 p-1 mb-8">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
              mode === "signin" ? "bg-navy text-white shadow-sm" : "text-stone/60 hover:text-navy"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
              mode === "signup" ? "bg-navy text-white shadow-sm" : "text-stone/60 hover:text-navy"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_4px_24px_rgba(32,27,98,0.06)] p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "signup" && (
                <motion.div
                  key="fullName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <FloatingInput
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    error={errors.fullName}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={handleChange}
            />

            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "signup" && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <FloatingInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    error={errors.phone}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              label="Password"
              name="password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="gold"
              size="lg"
              showArrow={false}
              loading={submitting}
              className="w-full"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>

            <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={skipToDashboard}
                onChange={(e) => setSkipToDashboard(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-xs text-stone/50">
                Skip to dashboard (testing only)
              </span>
            </label>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-stone/40">
          This is a demo sign-in — no real account is created.
        </p>
      </div>
    </div>
  );
}
