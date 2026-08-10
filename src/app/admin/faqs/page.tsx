"use client";

import { useEffect, useState, useMemo } from "react";
import { HelpCircle, Plus, Trash2, Check, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

const CATEGORIES = ["Financial Kundali", "Advisory Services", "Data Security", "Pricing & Fees", "General"];

export default function AdminFAQsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setFaqs(data as FAQ[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, [supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);

    await supabase.from("faqs").insert({
      category,
      question: question.trim(),
      answer: answer.trim(),
      is_published: isPublished,
      display_order: faqs.length + 1,
    });

    setQuestion("");
    setAnswer("");
    setSaving(false);
    fetchFaqs();
  };

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from("faqs").update({ is_published: !current }).eq("id", id);
    fetchFaqs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    fetchFaqs();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-navy">FAQ &amp; Help Center Manager</h1>
        <p className="mt-1 text-sm text-stone/60">
          Add, edit, categorize, and organize frequently asked questions across the website.
        </p>
      </div>

      {/* Add FAQ Form */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
          <HelpCircle className="text-gold" size={20} />
          <span>Add New FAQ</span>
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is the Financial Kundali?"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Answer</label>
            <textarea
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Financial Kundali is Kutumb Advisory's 9-graha diagnostic model..."
              required
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span>Publish Immediately</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-6 py-2.5 bg-gold text-navy font-medium rounded-xl hover:bg-gold-dark transition-all text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{saving ? "Saving..." : "Add Question"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* FAQ List */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4">Saved FAQs</h2>

        {loading ? (
          <p className="text-sm text-stone/60 py-4">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-sm text-stone/60 py-4">No FAQs created yet.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-5 rounded-2xl border border-stone/20 bg-cream/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gold/15 text-gold-dark border border-gold/30">
                      {faq.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${faq.is_published ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                      {faq.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="font-serif text-navy text-lg font-semibold">{faq.question}</p>
                  <p className="text-sm text-stone mt-2 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone/10">
                  <button
                    onClick={() => togglePublished(faq.id, faq.is_published)}
                    className="text-xs px-3 py-1 rounded-lg font-medium border border-stone/20 hover:bg-stone/10 flex items-center gap-1.5"
                  >
                    {faq.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{faq.is_published ? "Unpublish" : "Publish"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id)}
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
