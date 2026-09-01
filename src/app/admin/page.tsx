"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdminData } from "@/components/admin/AdminDataContext";
import StatusPill from "@/components/admin/StatusPill";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle } from "lucide-react";
import {
  ContactAdminIcon,
  NewsletterIcon,
  JournalAdminIcon,
  UsersIcon,
} from "@/components/icons/admin";

interface ActivityItem {
  id: string;
  kind: "customer" | "payment";
  label: string;
  detail: string;
  at: string;
}

interface ErrorItem {
  id: string;
  context: string;
  message: string;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const { leads, subscribers, articles, customerCount } = useAdminData();
  const supabase = useMemo(() => createClient(), []);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  useEffect(() => {
    (async () => {
      const [customersRes, paymentsRes, errorsRes] = await Promise.all([
        supabase.from("customers").select("id, full_name, created_at").order("created_at", { ascending: false }).limit(5),
        supabase
          .from("payments")
          .select("id, amount, status, created_at, customers(full_name)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("error_log").select("id, context, message, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const customerItems: ActivityItem[] = (customersRes.data ?? []).map(
        (c: { id: string; full_name: string; created_at: string }) => ({
          id: `customer-${c.id}`,
          kind: "customer",
          label: c.full_name,
          detail: "New customer signup",
          at: c.created_at,
        })
      );
      const paymentItems: ActivityItem[] = (paymentsRes.data ?? []).map(
        (p: { id: string; amount: number; status: string; created_at: string; customers: { full_name: string } | null }) => ({
          id: `payment-${p.id}`,
          kind: "payment",
          label: p.customers?.full_name ?? "Unknown customer",
          detail: `Payment ${p.status} · ₹${(p.amount / 100).toLocaleString("en-IN")}`,
          at: p.created_at,
        })
      );

      setActivity(
        [...customerItems, ...paymentItems].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 6)
      );
      setErrors(
        (errorsRes.data ?? []).map((e: { id: string; context: string; message: string; created_at: string }) => ({
          id: e.id,
          context: e.context,
          message: e.message,
          createdAt: e.created_at,
        }))
      );
    })();
  }, [supabase]);

  const publishedCount = articles.filter((a) => a.published).length;

  const recentLeads = [...leads]
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
    .slice(0, 5);

  const recentSubscribers = [...subscribers]
    .sort((a, b) => +new Date(b.subscribedAt) - +new Date(a.subscribedAt))
    .slice(0, 5);

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      icon: ContactAdminIcon,
      href: "/admin/contact",
    },
    {
      label: "Newsletter Subscribers",
      value: subscribers.length,
      icon: NewsletterIcon,
      href: "/admin/newsletter",
    },
    {
      label: "Published Articles",
      value: publishedCount,
      icon: JournalAdminIcon,
      href: "/admin/journal",
    },
    {
      label: "Registered Customers",
      value: customerCount,
      icon: UsersIcon,
      href: "/admin/customers",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
          Overview
        </p>
        <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-stone/60">
          A snapshot of leads, subscribers, and content across the site.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.08,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={stat.href}
              className="group block rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(32,27,98,0.08),0_0_0_1px_rgba(168,121,31,0.12)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory text-navy/50 transition-colors duration-300 group-hover:text-gold">
                <stat.icon size={20} />
              </div>
              <p className="mt-5 font-serif text-4xl text-navy">{stat.value}</p>
              <p className="mt-1.5 text-sm text-stone/60">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white p-7 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-navy">Recent Leads</h2>
            <Link
              href="/admin/contact"
              className="text-xs font-medium text-gold transition-colors duration-300 hover:text-gold-dark"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 divide-y divide-navy/6">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy">
                    {lead.fullName}
                  </p>
                  <p className="truncate text-xs text-stone/50">
                    {lead.email} &middot; {formatDate(lead.submittedAt)}
                  </p>
                </div>
                <StatusPill status={lead.status} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white p-7 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-navy">
              Recent Newsletter Signups
            </h2>
            <Link
              href="/admin/newsletter"
              className="text-xs font-medium text-gold transition-colors duration-300 hover:text-gold-dark"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 divide-y divide-navy/6">
            {recentSubscribers.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <p className="truncate text-sm font-medium text-navy">
                  {sub.email}
                </p>
                <span className="shrink-0 text-xs text-stone/50">
                  {formatDate(sub.subscribedAt)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white p-7 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-navy">Recent Activity</h2>
            <Link
              href="/admin/payments"
              className="text-xs font-medium text-gold transition-colors duration-300 hover:text-gold-dark"
            >
              View payments
            </Link>
          </div>
          <div className="mt-5 divide-y divide-navy/6">
            {activity.length === 0 && <p className="py-3.5 text-sm text-stone/50">No recent activity.</p>}
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy">{item.label}</p>
                  <p className="truncate text-xs text-stone/50">{item.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-stone/50">{formatDate(item.at)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white p-7 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="font-serif text-xl text-navy">Recent Errors</h2>
          </div>
          <div className="mt-5 divide-y divide-navy/6">
            {errors.length === 0 && <p className="py-3.5 text-sm text-stone/50">No errors recorded — all clear.</p>}
            {errors.map((e) => (
              <div key={e.id} className="py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <p className="truncate text-sm font-medium text-navy">{e.context}</p>
                  <span className="shrink-0 text-xs text-stone/50">{formatDate(e.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-stone/50">{e.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
