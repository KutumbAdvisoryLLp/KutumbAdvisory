"use client";

import { useEffect, useState, useMemo } from "react";
import { MessageSquareQuote, Plus, Trash2, Star, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  quote: string;
  avatar_url: string | null;
  rating: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export default function AdminTestimonialsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [isFeatured, setIsFeatured] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setItems(data as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, [supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    setSaving(true);

    await supabase.from("testimonials").insert({
      name: name.trim(),
      location: location.trim() || "India",
      role: role.trim() || "Client",
      quote: quote.trim(),
      avatar_url: avatarUrl.trim() || null,
      rating,
      is_featured: isFeatured,
      display_order: items.length + 1,
    });

    setName("");
    setLocation("");
    setRole("");
    setQuote("");
    setAvatarUrl("");
    setSaving(false);
    fetchTestimonials();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from("testimonials").update({ is_featured: !current }).eq("id", id);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    fetchTestimonials();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-navy">Testimonials Manager</h1>
        <p className="mt-1 text-sm text-stone/60">
          Add and manage client reviews displayed on the homepage and about page.
        </p>
      </div>

      {/* Add Testimonial Form */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
          <MessageSquareQuote className="text-gold" size={20} />
          <span>Add New Testimonial</span>
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Client Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Mehta"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">City / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Profession / Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Tech Entrepreneur"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Client Quote</label>
            <textarea
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. Financial Kundali brought complete peace of mind to our family..."
              required
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Avatar Image URL (Optional)</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Rating (1 to 5 Stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span>Feature on Website</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-6 py-2.5 bg-gold text-navy font-medium rounded-xl hover:bg-gold-dark transition-all text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{saving ? "Saving..." : "Add Testimonial"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Testimonials List */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4">Saved Testimonials</h2>

        {loading ? (
          <p className="text-sm text-stone/60 py-4">Loading testimonials...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-stone/60 py-4">No testimonials created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-stone/20 bg-cream/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-semibold text-navy text-lg">{item.name}</span>
                    <span className="text-xs text-gold flex items-center gap-0.5 font-bold">
                      {"★".repeat(item.rating)}
                    </span>
                  </div>
                  <p className="text-xs text-stone/60 mb-3">{item.role} · {item.location}</p>
                  <p className="text-sm text-stone leading-relaxed italic">&ldquo;{item.quote}&rdquo;</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone/10">
                  <button
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      item.is_featured ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {item.is_featured ? "✓ Featured" : "Hidden"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
