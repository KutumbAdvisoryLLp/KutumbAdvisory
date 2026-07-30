"use client";

import { createContext, useContext, useState, useCallback } from "react";
import {
  initialLeads,
  initialSubscribers,
  initialArticles,
  type Lead,
  type Subscriber,
  type AdminArticle,
} from "@/lib/admin-mock-data";

interface AdminDataContextValue {
  leads: Lead[];
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  subscribers: Subscriber[];
  deleteSubscriber: (id: string) => void;

  articles: AdminArticle[];
  getArticle: (id: string) => AdminArticle | undefined;
  createArticle: (article: Omit<AdminArticle, "id">) => AdminArticle;
  updateArticle: (id: string, patch: Partial<AdminArticle>) => void;
  deleteArticle: (id: string) => void;
  toggleArticlePublished: (id: string) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [articles, setArticles] = useState<AdminArticle[]>(initialArticles);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const deleteSubscriber = useCallback((id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getArticle = useCallback(
    (id: string) => articles.find((a) => a.id === id),
    [articles]
  );

  const createArticle = useCallback((article: Omit<AdminArticle, "id">) => {
    const newArticle: AdminArticle = { ...article, id: `article-${Date.now()}` };
    setArticles((prev) => [newArticle, ...prev]);
    return newArticle;
  }, []);

  const updateArticle = useCallback((id: string, patch: Partial<AdminArticle>) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleArticlePublished = useCallback((id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published: !a.published } : a))
    );
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
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
