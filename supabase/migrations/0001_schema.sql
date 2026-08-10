-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  KUTUMB ADVISORY — DATABASE SCHEMA (FILE 1/2: SCHEMA)              ║
-- ║  Single-file, idempotent setup for the entire platform.           ║
-- ║  Run this in Supabase SQL Editor to reset database schema.        ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ═══════════════════════════════════════════════════════════════════
-- 1. EXTENSIONS & CLEANUP
-- ═══════════════════════════════════════════════════════════════════
create extension if not exists pgcrypto;

drop table if exists public.payments          cascade;
drop table if exists public.page_views        cascade;
drop table if exists public.newsletter_sends  cascade;
drop table if exists public.assessment_results cascade;
drop table if exists public.assessment_answers cascade;
drop table if exists public.family_profiles   cascade;
drop table if exists public.customers         cascade;
drop table if exists public.site_settings     cascade;
drop table if exists public.announcements    cascade;
drop table if exists public.testimonials      cascade;
drop table if exists public.faqs              cascade;
drop table if exists public.team_members      cascade;
drop table if exists public.articles          cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.leads             cascade;
drop table if exists public.admin_users       cascade;

drop function if exists public.encrypt_pii(text, text);
drop function if exists public.decrypt_pii(bytea, text);

-- ═══════════════════════════════════════════════════════════════════
-- 2. ADMIN & AUTHENTICATION
-- ═══════════════════════════════════════════════════════════════════
create table public.admin_users (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  role       text        not null default 'admin',
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- 3. CMS — ANNOUNCEMENT BANNERS, TESTIMONIALS, FAQS, TEAM
-- ═══════════════════════════════════════════════════════════════════
create table public.announcements (
  id           uuid        primary key default gen_random_uuid(),
  message      text        not null,
  link_text    text,
  link_url     text,
  bg_color     text        not null default 'bg-navy',
  text_color   text        not null default 'text-gold',
  is_active    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.testimonials (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  location     text        not null,
  role         text        not null,
  quote        text        not null,
  avatar_url   text,
  rating       integer     not null default 5,
  is_featured  boolean     not null default true,
  display_order integer    not null default 0,
  created_at   timestamptz not null default now()
);

create table public.faqs (
  id           uuid        primary key default gen_random_uuid(),
  category     text        not null default 'General',
  question     text        not null,
  answer       text        not null,
  display_order integer    not null default 0,
  is_published boolean     not null default true,
  created_at   timestamptz not null default now()
);

create table public.team_members (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  role         text        not null,
  bio          text        not null,
  image_url    text        not null,
  linkedin_url text,
  is_founder   boolean     not null default false,
  display_order integer    not null default 0,
  created_at   timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- 4. PUBLIC CONTENT — LEADS, NEWSLETTER, ARTICLES
-- ═══════════════════════════════════════════════════════════════════
create table public.leads (
  id                  uuid        primary key default gen_random_uuid(),
  full_name           text        not null,
  email               text        not null,
  phone               text        not null,
  city                text        not null,
  preferred_contact   text        not null default 'call',
  preferred_time      text        not null default 'morning',
  service_interest    text        not null default 'financial_kundali',
  family_situation    text,
  notes               text,
  raw_pii_data        jsonb,
  status              text        not null default 'new',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id           uuid        primary key default gen_random_uuid(),
  email        text        not null unique,
  source       text        not null default 'footer',
  status       text        not null default 'subscribed',
  created_at   timestamptz not null default now()
);

create table public.articles (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        not null unique,
  content      text        not null,
  excerpt      text        not null,
  category     text        not null default 'General',
  image_url    text,
  read_time    text        not null default '5 min read',
  author       text        not null default 'Kutumb Advisory',
  published    boolean     not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.site_settings (
  id           uuid        primary key default gen_random_uuid(),
  key          text        not null unique,
  value        jsonb       not null,
  updated_at   timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- 5. MYKUNDALI — CUSTOMERS, PROFILES, ASSESSMENT & PAYMENTS
-- ═══════════════════════════════════════════════════════════════════
create table public.customers (
  id           uuid        primary key references auth.users(id) on delete cascade,
  email        text        not null unique,
  full_name    text        not null,
  phone        text,
  created_at   timestamptz not null default now()
);

create table public.family_profiles (
  id                  uuid        primary key default gen_random_uuid(),
  customer_id         uuid        not null unique references public.customers(id) on delete cascade,
  primary_member      jsonb       not null,
  spouse              jsonb,
  children            jsonb,
  monthly_expenses    numeric,
  total_assets        numeric,
  total_liabilities   numeric,
  risk_profile        text,
  goals               text[],
  existing_investments jsonb,
  existing_insurance  jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.assessment_answers (
  id           uuid        primary key default gen_random_uuid(),
  customer_id  uuid        not null references public.customers(id) on delete cascade,
  graha_id     text        not null,
  answers      jsonb       not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (customer_id, graha_id)
);

create table public.assessment_results (
  id              uuid        primary key default gen_random_uuid(),
  customer_id     uuid        not null unique references public.customers(id) on delete cascade,
  graha_scores    jsonb       not null,
  graha_details   jsonb,
  overall_score   integer     not null,
  overall_status  text        not null,
  strongest_graha text,
  weakest_graha   text,
  recommendations text[],
  advisor_notes   text,
  action_plan     jsonb,
  pdf_url         text,
  unlocked        boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.newsletter_sends (
  id             uuid        primary key default gen_random_uuid(),
  subject        text        not null,
  content        text        not null,
  recipient_count integer    not null default 0,
  sent_by        uuid        references auth.users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create table public.page_views (
  id           uuid        primary key default gen_random_uuid(),
  path         text        not null,
  user_agent   text,
  referrer     text,
  created_at   timestamptz not null default now()
);

create table public.payments (
  id                 uuid        primary key default gen_random_uuid(),
  customer_id        uuid        not null references public.customers(id) on delete cascade,
  razorpay_order_id  text        not null unique,
  razorpay_payment_id text,
  amount             numeric     not null,
  currency           text        not null default 'INR',
  status             text        not null default 'created',
  paid_at            timestamptz,
  created_at         timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ═══════════════════════════════════════════════════════════════════
alter table public.admin_users            enable row level security;
alter table public.announcements          enable row level security;
alter table public.testimonials            enable row level security;
alter table public.faqs                    enable row level security;
alter table public.team_members            enable row level security;
alter table public.leads                   enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.articles                enable row level security;
alter table public.site_settings           enable row level security;
alter table public.customers               enable row level security;
alter table public.family_profiles         enable row level security;
alter table public.assessment_answers      enable row level security;
alter table public.assessment_results      enable row level security;
alter table public.newsletter_sends        enable row level security;
alter table public.page_views              enable row level security;
alter table public.payments                enable row level security;

-- Admin Users
create policy "Admins can view admin_users" on public.admin_users for select using (true);

-- Public Content (Read-Only Public, Write Admin)
create policy "Public read active announcements" on public.announcements for select using (true);
create policy "Admins manage announcements" on public.announcements for all using (auth.uid() in (select id from public.admin_users));

create policy "Public read testimonials" on public.testimonials for select using (true);
create policy "Admins manage testimonials" on public.testimonials for all using (auth.uid() in (select id from public.admin_users));

create policy "Public read faqs" on public.faqs for select using (true);
create policy "Admins manage faqs" on public.faqs for all using (auth.uid() in (select id from public.admin_users));

create policy "Public read team_members" on public.team_members for select using (true);
create policy "Admins manage team_members" on public.team_members for all using (auth.uid() in (select id from public.admin_users));

create policy "Public insert leads" on public.leads for insert with check (true);
create policy "Admins manage leads" on public.leads for all using (auth.uid() in (select id from public.admin_users));

create policy "Public insert newsletter" on public.newsletter_subscribers for insert with check (true);
create policy "Admins manage newsletter" on public.newsletter_subscribers for all using (auth.uid() in (select id from public.admin_users));

create policy "Public read published articles" on public.articles for select using (published = true or auth.uid() in (select id from public.admin_users));
create policy "Admins manage articles" on public.articles for all using (auth.uid() in (select id from public.admin_users));

create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Admins manage site_settings" on public.site_settings for all using (auth.uid() in (select id from public.admin_users));

-- Customer Data (Owner Access + Admin Management)
create policy "Customers view own profile" on public.customers for select using (auth.uid() = id or auth.uid() in (select id from public.admin_users));
create policy "Customers update own profile" on public.customers for update using (auth.uid() = id);

create policy "Customers manage own family_profile" on public.family_profiles for all using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));
create policy "Customers manage own assessment_answers" on public.assessment_answers for all using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));
create policy "Customers manage own assessment_results" on public.assessment_results for all using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));

create policy "Admins manage newsletter_sends" on public.newsletter_sends for all using (auth.uid() in (select id from public.admin_users));
create policy "Public insert page_views" on public.page_views for insert with check (true);
create policy "Admins view page_views" on public.page_views for select using (auth.uid() in (select id from public.admin_users));

create policy "Customers view own payments" on public.payments for select using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));
create policy "Admins manage payments" on public.payments for all using (auth.uid() in (select id from public.admin_users));

-- ═══════════════════════════════════════════════════════════════════
-- 7. ENCRYPTION HELPERS
-- ═══════════════════════════════════════════════════════════════════
create or replace function public.encrypt_pii(val text, secret text)
returns bytea as $$
begin
  return pgp_sym_encrypt(val, secret);
end;
$$ language plpgsql immutable security definer;

create or replace function public.decrypt_pii(val bytea, secret text)
returns text as $$
begin
  return pgp_sym_decrypt(val, secret);
end;
$$ language plpgsql immutable security definer;
