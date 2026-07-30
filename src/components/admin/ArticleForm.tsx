"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { useToast } from "@/components/admin/ToastContext";
import {
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminToggle,
} from "@/components/admin/FormControls";
import { ImageIcon } from "@/components/icons/admin";
import JournalArticleCard from "@/components/JournalArticleCard";
import { journalCategories, slugify } from "@/lib/articles-utils";
import type { JournalArticle } from "@/lib/journal-data";

interface ArticleFormState {
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  readTime: string;
  featured: boolean;
  published: boolean;
}

const emptyForm: ArticleFormState = {
  title: "",
  slug: "",
  coverImage: "",
  category: journalCategories[0],
  author: "Kutumb Advisory",
  excerpt: "",
  content: "",
  readTime: "",
  featured: false,
  published: false,
};

export default function ArticleForm({
  mode,
  articleId,
}: {
  mode: "create" | "edit";
  articleId?: string;
}) {
  const router = useRouter();
  const { getArticle, createArticle, updateArticle } = useAdminData();
  const { showToast } = useToast();

  const existing = mode === "edit" && articleId ? getArticle(articleId) : undefined;
  const notFound = mode === "edit" && !existing;

  const [form, setForm] = useState<ArticleFormState>(
    existing
      ? {
          title: existing.title,
          slug: existing.slug,
          coverImage: existing.coverImage,
          category: existing.category,
          author: existing.author,
          excerpt: existing.excerpt,
          content: existing.content,
          readTime: existing.readTime,
          featured: existing.featured,
          published: existing.published,
        }
      : emptyForm
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const displaySlug = slugTouched ? form.slug : slugify(form.title);

  const previewArticle: JournalArticle = useMemo(
    () => ({
      id: "preview",
      title: form.title || "Your article title will appear here",
      excerpt:
        form.excerpt || "A short excerpt will appear here once you write one.",
      category: form.category,
      author: form.author || "Kutumb Advisory",
      date: existing?.date ?? "Draft",
      readTime: form.readTime || "— min read",
      featured: form.featured,
    }),
    [form, existing]
  );

  if (notFound) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-[0_0_0_1px_rgba(168,121,31,0.08)]">
        <h1 className="font-serif text-2xl text-navy">Article not found</h1>
        <p className="mt-3 text-sm text-stone/60">
          This article may have been deleted.
        </p>
        <Link
          href="/admin/journal"
          className="mt-6 inline-block text-sm font-medium text-gold hover:text-gold-dark"
        >
          Back to Journal
        </Link>
      </div>
    );
  }

  const handleChange =
    (field: keyof ArticleFormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (mode === "create") {
      const created = await createArticle({
        title: form.title,
        slug: displaySlug || slugify(form.title),
        coverImage: form.coverImage,
        category: form.category,
        author: form.author || "Kutumb Advisory",
        excerpt: form.excerpt,
        content: form.content,
        readTime: form.readTime,
        date: new Date().toISOString().slice(0, 10),
        featured: form.featured,
        published: form.published,
      });
      if (!created) {
        showToast("Could not create article — please try again");
        return;
      }
      showToast("Article created");
    } else if (articleId) {
      updateArticle(articleId, { ...form });
      showToast("Article updated");
    }

    router.push("/admin/journal");
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          {mode === "create" ? "New Article" : "Edit Article"}
        </p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
          {mode === "create" ? "Create Article" : form.title || "Edit Article"}
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5 rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] sm:p-8"
            >
              <AdminInput
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange("title")}
                required
              />
              <AdminInput
                label="Slug"
                name="slug"
                value={displaySlug}
                onChange={handleSlugChange}
              />

              <div>
                <div className="relative">
                  <input
                    type="url"
                    name="coverImage"
                    id="coverImage"
                    value={form.coverImage}
                    onChange={handleChange("coverImage")}
                    placeholder=" "
                    className="peer h-14 w-full rounded-xl border border-navy/10 bg-white px-5 pt-5 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
                  />
                  <label
                    htmlFor="coverImage"
                    className={`absolute left-5 top-4 text-sm text-stone/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gold ${
                      form.coverImage ? "top-1.5 text-[10px] text-gold" : ""
                    }`}
                  >
                    Cover Image URL
                  </label>
                </div>
                <div className="relative mt-3 aspect-[16/9] w-full overflow-hidden rounded-xl bg-ivory">
                  {form.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-stone/30">
                      <ImageIcon size={22} />
                      <span className="text-xs">
                        Paste an image URL to preview it here
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <AdminSelect
                  label="Category"
                  name="category"
                  value={form.category}
                  options={journalCategories}
                  onChange={handleChange("category")}
                />
                <AdminInput
                  label="Author"
                  name="author"
                  value={form.author}
                  onChange={handleChange("author")}
                />
              </div>

              <AdminInput
                label="Read Time (e.g. 8 min read)"
                name="readTime"
                value={form.readTime}
                onChange={handleChange("readTime")}
              />

              <AdminTextarea
                label="Excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange("excerpt")}
                rows={3}
              />

              <AdminTextarea
                label="Content"
                name="content"
                value={form.content}
                onChange={handleChange("content")}
                rows={12}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <AdminToggle
                label="Featured"
                description="Show as the flagship story"
                checked={form.featured}
                onChange={(v) => setForm((prev) => ({ ...prev, featured: v }))}
              />
              <AdminToggle
                label="Published"
                description={form.published ? "Live on the site" : "Saved as draft"}
                checked={form.published}
                onChange={(v) => setForm((prev) => ({ ...prev, published: v }))}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 pt-2"
            >
              <button
                type="submit"
                className="rounded-xl bg-navy px-8 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90 hover:shadow-lg"
              >
                {mode === "create" ? "Create Article" : "Save Changes"}
              </button>
              <Link
                href="/admin/journal"
                className="rounded-xl px-6 py-3.5 text-sm font-medium text-stone/60 transition-colors duration-300 hover:text-navy"
              >
                Cancel
              </Link>
            </motion.div>
          </div>

          {/* Live preview */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-cream p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08)] lg:sticky lg:top-10 sm:p-8"
            >
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
                Live Preview
              </p>
              <p className="mt-2 text-xs text-stone/50">
                This is how the article card will appear on the Journal page.
              </p>
              <div className="mt-6 max-w-sm">
                <JournalArticleCard article={previewArticle} variant="standard" />
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
