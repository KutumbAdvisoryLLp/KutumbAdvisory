"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { downloadCsv } from "@/lib/exportCsv";

const NAVY = "#201B62";
const GOLD = "#A8791F";
const GOLD_LIGHT = "#D4AF37";
const STONE = "#6B7280";

const pieColors = ["#201B62", "#A8791F", "#D4AF37", "#8B6318", "#C9952E"];

function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)] sm:p-8"
    >
      <h2 className="font-serif text-xl text-navy">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-stone/50">{subtitle}</p>}
      <div className="mt-6 h-64">{children}</div>
    </motion.div>
  );
}

function StatTile({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string | number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(168,121,31,0.08),0_2px_12px_rgba(32,27,98,0.04)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone/40">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl text-navy">{value}</p>
    </motion.div>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(168,121,31,0.15)",
  boxShadow: "0 8px 24px rgba(32,27,98,0.08)",
  fontSize: 12,
};

function last14Days(): string[] {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function classifyReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
  if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(host)) return "Organic Search";
  if (/facebook\.|instagram\.|twitter\.|x\.com|linkedin\.|tiktok\./.test(host)) return "Social";
  return "Referral";
}

export default function AdminAnalyticsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [completedAssessments, setCompletedAssessments] = useState(0);
  const [leadsOverTimeData, setLeadsOverTimeData] = useState<{ date: string; leads: number }[]>([]);
  const [pageViewsData, setPageViewsData] = useState<{ date: string; views: number }[]>([]);
  const [topPagesData, setTopPagesData] = useState<{ page: string; views: number }[]>([]);
  const [trafficSourcesData, setTrafficSourcesData] = useState<{ source: string; value: number }[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 13);
      since.setHours(0, 0, 0, 0);

      const [leadsRes, customersRes, subsCount, resultsCount, pageViewsRes] = await Promise.all([
        supabase.from("leads").select("submitted_at"),
        supabase.from("customers").select("created_at"),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("assessment_results").select("customer_id", { count: "exact", head: true }),
        supabase.from("page_views").select("path,referrer,viewed_at").gte("viewed_at", since.toISOString()),
      ]);

      const leadRows = leadsRes.data ?? [];
      const customerRows = customersRes.data ?? [];
      setTotalSubscribers(subsCount.count ?? 0);
      setTotalCustomers(customerRows.length);
      setCompletedAssessments(resultsCount.count ?? 0);

      // Combine lead submissions and customer registrations
      const allLeadDates = [
        ...leadRows.map((r: { submitted_at: string }) => r.submitted_at),
        ...customerRows.map((c: { created_at: string }) => c.created_at),
      ].filter(Boolean);

      setTotalLeads(Math.max(leadRows.length, customerRows.length));

      const days = last14Days();
      const counts = new Map(days.map((d) => [d, 0]));
      for (const dateStr of allLeadDates) {
        const day = dateStr.slice(0, 10);
        if (counts.has(day)) counts.set(day, (counts.get(day) ?? 0) + 1);
      }
      setLeadsOverTimeData(
        days.map((d) => ({ date: formatDayLabel(d), leads: counts.get(d) ?? 0 }))
      );

      const views = pageViewsRes.data ?? [];

      const viewCounts = new Map(days.map((d) => [d, 0]));
      for (const v of views) {
        const day = v.viewed_at.slice(0, 10);
        if (viewCounts.has(day)) viewCounts.set(day, (viewCounts.get(day) ?? 0) + 1);
      }
      setPageViewsData(days.map((d) => ({ date: formatDayLabel(d), views: viewCounts.get(d) ?? 0 })));

      const pathCounts = new Map<string, number>();
      for (const v of views) pathCounts.set(v.path, (pathCounts.get(v.path) ?? 0) + 1);
      setTopPagesData(
        Array.from(pathCounts, ([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
      );

      const sourceCounts = new Map<string, number>();
      for (const v of views) {
        const source = classifyReferrer(v.referrer);
        sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
      }
      const totalViews = views.length;
      setTrafficSourcesData(
        totalViews === 0
          ? []
          : Array.from(sourceCounts, ([source, count]) => ({
              source,
              value: Math.round((count / totalViews) * 100),
            })).sort((a, b) => b.value - a.value)
      );
    })();
  }, [supabase]);

  const inProgressAssessments = Math.max(0, totalCustomers - completedAssessments);

  const handleExport = () => {
    downloadCsv("kutumb-analytics", [
      ["Summary"],
      ["Metric", "Value"],
      ["Total Leads", totalLeads],
      ["Newsletter Subscribers", totalSubscribers],
      ["Registered Customers", totalCustomers],
      ["Assessments Completed", completedAssessments],
      ["Assessments In Progress", inProgressAssessments],
      [],
      ["Page Views — Last 14 Days"],
      ["Date", "Views"],
      ...pageViewsData.map((d) => [d.date, d.views]),
      [],
      ["Leads Over Time — Last 14 Days"],
      ["Date", "Leads"],
      ...leadsOverTimeData.map((d) => [d.date, d.leads]),
      [],
      ["Top Pages — Last 14 Days"],
      ["Page", "Views"],
      ...topPagesData.map((d) => [d.page, d.views]),
      [],
      ["Traffic Sources — Last 14 Days"],
      ["Source", "Share %"],
      ...trafficSourcesData.map((d) => [d.source, d.value]),
    ]);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            Analytics
          </p>
          <h1 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
            Site Analytics
          </h1>
          <p className="mt-2 text-sm text-stone/60">
            Traffic and lead trends across the Kutumb Advisory website.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-navy/10 bg-white px-4 text-sm font-medium text-navy transition-colors duration-300 hover:bg-cream/50"
        >
          <Download size={15} />
          Export to Excel
        </button>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Leads" value={totalLeads} delay={0.02} />
        <StatTile label="Newsletter Subscribers" value={totalSubscribers} delay={0.06} />
        <StatTile label="Registered Customers" value={totalCustomers} delay={0.1} />
        <StatTile
          label="Assessments Completed"
          value={`${completedAssessments} / ${inProgressAssessments} in progress`}
          delay={0.14}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Page Views" subtitle="Last 14 days" delay={0.05}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pageViewsData} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,27,98,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: STONE }}
                axisLine={{ stroke: "rgba(32,27,98,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: STONE }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="views"
                stroke={NAVY}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: GOLD }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leads Over Time" subtitle="Last 14 days" delay={0.1}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadsOverTimeData} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,27,98,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: STONE }}
                axisLine={{ stroke: "rgba(32,27,98,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: STONE }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="leads"
                stroke={GOLD}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: NAVY }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Pages" subtitle="By views, last 14 days" delay={0.15}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topPagesData}
              layout="vertical"
              margin={{ left: 12, right: 16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(32,27,98,0.06)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: STONE }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="page"
                type="category"
                tick={{ fontSize: 11, fill: NAVY }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="views" fill={GOLD_LIGHT} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Traffic Sources"
          subtitle="Share of page views, last 14 days"
          delay={0.2}
        >
          <div className="flex h-full items-center gap-6">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSourcesData}
                  dataKey="value"
                  nameKey="source"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {trafficSourcesData.map((entry, i) => (
                    <Cell key={entry.source} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {trafficSourcesData.map((entry, i) => (
                <div key={entry.source} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: pieColors[i % pieColors.length] }}
                  />
                  <span className="text-xs text-stone/70">
                    {entry.source}
                  </span>
                  <span className="text-xs font-medium text-navy">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
