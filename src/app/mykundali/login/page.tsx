"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import { useMykundaliAuth } from "@/components/mykundali/AuthContext";
import { isAllowedEmailDomain, ALLOWED_EMAIL_PROVIDERS_LABEL } from "@/lib/allowedEmailDomains";
import { useLoadingOverlay } from "@/components/LoadingOverlayContext";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Mode = "signin" | "signup" | "signup-verify" | "forgot-request" | "forgot-verify";

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
  const {
    sendSignupOtp,
    verifySignupOtp,
    login,
    requestPasswordReset,
    verifyOtpAndResetPassword,
    deviceConflict,
    resolveDeviceConflict,
    cancelDeviceConflict,
  } = useMykundaliAuth();
  const { show: showLoadingOverlay } = useLoadingOverlay();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState<FormState>(initialForm);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

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
    if ((mode === "signin" || mode === "signup" || mode === "forgot-request") && !form.email.trim()) {
      errs.email = "Please enter your email";
    } else if (mode === "signup" && form.email.trim() && !isAllowedEmailDomain(form.email)) {
      errs.email = `Please use an email from one of these providers: ${ALLOWED_EMAIL_PROVIDERS_LABEL}.`;
    }
    if (mode === "signup" && !form.phone.trim()) {
      errs.phone = "Please enter your phone number";
    }
    if ((mode === "signin" || mode === "signup") && !form.password.trim()) {
      errs.password = "Please enter a password";
    }
    if (mode === "forgot-verify") {
      if (!otp.trim()) errs.otp = "Please enter the OTP verification code";
      if (!newPassword.trim()) errs.newPassword = "Please enter your new password";
    }
    if (mode === "signup-verify" && !otp.trim()) {
      errs.otp = "Please enter the verification code";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleForgotRequest = async () => {
    if (!form.email.trim()) {
      setErrors({ email: "Please enter your registered email" });
      return;
    }
    setSubmitting(true);
    setFormError("");
    setInfoMessage("");
    const res = await requestPasswordReset(form.email);
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error ?? "Failed to send reset code. Please try again.");
    } else {
      setInfoMessage(`Verification code sent to ${form.email}. Please check your inbox.`);
      setMode("forgot-verify");
    }
  };

  const handleForgotVerify = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setFormError("");
    setInfoMessage("");
    const res = await verifyOtpAndResetPassword(form.email, otp, newPassword);
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error ?? "Failed to reset password. Please check your OTP.");
    } else {
      setInfoMessage("Password reset successfully! Please sign in with your new password.");
      setMode("signin");
      setOtp("");
      setNewPassword("");
    }
  };

  const handleSignupVerify = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setFormError("");
    const result = await verifySignupOtp(form.email, otp);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error ?? "Invalid or expired verification code.");
      return;
    }
    showLoadingOverlay("Setting up your account...");
    router.push("/mykundali/assessment/landing");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setInfoMessage("");

    if (mode === "forgot-request") {
      return handleForgotRequest();
    }
    if (mode === "forgot-verify") {
      return handleForgotVerify();
    }
    if (mode === "signup-verify") {
      return handleSignupVerify();
    }

    if (!validate()) return;

    setSubmitting(true);

    if (mode === "signup") {
      const result = await sendSignupOtp({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSubmitting(false);
      if (!result.ok) {
        setFormError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setOtp("");
      setInfoMessage(`Verification code sent to ${form.email}. Please check your inbox.`);
      setMode("signup-verify");
      return;
    }

    const result = await login({ email: form.email, password: form.password });

    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    if ("deviceConflict" in result && result.deviceConflict) {
      // The conflict modal below takes over — it navigates once resolved.
      return;
    }

    showLoadingOverlay("Opening your dashboard...");
    router.push("/mykundali/dashboard");
  };

  const isForgot = mode === "forgot-request" || mode === "forgot-verify";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-4">
            My Kutumb
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy leading-tight">
            {mode === "signin"
              ? "Welcome Back"
              : mode === "signup"
              ? "Create Your Account"
              : mode === "signup-verify"
              ? "Verify Your Email"
              : mode === "forgot-request"
              ? "Reset Password"
              : "Verify OTP Code"}
          </h1>
          <p className="mt-3 text-sm text-stone/70">
            {mode === "signin"
              ? "Sign in to continue your Financial Kundali."
              : mode === "signup"
              ? "Begin your family's Financial Kundali journey."
              : mode === "signup-verify"
              ? `Enter the verification code sent to ${form.email}.`
              : mode === "forgot-request"
              ? "Enter your email to receive a password reset OTP code."
              : `Enter the OTP code sent to ${form.email} and choose a new password.`}
          </p>
        </div>

        {/* Mode Toggle (hide during forgot flow and signup verification) */}
        {!isForgot && mode !== "signup-verify" && (
          <div className="flex items-center rounded-xl bg-white border border-navy/8 p-1 mb-8">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setFormError("");
                setInfoMessage("");
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                mode === "signin" ? "bg-navy text-white shadow-sm" : "text-stone/60 hover:text-navy"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setFormError("");
                setInfoMessage("");
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                mode === "signup" ? "bg-navy text-white shadow-sm" : "text-stone/60 hover:text-navy"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_4px_24px_rgba(32,27,98,0.06)] p-8">
          {infoMessage && (
            <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-xs font-medium text-emerald-800">
              {infoMessage}
            </div>
          )}

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

            {mode !== "forgot-verify" && mode !== "signup-verify" && (
              <FloatingInput
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
            )}

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

            {(mode === "signin" || mode === "signup") && (
              <div>
                <FloatingInput
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  error={errors.password}
                  onChange={handleChange}
                />
                {mode === "signin" && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot-request");
                        setFormError("");
                        setInfoMessage("");
                      }}
                      className="text-xs text-gold hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {mode === "forgot-verify" && (
              <>
                <FloatingInput
                  label="OTP Verification Code"
                  name="otp"
                  type="text"
                  value={otp}
                  error={errors.otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                  }}
                />
                <FloatingInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  error={errors.newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                  }}
                />
              </>
            )}

            {mode === "signup-verify" && (
              <FloatingInput
                label="Verification Code"
                name="otp"
                type="text"
                value={otp}
                error={errors.otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                }}
              />
            )}

            {formError && (
              <p className="text-center text-[13px] text-red-500">
                {typeof formError === "string" ? formError : (formError as any)?.message || "Something went wrong."}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              showArrow={false}
              loading={submitting}
              className="w-full"
            >
              {mode === "signin"
                ? "Sign In"
                : mode === "signup"
                ? "Send Verification Code"
                : mode === "signup-verify"
                ? "Verify & Create Account"
                : mode === "forgot-request"
                ? "Send Verification Code"
                : "Reset Password"}
            </Button>

            {isForgot && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setFormError("");
                    setInfoMessage("");
                  }}
                  className="text-xs text-stone/60 hover:text-navy font-medium transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {mode === "signup-verify" && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setOtp("");
                    setFormError("");
                    setInfoMessage("");
                  }}
                  className="text-xs text-stone/60 hover:text-navy font-medium transition-colors"
                >
                  ← Back to edit details
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={!!deviceConflict}
        title="Already signed in elsewhere"
        description={`Your account is currently active on ${
          deviceConflict?.deviceLabel ?? "another device"
        }. Only one device can be signed in at a time.`}
        confirmLabel="Log out from other devices"
        cancelLabel="Cancel"
        danger={false}
        onConfirm={async () => {
          await resolveDeviceConflict();
          showLoadingOverlay("Opening your dashboard...");
          router.push("/mykundali/dashboard");
        }}
        onCancel={cancelDeviceConflict}
      />
    </div>
  );
}
