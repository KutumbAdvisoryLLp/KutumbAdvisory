"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useToast } from "@/components/admin/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { AdminInput, AdminTextarea } from "@/components/admin/FormControls";
import { ImageIcon } from "@/components/icons/admin";

const KUTUMB_LOGO_URL =
  "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780312133/tree_qw9bji.png";

function SectionCard({
  title,
  subtitle,
  children,
  onSave,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSave: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] sm:p-8"
    >
      <h2 className="font-serif text-xl text-navy">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-stone/50">{subtitle}</p>}
      <div className="mt-6 space-y-5">{children}</div>
      <button
        type="button"
        onClick={onSave}
        className="mt-6 rounded-xl bg-navy px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90 hover:shadow-lg"
      >
        Save
      </button>
    </motion.div>
  );
}

export default function AdminSettingsPage() {
  const { adminEmail } = useAdminAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [siteTitle, setSiteTitle] = useState("Kutumb Advisory — Family Wealth Platform");
  const [metaDescription, setMetaDescription] = useState(
    "Kutumb is a premium Family Wealth Advisory platform. Discover your Financial Kundali and bring clarity to your family's financial universe."
  );
  const [faviconUrl, setFaviconUrl] = useState("/favicon.ico");
  const [logoUrl, setLogoUrl] = useState(KUTUMB_LOGO_URL);

  const [accountEmail, setAccountEmail] = useState(adminEmail ?? "");
  const [syncedAdminEmail, setSyncedAdminEmail] = useState(adminEmail);
  if (adminEmail !== syncedAdminEmail) {
    setSyncedAdminEmail(adminEmail);
    setAccountEmail(adminEmail ?? "");
  }

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountError, setAccountError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setSiteTitle(data.site_title);
        setMetaDescription(data.meta_description ?? "");
        setFaviconUrl(data.favicon_url ?? "/favicon.ico");
        if (data.logo_url) setLogoUrl(data.logo_url);
      }
    })();
  }, [supabase]);

  const handleSaveMetadata = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_title: siteTitle,
        meta_description: metaDescription,
        favicon_url: faviconUrl,
      })
      .eq("id", 1);
    showToast(error ? "Could not save site metadata" : "Site metadata saved");
  };

  const handleSaveLogo = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({ logo_url: logoUrl })
      .eq("id", 1);
    showToast(error ? "Could not save logo" : "Logo updated");
  };

  const handleSaveAccount = async () => {
    setAccountError("");

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setAccountError("New password must be at least 8 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setAccountError("Passwords do not match.");
        return;
      }
    }

    const emailChanged = accountEmail.trim() && accountEmail.trim() !== adminEmail;

    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setAccountError(error.message);
        return;
      }
    }

    if (emailChanged) {
      const { error } = await supabase.auth.updateUser({ email: accountEmail.trim() });
      if (error) {
        setAccountError(error.message);
        return;
      }
    }

    setNewPassword("");
    setConfirmPassword("");

    if (emailChanged) {
      showToast("Check your inbox to confirm your new admin email");
    } else {
      showToast("Admin account settings saved");
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          Settings
        </p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
          Site Settings
        </h1>
        <p className="mt-2 text-sm text-stone/60">
          Changes here apply across the live site.
        </p>
      </motion.div>

      <div className="mt-10 space-y-6">
        <SectionCard
          title="Site Metadata"
          subtitle="Controls how the site appears in search results and browser tabs"
          onSave={handleSaveMetadata}
          delay={0.05}
        >
          <AdminInput
            label="Site Title"
            name="siteTitle"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
          />
          <AdminTextarea
            label="Meta Description"
            name="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
          />
          <AdminInput
            label="Favicon URL"
            name="faviconUrl"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
          />
        </SectionCard>

        <SectionCard
          title="Logo"
          subtitle="Used in the navigation bar and footer"
          onSave={handleSaveLogo}
          delay={0.1}
        >
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ivory">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <ImageIcon size={22} className="text-stone/30" />
              )}
            </div>
            <div className="flex-1">
              <AdminInput
                label="Logo URL"
                name="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Admin Account"
          subtitle="Change your login email and password"
          onSave={handleSaveAccount}
          delay={0.15}
        >
          <AdminInput
            label="Admin Email"
            name="accountEmail"
            type="email"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput
              label="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <AdminInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {accountError && (
            <p className="text-[13px] text-red-500">{accountError}</p>
          )}
          <p className="text-[11px] text-stone/40">
            Leave password fields blank to keep your current password.
            Changing your email sends a confirmation link to the new address
            before it takes effect.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
