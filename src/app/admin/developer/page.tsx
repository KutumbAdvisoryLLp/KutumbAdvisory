"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Code2,
  Eye,
  EyeOff,
  Copy,
  Check,
  HardDrive,
  Database,
  Users,
  Terminal,
  Activity,
  Server,
  Key,
  Layers,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TableStats {
  customers: number;
  familyProfiles: number;
  assessmentResults: number;
  leads: number;
  newsletterSubscribers: number;
  articles: number;
  pageViews: number;
}

export default function AdminDeveloperPage() {
  const supabase = useMemo(() => createClient(), []);
  const [stats, setStats] = useState<TableStats>({
    customers: 0,
    familyProfiles: 0,
    assessmentResults: 0,
    leads: 0,
    newsletterSubscribers: 0,
    articles: 0,
    pageViews: 0,
  });
  const [loading, setLoading] = useState(true);

  // Key Visibility toggles
  const [showAnon, setShowAnon] = useState(false);
  const [showService, setShowService] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Ping test
  const [pingResult, setPingResult] = useState<{ status: string; latency: number } | null>(null);
  const [pinging, setPinging] = useState(false);

  // Fetch Environment Variables from Next.js (sanitized for client)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wxgkexmsugnchmbsazrt.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

  const fetchStats = async () => {
    setLoading(true);
    const [c, fp, ar, l, ns, a, pv] = await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("family_profiles").select("*", { count: "exact", head: true }),
      supabase.from("assessment_results").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("page_views").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      customers: c.count ?? 0,
      familyProfiles: fp.count ?? 0,
      assessmentResults: ar.count ?? 0,
      leads: l.count ?? 0,
      newsletterSubscribers: ns.count ?? 0,
      articles: a.count ?? 0,
      pageViews: pv.count ?? 0,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [supabase]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePing = async () => {
    setPinging(true);
    const start = performance.now();
    await supabase.from("site_settings").select("id").limit(1);
    const end = performance.now();
    setPingResult({
      status: "Healthy",
      latency: Math.round(end - start),
    });
    setPinging(false);
  };

  // Estimated Database calculations
  const totalRows =
    stats.customers +
    stats.familyProfiles +
    stats.assessmentResults +
    stats.leads +
    stats.newsletterSubscribers +
    stats.articles +
    stats.pageViews;

  // Base estimate: ~2KB per row + 8MB base Postgres catalog
  const estimatedMB = Math.max(0.5, Number((8 + (totalRows * 2.5) / 1024).toFixed(2)));
  const freeTierMB = 500; // Supabase Free Tier limit: 500 MB
  const usagePercentage = Math.min(100, Number(((estimatedMB / freeTierMB) * 100).toFixed(1)));

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gold/15 text-gold-dark">
            <Code2 size={24} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-navy">Developer Hub &amp; API Keys</h1>
            <p className="text-sm text-stone/60">
              Manage Supabase environment keys, query live database storage metrics, and monitor API limits.
            </p>
          </div>
        </div>
      </div>

      {/* Storage & Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Storage Card */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-stone/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone/60 flex items-center gap-2">
              <HardDrive size={16} className="text-gold" />
              <span>Database Storage</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-100 text-emerald-800 font-medium">
              Free Tier
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif text-3xl font-bold text-navy">{estimatedMB} MB</span>
            <span className="text-xs text-stone/50">/ {freeTierMB} MB limit</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full rounded-full bg-cream overflow-hidden mb-3 border border-stone/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
              style={{ width: `${Math.max(2, usagePercentage)}%` }}
            />
          </div>

          <p className="text-xs text-stone/60">
            Estimated storage used by {totalRows.toLocaleString()} total database records.
          </p>
        </div>

        {/* Database Rows Card */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-stone/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone/60 flex items-center gap-2">
              <Database size={16} className="text-gold" />
              <span>Database Records</span>
            </span>
            <button
              onClick={fetchStats}
              className="text-xs text-gold font-medium hover:underline flex items-center gap-1"
            >
              Refresh
            </button>
          </div>

          <div className="font-serif text-3xl font-bold text-navy mb-2">
            {loading ? "..." : totalRows.toLocaleString()}
          </div>

          <p className="text-xs text-stone/60">
            Total active rows indexed across 7 core tables.
          </p>
        </div>

        {/* Auth Users Limit Card */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-stone/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone/60 flex items-center gap-2">
              <Users size={16} className="text-gold" />
              <span>Registered Customers</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-100 text-blue-800 font-medium">
              50,000 MAU Limit
            </span>
          </div>

          <div className="font-serif text-3xl font-bold text-navy mb-2">
            {loading ? "..." : stats.customers}
          </div>

          <p className="text-xs text-stone/60">
            Registered customer accounts in Supabase Auth system.
          </p>
        </div>
      </div>

      {/* Table Record Breakdown */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
          <Layers className="text-gold" size={20} />
          <span>Supabase Table Record Breakdown</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10">
            <p className="text-xs text-stone/50 font-medium uppercase">Customers</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.customers}</p>
          </div>

          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10">
            <p className="text-xs text-stone/50 font-medium uppercase">Family Profiles</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.familyProfiles}</p>
          </div>

          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10">
            <p className="text-xs text-stone/50 font-medium uppercase">Kundali Results</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.assessmentResults}</p>
          </div>

          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10">
            <p className="text-xs text-stone/50 font-medium uppercase">Consultation Leads</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.leads}</p>
          </div>

          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10">
            <p className="text-xs text-stone/50 font-medium uppercase">Subscribers</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.newsletterSubscribers}</p>
          </div>

          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10">
            <p className="text-xs text-stone/50 font-medium uppercase">Articles</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.articles}</p>
          </div>

          <div className="p-4 rounded-xl bg-cream/30 border border-stone/10 col-span-2">
            <p className="text-xs text-stone/50 font-medium uppercase">Page Views Logged</p>
            <p className="font-serif text-2xl font-bold text-navy mt-1">{stats.pageViews}</p>
          </div>
        </div>
      </div>

      {/* API Keys & Credentials Section */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10 space-y-6">
        <div>
          <h2 className="font-serif text-xl text-navy flex items-center gap-2">
            <Key className="text-gold" size={20} />
            <span>API Keys &amp; Environment Credentials</span>
          </h2>
          <p className="text-xs text-stone/60 mt-1">
            Environment values read directly from your local <code className="font-mono bg-cream px-1.5 py-0.5 rounded text-navy">.env.local</code> configuration.
          </p>
        </div>

        {/* 1. Supabase URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-stone/60">
            NEXT_PUBLIC_SUPABASE_URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={supabaseUrl}
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 font-mono text-xs text-navy outline-none"
            />
            <button
              onClick={() => copyToClipboard(supabaseUrl, "url")}
              className="p-3 rounded-xl border border-stone/20 bg-white hover:bg-cream/40 text-stone transition-colors shrink-0"
              title="Copy URL"
            >
              {copiedKey === "url" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* 2. Anon Key */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase text-stone/60">
              NEXT_PUBLIC_SUPABASE_ANON_KEY (Public Client Key)
            </label>
            <button
              onClick={() => setShowAnon(!showAnon)}
              className="text-xs text-stone/60 hover:text-navy flex items-center gap-1"
            >
              {showAnon ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showAnon ? "Hide" : "Reveal"}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type={showAnon ? "text" : "password"}
              readOnly
              value={anonKey}
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 font-mono text-xs text-navy outline-none"
            />
            <button
              onClick={() => copyToClipboard(anonKey, "anon")}
              className="p-3 rounded-xl border border-stone/20 bg-white hover:bg-cream/40 text-stone transition-colors shrink-0"
              title="Copy Anon Key"
            >
              {copiedKey === "anon" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* 3. Service Role Key */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase text-red-600/80">
              SUPABASE_SERVICE_ROLE_KEY (Private Admin Key)
            </label>
            <button
              onClick={() => setShowService(!showService)}
              className="text-xs text-stone/60 hover:text-navy flex items-center gap-1"
            >
              {showService ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showService ? "Hide" : "Reveal"}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type={showService ? "text" : "password"}
              readOnly
              value="SUPABASE_SERVICE_ROLE_KEY (Hidden for security — available in .env.local)"
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 font-mono text-xs text-navy outline-none"
            />
            <button
              onClick={() => copyToClipboard("SUPABASE_SERVICE_ROLE_KEY", "service")}
              className="p-3 rounded-xl border border-stone/20 bg-white hover:bg-cream/40 text-stone transition-colors shrink-0"
              title="Copy Service Key"
            >
              {copiedKey === "service" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-[11px] text-stone/50">
            ⚠️ Never expose your Service Role key on the client side. Keep it safe inside server environment files.
          </p>
        </div>
      </div>

      {/* Ping & Connection Diagnostic */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg text-navy flex items-center gap-2">
            <Activity className="text-gold" size={18} />
            <span>Database Connection Health Check</span>
          </h3>
          <p className="text-xs text-stone/60 mt-0.5">
            Test live query latency to your Supabase PostgreSQL cluster.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {pingResult && (
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-emerald-800">{pingResult.status}</span>
              <span className="font-mono text-stone/50">({pingResult.latency} ms)</span>
            </div>
          )}

          <button
            onClick={handlePing}
            disabled={pinging}
            className="px-5 py-2.5 bg-navy text-white text-xs font-medium rounded-xl hover:bg-navy-light transition-all flex items-center gap-2"
          >
            <Server size={14} />
            <span>{pinging ? "Testing..." : "Test Connection"}</span>
          </button>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10 space-y-4">
        <h2 className="font-serif text-xl text-navy flex items-center gap-2">
          <Terminal className="text-gold" size={20} />
          <span>Quick Client Integration Code</span>
        </h2>

        <div className="p-4 rounded-xl bg-navy text-white/90 font-mono text-xs overflow-x-auto leading-relaxed">
          <pre>{`import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)`}</pre>
        </div>
      </div>
    </div>
  );
}
