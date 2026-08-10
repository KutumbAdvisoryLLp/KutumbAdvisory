"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Megaphone, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  bg_color: string;
  text_color: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminBannersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [banners, setBanners] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [bgColor, setBgColor] = useState("bg-navy");
  const [textColor, setTextColor] = useState("text-gold");
  const [isActive, setIsActive] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBanners(data as Announcement[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, [supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);

    if (isActive) {
      // Deactivate other banners if setting this active
      await supabase.from("announcements").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    }

    await supabase.from("announcements").insert({
      message: message.trim(),
      link_text: linkText.trim() || null,
      link_url: linkUrl.trim() || null,
      bg_color: bgColor,
      text_color: textColor,
      is_active: isActive,
    });

    setMessage("");
    setLinkText("");
    setLinkUrl("");
    setSaving(false);
    fetchBanners();
  };

  const toggleActive = async (id: string, current: boolean) => {
    if (!current) {
      // Deactivate all first
      await supabase.from("announcements").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    }
    await supabase.from("announcements").update({ is_active: !current }).eq("id", id);
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchBanners();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-navy">Announcement Banner Manager</h1>
        <p className="mt-1 text-sm text-stone/60">
          Create & toggle top header notification banners across the website.
        </p>
      </div>

      {/* Create New Banner */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
          <Megaphone className="text-gold" size={20} />
          <span>Add New Banner</span>
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Banner Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. ✦ Join our upcoming live webinar on multi-generational family estate planning."
              required
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Button / Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Register Now →"
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Button Link URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /contact or https://..."
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span>Publish Immediately (Active)</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-6 py-2.5 bg-gold text-navy font-medium rounded-xl hover:bg-gold-dark transition-all text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{saving ? "Saving..." : "Add Banner"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Banners */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4">Saved Banners</h2>

        {loading ? (
          <p className="text-sm text-stone/60 py-4">Loading banners...</p>
        ) : banners.length === 0 ? (
          <p className="text-sm text-stone/60 py-4">No banners created yet.</p>
        ) : (
          <div className="space-y-3">
            {banners.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  b.is_active ? "border-gold/40 bg-gold/5" : "border-stone/20 bg-stone/5"
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${b.is_active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                      {b.is_active ? "Active Banner" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-navy">{b.message}</p>
                  {b.link_text && (
                    <p className="text-xs text-stone/60">
                      CTA: <span className="font-semibold">{b.link_text}</span> ({b.link_url})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleActive(b.id, b.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      b.is_active
                        ? "border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "border-stone/30 text-stone hover:bg-stone/10"
                    }`}
                  >
                    {b.is_active ? "Deactivate" : "Make Active"}
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
