"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  ageGroup: string;
  contactAs: string;
  primaryGoal: string;
  preferredMeeting: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

const ageGroups = [
  "Under 30",
  "30–40",
  "41–50",
  "51–60",
  "60+",
];

const contactAsOptions = [
  "Individual",
  "Couple",
  "Family",
  "Business Owner",
];

const financialGoals = [
  "Financial Kundali",
  "Investment Planning",
  "Retirement",
  "Estate Planning",
  "Insurance",
  "Tax",
  "Legacy Planning",
  "Other",
];

const meetingOptions = ["Online", "Office"];

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  occupation: "",
  ageGroup: "",
  contactAs: "",
  primaryGoal: "",
  preferredMeeting: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
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
      {error && (
        <p className="mt-1.5 text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}

function FloatingSelect({
  label,
  name,
  value,
  options,
  error,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`peer h-16 w-full rounded-xl border bg-white px-6 pt-5 text-sm text-navy outline-none appearance-none transition-all duration-300 focus:ring-0 ${
          error
            ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(252,165,165,0.15)]"
            : "border-navy/8 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
        }`}
      >
        <option value="" disabled />
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className={`absolute left-6 top-2 text-[10px] transition-all duration-300 pointer-events-none ${
          error ? "text-red-400" : "text-gold"
        }`}
      >
        {label}
      </label>
      <svg
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-stone/30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
      {error && (
        <p className="mt-1.5 text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}

function OptionPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-medium transition-all duration-300 ${
        selected
          ? "bg-navy text-white border-navy shadow-md"
          : "bg-ivory text-navy/80 border-gold/15 hover:bg-gold/8 hover:border-gold/25"
      }`}
    >
      {/* Gold checkmark for selected */}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
          selected
            ? "border-gold bg-gold/20"
            : "border-navy/15 bg-transparent group-hover:border-gold/30"
        }`}
      >
        {selected && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div>
      {label && (
        <p className="mb-4 text-xs font-semibold tracking-[0.12em] uppercase text-stone/40">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <OptionPill
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onChange(opt)}
          />
        ))}
      </div>
    </div>
  );
}

function FloatingTextarea({
  label,
  name,
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="relative">
      <textarea
        name={name}
        id={name}
        rows={5}
        value={value}
        onChange={onChange}
        placeholder="Tell us anything you'd like us to know about your family's financial goals, concerns, or dreams."
        className={`peer w-full rounded-xl border bg-white px-6 pt-6 pb-4 text-sm text-navy outline-none resize-none transition-all duration-300 focus:ring-0 min-h-[160px] ${
          error
            ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(252,165,165,0.15)]"
            : "border-navy/8 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute left-6 top-5 text-sm transition-all duration-300 pointer-events-none ${
          error ? "text-red-400" : "text-stone/40"
        } peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-gold ${
          value ? "top-3 text-[10px] text-gold" : ""
        }`}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const steps = [
  {
    num: "01",
    title: "Your Details",
    subtitle: "How should we reach you?",
  },
  {
    num: "02",
    title: "Tell Us About Your Family",
    subtitle: "Who are you reaching out for?",
  },
  {
    num: "03",
    title: "What Brings You Here?",
    subtitle: "Select your primary area of interest.",
  },
  {
    num: "04",
    title: "Meeting Preference",
    subtitle: "How would you like to connect?",
  },
  {
    num: "05",
    title: "Anything Else?",
    subtitle: "Share what matters to your family.",
  },
];

export default function ContactForm() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
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
    if (!form.fullName.trim()) errs.fullName = "Please enter your full name";
    if (!form.email.trim()) errs.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.phone.trim()) errs.phone = "Please enter your phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      city: form.city || null,
      occupation: form.occupation || null,
      age_group: form.ageGroup || null,
      contact_as: form.contactAs || null,
      primary_goal: form.primaryGoal || null,
      preferred_meeting: form.preferredMeeting || null,
      preferred_date: form.preferredDate || null,
      preferred_time: form.preferredTime || null,
      notes: form.notes || null,
    });
    setSubmitting(false);

    if (error) {
      setSubmitError("Something went wrong submitting your request. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <AnimatedSection
      id="consultation-form"
      className="bg-ivory py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Begin Your Journey
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            Begin Your Family Wealth Conversation
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            Every Financial Kundali begins with understanding your family&apos;s
            unique story. Share a few details below and our advisory team will
            personally reach out.
          </p>
        </div>

        <div className="mx-auto mt-16 flex items-center gap-4 max-w-xl">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A8791F" strokeWidth="1.5" strokeLinecap="round" className="shrink-0 opacity-30">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-16 max-w-xl rounded-3xl bg-white p-12 text-center shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_4px_24px_rgba(32,27,98,0.06)]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy/5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#201B62"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            </div>
            <h3 className="mt-6 font-serif text-2xl text-navy">
              Thank You for Trusting Us
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-stone/70">
              We have received your consultation request. A Kutumb advisor will
              reach out to you within 24 hours to begin mapping your family&apos;s
              Financial Kundali.
            </p>
            <button
              onClick={() => {
                setForm(initialForm);
                setSubmitted(false);
              }}
              className="mt-8 text-sm font-medium text-gold transition-colors duration-300 hover:text-gold-light"
            >
              Submit another request
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-16"
            noValidate
          >
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column — Form Cards */}
              <div className="space-y-10 lg:col-span-7">
                {/* Step 01 — Your Details */}
                <motion.div
                  custom={0}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] p-5 sm:p-10"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-serif text-5xl sm:text-6xl text-gold/15 leading-none mt-1 tracking-tight">
                      01
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-navy sm:text-3xl">
                        {steps[0].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-stone/50">
                        {steps[0].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FloatingInput
                        label="Full Name"
                        name="fullName"
                        value={form.fullName}
                        error={errors.fullName}
                        onChange={handleChange}
                      />
                      <FloatingInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        error={errors.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FloatingInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        error={errors.phone}
                        onChange={handleChange}
                      />
                      <FloatingInput
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FloatingInput
                        label="Occupation"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                      />
                      <FloatingSelect
                        label="Age Group"
                        name="ageGroup"
                        value={form.ageGroup}
                        options={ageGroups}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Step 02 — Tell Us About Your Family */}
                <motion.div
                  custom={1}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] p-5 sm:p-10"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-serif text-5xl sm:text-6xl text-gold/15 leading-none mt-1 tracking-tight">
                      02
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-navy sm:text-3xl">
                        {steps[1].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-stone/50">
                        {steps[1].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <OptionGroup
                      label=""
                      value={form.contactAs}
                      options={contactAsOptions}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, contactAs: val }))
                      }
                    />
                  </div>
                </motion.div>

                {/* Step 03 — What Brings You Here */}
                <motion.div
                  custom={2}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] p-5 sm:p-10"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-serif text-5xl sm:text-6xl text-gold/15 leading-none mt-1 tracking-tight">
                      03
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-navy sm:text-3xl">
                        {steps[2].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-stone/50">
                        {steps[2].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <OptionGroup
                      label=""
                      value={form.primaryGoal}
                      options={financialGoals}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, primaryGoal: val }))
                      }
                    />
                  </div>
                </motion.div>

                {/* Step 04 — Meeting Preference */}
                <motion.div
                  custom={3}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] p-5 sm:p-10"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-serif text-5xl sm:text-6xl text-gold/15 leading-none mt-1 tracking-tight">
                      04
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-navy sm:text-3xl">
                        {steps[3].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-stone/50">
                        {steps[3].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-6">
                    <OptionGroup
                      label=""
                      value={form.preferredMeeting}
                      options={meetingOptions}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, preferredMeeting: val }))
                      }
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="relative">
                        <FloatingInput
                          label="Preferred Date"
                          name="preferredDate"
                          type="date"
                          value={form.preferredDate}
                          onChange={handleChange}
                        />
                        <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-stone/20">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                        </span>
                      </div>
                      <div className="relative">
                        <FloatingInput
                          label="Preferred Time"
                          name="preferredTime"
                          type="time"
                          value={form.preferredTime}
                          onChange={handleChange}
                        />
                        <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-stone/20">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Step 05 — Anything Else */}
                <motion.div
                  custom={4}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] p-5 sm:p-10"
                >
                  <div className="flex items-start gap-6">
                    <span className="font-serif text-5xl sm:text-6xl text-gold/15 leading-none mt-1 tracking-tight">
                      05
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-navy sm:text-3xl">
                        {steps[4].title}
                      </h3>
                      <p className="mt-1.5 text-sm text-stone/50">
                        {steps[4].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <FloatingTextarea
                      label="Notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center pt-6"
                >
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative inline-flex items-center gap-3 rounded-xl bg-navy px-10 py-4 font-serif text-lg text-white transition-all duration-500 hover:bg-navy/90 hover:shadow-xl hover:shadow-navy/20 disabled:opacity-60"
                  >
                    <span>{submitting ? "Submitting…" : "Begin My Financial Kundali"}</span>
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
                  {submitError && (
                    <p className="mt-3 text-sm text-red-500">{submitError}</p>
                  )}
                  <p className="mt-5 text-xs text-stone/50">
                    Your information is kept confidential. We respect your privacy.
                  </p>
                </motion.div>
              </div>

              {/* Right Column — Info Panel */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-8">
                {/* What happens after you submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] p-5 sm:p-10"
                >
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                    What happens after you submit
                  </p>

                  <div className="relative mt-8 pl-8">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/20 via-gold/10 to-transparent" />

                    {[
                      {
                        title: "We review your information",
                        desc: "Our advisory team personally reviews every submission within 24 hours.",
                      },
                      {
                        title: "We schedule a consultation",
                        desc: "We reach out to arrange a 60–90 minute conversation at your convenience.",
                      },
                      {
                        title: "We prepare your Financial Kundali",
                        desc: "Before we meet, we begin mapping the nine dimensions of your family's wealth.",
                      },
                      {
                        title: "Begin your journey",
                        desc: "Together, we build a financial architecture designed around your family.",
                      },
                    ].map((step, i) => (
                      <div key={i} className="relative pb-8 last:pb-0">
                        <div className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white ring-2 ring-white">
                          {i + 1}
                        </div>
                        <p className="font-serif text-base text-navy">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-stone/50">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Trust badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-cream shadow-[0_0_0_1px_rgba(168,121,31,0.08)] p-8 text-center sm:p-10"
                >
                  <div className="text-gold text-lg tracking-wider">
                    {"★".repeat(5)}
                  </div>
                  <p className="mt-3 font-serif text-xl text-navy">
                    Trusted by 400+ Indian Families
                  </p>
                  <p className="mt-2 text-sm text-stone/50">
                    Across 12 cities and 4 continents
                  </p>
                </motion.div>

                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-cream shadow-[0_0_0_1px_rgba(168,121,31,0.08)] p-8 sm:p-10"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A8791F"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-25 mb-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <p className="text-sm leading-relaxed text-stone/70 italic">
                    &ldquo;From our first conversation, we felt heard. They didn&apos;t
                    try to sell us anything — they just listened. That is when we
                    knew Kutumb was different.&rdquo;
                  </p>
                  <div className="mt-5">
                    <p className="font-serif text-navy">Vikram &amp; Neha R.</p>
                    <p className="text-xs text-stone/40 mt-0.5">Pune, Maharashtra</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        )}
      </div>
    </AnimatedSection>
  );
}
