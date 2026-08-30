"use client";

import { useEffect, useState, useMemo } from "react";
import { Inbox, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Submission {
  id: string;
  customer_id: string | null;
  name: string;
  testimonial: string;
  status: "new" | "featured" | "dismissed";
  created_at: string;
}

export default function AdminTestimonialSubmissionsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonial_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [supabase]);

  const handleFeature = async (item: Submission) => {
    setBusyId(item.id);

    const { data: existing } = await supabase
      .from("testimonials")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder = (existing?.[0]?.display_order ?? 0) + 1;

    await supabase.from("testimonials").insert({
      name: item.name,
      location: "",
      role: "Kutumb Customer",
      quote: item.testimonial,
      avatar_url: null,
      rating: 5,
      is_featured: true,
      display_order: nextOrder,
    });

    await supabase.from("testimonial_submissions").update({ status: "featured" }).eq("id", item.id);
    setBusyId(null);
    fetchSubmissions();
  };

  const handleDismiss = async (id: string) => {
    setBusyId(id);
    await supabase.from("testimonial_submissions").update({ status: "dismissed" }).eq("id", id);
    setBusyId(null);
    fetchSubmissions();
  };

  const statusBadge = (status: Submission["status"]) => {
    if (status === "featured") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "dismissed") {
      return "bg-stone-100 text-stone-500 border-stone-200";
    }
    return "bg-gold/10 text-gold-dark border-gold/30";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-navy">View Testimonials</h1>
        <p className="mt-1 text-sm text-stone/60">
          Testimonials submitted by customers from their MyKundali dashboard. Feature the good
          ones on the site, or dismiss the rest.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
          <Inbox className="text-gold" size={20} />
          <span>Submissions</span>
        </h2>

        {loading ? (
          <p className="text-sm text-stone/60 py-4">Loading submissions...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-stone/60 py-4">No testimonials submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-stone/20 bg-cream/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-semibold text-navy text-lg">{item.name}</span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${statusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone/50 mb-3">
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-stone leading-relaxed italic">&ldquo;{item.testimonial}&rdquo;</p>
                </div>

                {item.status === "new" && (
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-stone/10">
                    <button
                      onClick={() => handleFeature(item)}
                      disabled={busyId === item.id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium bg-gold text-navy hover:bg-gold-dark transition-all disabled:opacity-60"
                    >
                      <Check size={14} />
                      <span>Feature on Site</span>
                    </button>
                    <button
                      onClick={() => handleDismiss(item.id)}
                      disabled={busyId === item.id}
                      className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium text-stone/60 border border-stone/20 hover:bg-stone-50 transition-all disabled:opacity-60"
                    >
                      <X size={14} />
                      <span>Dismiss</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
