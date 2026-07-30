"use client";

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
import {
  pageViewsData,
  topPagesData,
  leadsOverTimeData,
  trafficSourcesData,
} from "@/lib/admin-mock-data";
import { AlertIcon } from "@/components/icons/admin";

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

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(168,121,31,0.15)",
  boxShadow: "0 8px 24px rgba(32,27,98,0.08)",
  fontSize: 12,
};

export default function AdminAnalyticsPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
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
        <div className="flex items-center gap-2 rounded-xl bg-gold/10 px-4 py-3 text-xs font-medium text-gold-dark">
          <AlertIcon size={16} className="shrink-0" />
          <span>
            Sample data — connect Vercel Analytics or Google Analytics to see
            real numbers.
          </span>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Page Views"
          subtitle="Last 14 days"
          delay={0.05}
        >
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

        <ChartCard title="Top Pages" subtitle="By total views" delay={0.15}>
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
          subtitle="Share of total sessions"
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
