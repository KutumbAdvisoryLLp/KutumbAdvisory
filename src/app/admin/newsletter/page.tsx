"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { useToast } from "@/components/admin/ToastContext";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { AdminInput, AdminTextarea } from "@/components/admin/FormControls";
import { SearchIcon, TrashIcon, NewsletterIcon } from "@/components/icons/admin";
import type { Subscriber } from "@/lib/admin-mock-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminNewsletterPage() {
  const { subscribers, deleteSubscriber } = useAdminData();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [confirmSend, setConfirmSend] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers
      .filter((s) => !q || s.email.toLowerCase().includes(q))
      .sort((a, b) => +new Date(b.subscribedAt) - +new Date(a.subscribedAt));
  }, [subscribers, search]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSubscriber(deleteTarget.id);
    showToast("Subscriber removed");
    setDeleteTarget(null);
  };

  const handleSend = () => {
    setConfirmSend(false);
    showToast(`Newsletter sent to ${subscribers.length} subscribers`);
    setSubject("");
    setBody("");
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          Newsletter
        </p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
          Subscribers
        </h1>
        <p className="mt-2 text-sm text-stone/60">
          {subscribers.length} people subscribed to the Family Wealth Journal.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Subscriber list */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm"
          >
            <SearchIcon
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone/30"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email"
              className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30 focus:shadow-[0_0_0_3px_rgba(168,121,31,0.08)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-h-[560px] overflow-y-auto rounded-2xl bg-white shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
          >
            {filtered.length === 0 ? (
              <p className="p-10 text-center text-sm text-stone/50">
                No subscribers match your search.
              </p>
            ) : (
              <div className="divide-y divide-navy/6">
                {filtered.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy">
                        {sub.email}
                      </p>
                      <p className="text-xs text-stone/50">
                        Subscribed {formatDate(sub.subscribedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(sub)}
                      aria-label="Unsubscribe"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ivory text-navy/60 transition-colors duration-300 hover:text-red-500"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Compose */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ivory text-gold">
                <NewsletterIcon size={18} />
              </div>
              <div>
                <h2 className="font-serif text-xl text-navy">
                  Compose Newsletter
                </h2>
                <p className="text-xs text-stone/50">
                  Sends to all {subscribers.length} subscribers
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <AdminInput
                label="Subject Line"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <AdminTextarea
                label="Body"
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
              />
            </div>

            <button
              type="button"
              disabled={!subject.trim() || !body.trim()}
              onClick={() => setConfirmSend(true)}
              className="mt-6 w-full rounded-xl bg-navy px-6 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send to All Subscribers
            </button>
            <p className="mt-3 text-center text-[11px] text-stone/40">
              UI only for now — no email is actually sent.
            </p>
          </div>
        </motion.div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this subscriber?"
        description={`${deleteTarget?.email ?? "This subscriber"} will be unsubscribed from the newsletter.`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={confirmSend}
        title="Send this newsletter?"
        description={`This will send "${subject}" to ${subscribers.length} subscribers — are you sure?`}
        confirmLabel="Send Newsletter"
        danger={false}
        onConfirm={handleSend}
        onCancel={() => setConfirmSend(false)}
      />
    </div>
  );
}
