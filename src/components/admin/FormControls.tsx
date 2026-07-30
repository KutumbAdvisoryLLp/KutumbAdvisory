"use client";

import { ChevronDownIcon } from "@/components/icons/admin";

export function AdminInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = " ",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="peer h-14 w-full rounded-xl border border-navy/10 bg-white px-5 pt-5 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
      />
      <label
        htmlFor={name}
        className={`absolute left-5 top-4 text-sm text-stone/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gold ${
          value ? "top-1.5 text-[10px] text-gold" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function AdminTextarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) {
  return (
    <div className="relative">
      <textarea
        name={name}
        id={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full resize-none rounded-xl border border-navy/10 bg-white px-5 pt-6 pb-3 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
      />
      <label
        htmlFor={name}
        className={`absolute left-5 top-4 text-sm text-stone/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gold ${
          value ? "top-1.5 text-[10px] text-gold" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function AdminSelect({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="peer h-14 w-full appearance-none rounded-xl border border-navy/10 bg-white px-5 pt-5 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-5 top-1.5 text-[10px] text-gold"
      >
        {label}
      </label>
      <ChevronDownIcon
        size={14}
        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-stone/30"
      />
    </div>
  );
}

export function AdminToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-navy/8 bg-white px-5 py-4">
      <div>
        <p className="text-sm font-medium text-navy">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-stone/50">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "bg-gold" : "bg-navy/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
