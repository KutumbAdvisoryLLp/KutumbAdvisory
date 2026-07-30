-- Kutumb Advisory — initial schema
-- Run this in the Supabase SQL editor for your project.
-- Safe to re-run: every object is dropped first if it already exists.

-- ── Drop existing objects (reverse-ish dependency order; cascade handles the rest) ──
drop table if exists public.payments cascade;
drop table if exists public.page_views cascade;
drop table if exists public.newsletter_sends cascade;
drop table if exists public.assessment_results cascade;
drop table if exists public.assessment_answers cascade;
drop table if exists public.family_profiles cascade;
drop table if exists public.customers cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.articles cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.leads cascade;
drop table if exists public.admin_users cascade;

-- ── Admin users (internal staff who can log into /admin) ──
create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ── Leads (contact form submissions) ──
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  city text,
  occupation text,
  age_group text,
  contact_as text,
  primary_goal text,
  preferred_meeting text,
  preferred_date date,
  preferred_time time,
  notes text,
  status text not null default 'new' check (status in ('new','contacted','scheduled','closed')),
  submitted_at timestamptz not null default now()
);

-- ── Newsletter subscribers ──
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

-- ── Journal articles ──
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  cover_image text,
  category text not null,
  author text not null default 'Kutumb Advisory',
  excerpt text not null,
  content text not null default '',
  read_time text,
  article_date date not null default current_date,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Site settings — singleton row ──
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_title text not null default 'Kutumb Advisory — Family Wealth Platform',
  meta_description text,
  favicon_url text default '/favicon.ico',
  logo_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1);

-- ── Customer accounts (mykundali login — separate from admin_users) ──
create table public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- ── Family profile ──
create table public.family_profiles (
  customer_id uuid primary key references public.customers(id) on delete cascade,
  primary_member jsonb not null,
  spouse jsonb,
  children jsonb not null default '[]',
  monthly_expenses numeric,
  total_assets numeric,
  total_liabilities numeric,
  risk_profile text check (risk_profile in ('conservative','moderate','aggressive')),
  goals text[] default '{}',
  existing_investments text[] default '{}',
  existing_insurance text[] default '{}',
  updated_at timestamptz not null default now()
);

-- ── Individual graha answers ──
create table public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  graha_id text not null check (graha_id in ('surya','chandra','mangal','budh','guru','shukra','shani','rahu','ketu')),
  question_id text not null,
  value jsonb not null,
  answered_at timestamptz not null default now(),
  unique (customer_id, graha_id, question_id)
);

-- ── Completed assessment result ──
create table public.assessment_results (
  customer_id uuid primary key references public.customers(id) on delete cascade,
  overall_score numeric not null,
  overall_status text not null check (overall_status in ('excellent','good','fair','poor')),
  graha_scores jsonb not null,
  graha_details jsonb not null,
  recommendations text[] default '{}',
  advisor_notes text,
  action_plan jsonb not null default '[]',
  strongest_graha text,
  weakest_graha text,
  completed_at timestamptz not null default now()
);

-- ── Newsletter send history (audit trail for Resend campaigns) ──
create table public.newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  sent_at timestamptz not null default now(),
  sent_by uuid references public.admin_users(id),
  recipient_count int not null default 0
);

-- ── Page views (self-hosted analytics beacon, logged by every public page) ──
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  viewed_at timestamptz not null default now()
);

