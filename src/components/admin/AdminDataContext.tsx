"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import type { Lead, Subscriber, AdminArticle } from "@/types/admin";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type SubscriberRow = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

function leadFromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    city: row.city ?? "",
    occupation: row.occupation ?? "",
    ageGroup: row.age_group ?? "",
    contactAs: row.contact_as ?? "",
    primaryGoal: row.primary_goal ?? "",
    preferredMeeting: row.preferred_meeting ?? "",
    preferredDate: row.preferred_date ?? "",
    preferredTime: row.preferred_time ?? "",
    notes: row.notes ?? "",
    status: row.status as Lead["status"],
    submittedAt: row.submitted_at,
  };
}

function leadPatchToRow(patch: Partial<Lead>): Database["public"]["Tables"]["leads"]["Update"] {
  const row: Database["public"]["Tables"]["leads"]["Update"] = {};
  if (patch.fullName !== undefined) row.full_name = patch.fullName;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.occupation !== undefined) row.occupation = patch.occupation;
  if (patch.ageGroup !== undefined) row.age_group = patch.ageGroup;
  if (patch.contactAs !== undefined) row.contact_as = patch.contactAs;
  if (patch.primaryGoal !== undefined) row.primary_goal = patch.primaryGoal;
  if (patch.preferredMeeting !== undefined) row.preferred_meeting = patch.preferredMeeting;
  if (patch.preferredDate !== undefined) row.preferred_date = patch.preferredDate || null;
  if (patch.preferredTime !== undefined) row.preferred_time = patch.preferredTime || null;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.status !== undefined) row.status = patch.status;
  return row;
}

function subscriberFromRow(row: SubscriberRow): Subscriber {
  return { id: row.id, email: row.email, subscribedAt: row.subscribed_at };
}

function articleFromRow(row: ArticleRow): AdminArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    coverImage: row.cover_image ?? "",
    category: row.category,
    author: row.author,
    excerpt: row.excerpt,
    content: row.content,
    readTime: row.read_time ?? "",
    date: row.article_date,
    featured: row.featured,
    published: row.published,
  };
}

function articleToRow(
  article: Omit<AdminArticle, "id">
): Database["public"]["Tables"]["articles"]["Insert"] {
  return {
    slug: article.slug,
    title: article.title,
    cover_image: article.coverImage || null,
    category: article.category,
    author: article.author,
    excerpt: article.excerpt,
    content: article.content,
    read_time: article.readTime || null,
    article_date: article.date,
    featured: article.featured,
    published: article.published,
  };
}

function articlePatchToRow(
  patch: Partial<AdminArticle>
): Database["public"]["Tables"]["articles"]["Update"] {
  const row: Database["public"]["Tables"]["articles"]["Update"] = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.slug !== undefined) row.slug = patch.slug;
  if (patch.coverImage !== undefined) row.cover_image = patch.coverImage || null;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.author !== undefined) row.author = patch.author;
  if (patch.excerpt !== undefined) row.excerpt = patch.excerpt;
  if (patch.content !== undefined) row.content = patch.content;
  if (patch.readTime !== undefined) row.read_time = patch.readTime || null;
  if (patch.date !== undefined) row.article_date = patch.date;
  if (patch.featured !== undefined) row.featured = patch.featured;
  if (patch.published !== undefined) row.published = patch.published;
  return row;
}

interface AdminDataContextValue {
  loading: boolean;

  leads: Lead[];
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  subscribers: Subscriber[];
  deleteSubscriber: (id: string) => void;

  articles: AdminArticle[];
  getArticle: (id: string) => AdminArticle | undefined;
  createArticle: (article: Omit<AdminArticle, "id">) => Promise<AdminArticle | null>;
  updateArticle: (id: string, patch: Partial<AdminArticle>) => void;
  deleteArticle: (id: string) => void;
  toggleArticlePublished: (id: string) => void;

  customerCount: number;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [leadsRes, subsRes, articlesRes, customersRes] = await Promise.all([
        supabase.from("leads").select("*").order("submitted_at", { ascending: false }),
        supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false }),
        supabase.from("articles").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data.map(leadFromRow));
      if (subsRes.data) setSubscribers(subsRes.data.map(subscriberFromRow));
      if (articlesRes.data) setArticles(articlesRes.data.map(articleFromRow));
      if (customersRes.count !== null && customersRes.count !== undefined) {
        setCustomerCount(customersRes.count);
      }
      setLoading(false);
    })();
  }, [supabase]);

  const updateLead = useCallback(
    (id: string, patch: Partial<Lead>) => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
      supabase.from("leads").update(leadPatchToRow(patch)).eq("id", id).then();
    },
    [supabase]
  );

  const deleteLead = useCallback(
    (id: string) => {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      supabase.from("leads").delete().eq("id", id).then();
    },
    [supabase]
  );

  const deleteSubscriber = useCallback(
    (id: string) => {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      supabase.from("newsletter_subscribers").delete().eq("id", id).then();
    },
    [supabase]
  );

  const getArticle = useCallback(
    (id: string) => articles.find((a) => a.id === id),
    [articles]
  );

  const createArticle = useCallback(
    async (article: Omit<AdminArticle, "id">) => {
      const { data, error } = await supabase
        .from("articles")
        .insert(articleToRow(article))
        .select()
        .single();

      if (error || !data) return null;

      const newArticle = articleFromRow(data);
      setArticles((prev) => [newArticle, ...prev]);
      return newArticle;
    },
    [supabase]
  );

  const updateArticle = useCallback(
    (id: string, patch: Partial<AdminArticle>) => {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
      supabase.from("articles").update(articlePatchToRow(patch)).eq("id", id).then();
    },
    [supabase]
  );

  const deleteArticle = useCallback(
    (id: string) => {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      supabase.from("articles").delete().eq("id", id).then();
    },
    [supabase]
  );

  const toggleArticlePublished = useCallback(
    (id: string) => {
      const current = articles.find((a) => a.id === id);
      if (!current) return;
      const nextPublished = !current.published;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, published: nextPublished } : a))
      );
      supabase.from("articles").update({ published: nextPublished }).eq("id", id).then();
    },
    [articles, supabase]
  );

  return (
    <AdminDataContext.Provider
      value={{
        loading,
        leads,
        updateLead,
        deleteLead,
        subscribers,
        deleteSubscriber,
        articles,
        getArticle,
        createArticle,
        updateArticle,
        deleteArticle,
        toggleArticlePublished,
        customerCount,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
