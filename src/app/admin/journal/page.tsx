"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { useToast } from "@/components/admin/ToastContext";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  StarFilledIcon,
  ImageIcon,
} from "@/components/icons/admin";
import type { AdminArticle } from "@/lib/admin-mock-data";

export default function AdminJournalPage() {
  const { articles, deleteArticle, toggleArticlePublished } = useAdminData();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<AdminArticle | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteArticle(deleteTarget.id);
    showToast("Article deleted");
    setDeleteTarget(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Journal
          </p>
          <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
            Articles
          </h1>
          <p className="mt-2 text-sm text-stone/60">
            {articles.length} articles &middot;{" "}
            {articles.filter((a) => a.published).length} published
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90 hover:shadow-lg"
        >
          <PlusIcon size={15} />
          Create New Article
        </Link>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: Math.min(i, 6) * 0.06,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(32,27,98,0.08),0_0_0_1px_rgba(168,121,31,0.12)]"
          >
            <div className="relative aspect-[16/9] bg-gradient-to-br from-ivory via-cream to-ivory">
              {article.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone/20">
                  <ImageIcon size={28} />
                </div>
              )}
              {article.featured && (
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-navy/90 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur-sm">
                  <StarFilledIcon size={10} />
                  Featured
                </span>
              )}
              <span
                className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  article.published
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-stone/10 text-stone/60"
                }`}
              >
                {article.published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B8862B]">
                {article.category}
              </span>
              <h3 className="mt-1.5 line-clamp-2 font-serif text-lg leading-snug text-navy">
                {article.title}
              </h3>
              <p className="mt-2 text-xs text-stone/50">
                {article.author} &middot; {article.date}
              </p>

              <div className="mt-auto flex items-center justify-between pt-5">
                <button
                  onClick={() => toggleArticlePublished(article.id)}
                  className="text-xs font-medium text-gold transition-colors duration-300 hover:text-gold-dark"
                >
                  {article.published ? "Unpublish" : "Publish"}
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/journal/${article.id}/edit`}
                    aria-label="Edit article"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory text-navy/60 transition-colors duration-300 hover:text-gold"
                  >
                    <PencilIcon size={14} />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(article)}
                    aria-label="Delete article"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory text-navy/60 transition-colors duration-300 hover:text-red-500"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this article?"
        description={`"${deleteTarget?.title ?? ""}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