-- ── Razorpay payments (₹999 Financial Kundali unlock) — orders/verification
-- are only ever written by the service-role Route Handlers under
-- src/app/api/mykundali/payment/*, never directly by the client.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  amount int not null,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- ── Row Level Security ──
alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.customers enable row level security;
alter table public.family_profiles enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.assessment_results enable row level security;
alter table public.newsletter_sends enable row level security;
alter table public.page_views enable row level security;
alter table public.payments enable row level security;

-- Public (anon) can insert leads/subscribers, nothing else
drop policy if exists "anon insert leads" on public.leads;
create policy "anon insert leads" on public.leads for insert to anon with check (true);
drop policy if exists "anon insert subscribers" on public.newsletter_subscribers;
create policy "anon insert subscribers" on public.newsletter_subscribers for insert to anon with check (true);
drop policy if exists "anon read published articles" on public.articles;
create policy "anon read published articles" on public.articles for select to anon using (published = true);
drop policy if exists "anon read settings" on public.site_settings;
create policy "anon read settings" on public.site_settings for select to anon using (true);

-- Anyone (anon or logged-in) can log a page view; only admins can read them
drop policy if exists "anyone insert page views" on public.page_views;
create policy "anyone insert page views" on public.page_views for insert to anon, authenticated with check (true);
drop policy if exists "admins read page views" on public.page_views;
create policy "admins read page views" on public.page_views for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins (via admin_users membership) get full access to admin-facing tables
drop policy if exists "admins full access leads" on public.leads;
create policy "admins full access leads" on public.leads for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins full access subscribers" on public.newsletter_subscribers;
create policy "admins full access subscribers" on public.newsletter_subscribers for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins full access articles" on public.articles;
create policy "admins full access articles" on public.articles for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins full access settings" on public.site_settings;
create policy "admins full access settings" on public.site_settings for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
-- NOTE: this policy must NOT re-query admin_users (self-reference causes
-- "infinite recursion detected in policy for relation admin_users").
drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users" on public.admin_users for select to authenticated
  using (id = auth.uid());
drop policy if exists "admins full access newsletter_sends" on public.newsletter_sends;
create policy "admins full access newsletter_sends" on public.newsletter_sends for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins can read customer accounts + raw answers (support/analytics), and
-- have FULL (read/write) access to family_profiles / assessment_results so
-- an advisor can correct a client's profile or computed result.
drop policy if exists "admins read customers" on public.customers;
create policy "admins read customers" on public.customers for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins read assessment_answers" on public.assessment_answers;
create policy "admins read assessment_answers" on public.assessment_answers for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins full access family_profiles" on public.family_profiles;
create policy "admins full access family_profiles" on public.family_profiles for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins full access assessment_results" on public.assessment_results;
create policy "admins full access assessment_results" on public.assessment_results for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));
drop policy if exists "admins full access payments" on public.payments;
create policy "admins full access payments" on public.payments for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Customers can only read/write their OWN rows
drop policy if exists "customers manage own profile" on public.family_profiles;
create policy "customers manage own profile" on public.family_profiles for all to authenticated
  using (customer_id = auth.uid());
drop policy if exists "customers manage own answers" on public.assessment_answers;
create policy "customers manage own answers" on public.assessment_answers for all to authenticated
  using (customer_id = auth.uid());
-- "for all" (not just select) — the loading page upserts the computed
-- result here directly from the customer's own session.
drop policy if exists "customers read own results" on public.assessment_results;
drop policy if exists "customers manage own results" on public.assessment_results;
create policy "customers manage own results" on public.assessment_results for all to authenticated
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());
drop policy if exists "customers read own row" on public.customers;
create policy "customers read own row" on public.customers for select to authenticated
  using (id = auth.uid());
drop policy if exists "customers insert own row" on public.customers;
create policy "customers insert own row" on public.customers for insert to authenticated
  with check (id = auth.uid());
-- Customers can only READ their own payment status — orders/verification
-- are only ever written server-side via the service role (see payments API
-- routes), never directly by the client.
drop policy if exists "customers read own payments" on public.payments;
create policy "customers read own payments" on public.payments for select to authenticated
  using (customer_id = auth.uid());

-- ── After running this file ──
-- 1. Create your own admin account via Supabase Auth dashboard (or sign up
--    through the app once auth is wired, then promote it here).
-- 2. Insert that user's id into admin_users:
--      insert into public.admin_users (id, email) values ('<auth-user-uuid>', 'you@example.com');
