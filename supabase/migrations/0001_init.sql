-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  KUTUMB ADVISORY — COMPLETE DATABASE SCHEMA                       ║
-- ║  Single-file, idempotent setup for the entire platform.           ║
-- ║  Run this in the Supabase SQL editor to create a fresh database.  ║
-- ║                                                                    ║
-- ║  Sections:                                                        ║
-- ║    1. Extensions & Cleanup                                        ║
-- ║    2. Admin & Authentication                                      ║
-- ║    3. Website — Public Content (Leads, Newsletter, Articles)      ║
-- ║    4. Website — Site Configuration                                ║
-- ║    5. MyKundali — Customer Accounts                               ║
-- ║    6. MyKundali — Family Profiles & Assessment                    ║
-- ║    7. MyKundali — Payments (Razorpay)                             ║
-- ║    8. Analytics — Page Views                                      ║
-- ║    9. Newsletter Send History                                     ║
-- ║   10. Row Level Security (RLS) — All Tables                       ║
-- ║   11. Indexes for Performance                                     ║
-- ║   12. Encryption Helpers & Seed Data                              ║
-- ╚══════════════════════════════════════════════════════════════════════╝


-- ═══════════════════════════════════════════════════════════════════
-- 1. EXTENSIONS & CLEANUP
-- ═══════════════════════════════════════════════════════════════════

-- pgcrypto: used for gen_random_uuid() and pgp_sym_encrypt/decrypt
-- for column-level encryption of sensitive PII data.
create extension if not exists pgcrypto;

-- Drop all tables in reverse dependency order (cascade handles FKs)
drop table if exists public.payments          cascade;
drop table if exists public.page_views        cascade;
drop table if exists public.newsletter_sends  cascade;
drop table if exists public.assessment_results cascade;
drop table if exists public.assessment_answers cascade;
drop table if exists public.family_profiles   cascade;
drop table if exists public.customers         cascade;
drop table if exists public.site_settings     cascade;
drop table if exists public.articles          cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.leads             cascade;
drop table if exists public.admin_users       cascade;

-- Drop old helper functions if they exist
drop function if exists public.encrypt_pii(text, text);
drop function if exists public.decrypt_pii(bytea, text);


-- ═══════════════════════════════════════════════════════════════════
-- 2. ADMIN & AUTHENTICATION
-- ═══════════════════════════════════════════════════════════════════

-- Admin users: internal staff who can log into /admin.
-- Linked to Supabase Auth via FK on auth.users(id).
create table public.admin_users (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  role       text        not null default 'admin',
  created_at timestamptz not null default now()
);

comment on table  public.admin_users is 'Internal admin/advisor accounts linked to Supabase Auth.';
comment on column public.admin_users.role is 'Role label — currently only "admin" is used.';


-- ═══════════════════════════════════════════════════════════════════
-- 3. WEBSITE — PUBLIC CONTENT
-- ═══════════════════════════════════════════════════════════════════

-- 3a. Leads: Contact form submissions from website visitors.
create table public.leads (
  id                uuid        primary key default gen_random_uuid(),
  full_name         text        not null,
  email             text        not null,
  phone             text        not null,
  city              text,
  occupation        text,
  age_group         text,
  contact_as        text,
  primary_goal      text,
  preferred_meeting text,
  preferred_date    date,
  preferred_time    time,
  notes             text,
  status            text        not null default 'new'
                    check (status in ('new','contacted','scheduled','closed')),
  submitted_at      timestamptz not null default now()
);

comment on table public.leads is 'Contact form submissions.';

-- 3b. Newsletter subscribers
create table public.newsletter_subscribers (
  id            uuid        primary key default gen_random_uuid(),
  email         text        not null unique,
  subscribed_at timestamptz not null default now()
);

comment on table public.newsletter_subscribers is 'Email addresses for the journal newsletter.';


-- 3c. Journal articles (blog CMS)
create table public.articles (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  cover_image  text,
  category     text        not null,
  author       text        not null default 'Kutumb Advisory',
  excerpt      text        not null,
  content      text        not null default '',
  read_time    text,
  article_date date        not null default current_date,
  featured     boolean     not null default false,
  published    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.articles is 'Blog/journal articles managed via the admin CMS.';


-- ═══════════════════════════════════════════════════════════════════
-- 4. WEBSITE — SITE CONFIGURATION
-- ═══════════════════════════════════════════════════════════════════

-- Singleton row (id=1) for global site settings.
create table public.site_settings (
  id               int         primary key default 1 check (id = 1),
  site_title       text        not null default 'Kutumb Advisory — Family Wealth Platform',
  meta_description text,
  favicon_url      text        default '/favicon.ico',
  logo_url         text,
  updated_at       timestamptz not null default now()
);

comment on table public.site_settings is 'Global site configuration. Always exactly one row (id=1).';


-- ═══════════════════════════════════════════════════════════════════
-- 5. MYKUNDALI — CUSTOMER ACCOUNTS
-- ═══════════════════════════════════════════════════════════════════

-- Customer accounts for the MyKundali (Financial Kundali) product.
-- Linked to Supabase Auth.
create table public.customers (
  id         uuid        primary key references auth.users(id) on delete cascade,
  full_name  text        not null,
  email      text        not null,
  phone      text,
  created_at timestamptz not null default now()
);

comment on table public.customers is 'MyKundali customer accounts.';


-- ═══════════════════════════════════════════════════════════════════
-- 6. MYKUNDALI — FAMILY PROFILES & ASSESSMENT
-- ═══════════════════════════════════════════════════════════════════

-- 6a. Family profile: demographics, financials, net worth worksheet.
--     The primary_member JSONB column also stores packed fields:
--     familyName, timeHorizon, netWorthWorksheet (assets/liabilities
--     breakdown) to avoid schema migrations.
create table public.family_profiles (
  customer_id          uuid    primary key references public.customers(id) on delete cascade,
  primary_member       jsonb   not null,
  spouse               jsonb,
  children             jsonb   not null default '[]',
  monthly_expenses     numeric,
  total_assets         numeric,
  total_liabilities    numeric,
  risk_profile         text    check (risk_profile in ('conservative','moderate','aggressive')),
  goals                text[]  default '{}',
  existing_investments jsonb   not null default '[]',
  existing_insurance   jsonb   not null default '[]',
  updated_at           timestamptz not null default now()
);

comment on table  public.family_profiles is 'Family demographic & financial data for the assessment wizard.';
comment on column public.family_profiles.primary_member is
  'JSONB: {name, age, relation, occupation, income, familyName, timeHorizon, netWorthWorksheet}.';
comment on column public.family_profiles.existing_investments is
  'JSONB array: [{type, amount}] — structured investment entries.';
comment on column public.family_profiles.existing_insurance is
  'JSONB array: [{type, sumInsured, premium, paymentMode}] — structured insurance entries.';


-- 6b. Individual graha answers: one row per question answered.
--     Supports upsert on (customer_id, graha_id, question_id).
create table public.assessment_answers (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references public.customers(id) on delete cascade,
  graha_id    text        not null
              check (graha_id in ('surya','chandra','mangal','budh','guru','shukra','shani','rahu','ketu')),
  question_id text        not null,
  value       jsonb       not null,
  answered_at timestamptz not null default now(),
  unique (customer_id, graha_id, question_id)
);

comment on table  public.assessment_answers is 'Per-question Yes/No answers for the 9-Graha assessment.';
comment on column public.assessment_answers.value is 'JSONB — typically "Yes" or "No" string.';


-- 6c. Computed assessment result: generated after answering all questions.
create table public.assessment_results (
  customer_id    uuid        primary key references public.customers(id) on delete cascade,
  overall_score  numeric     not null,
  overall_status text        not null
                 check (overall_status in ('excellent','good','fair','poor')),
  graha_scores   jsonb       not null,
  graha_details  jsonb       not null,
  recommendations text[]     default '{}',
  advisor_notes  text,
  action_plan    jsonb       not null default '[]',
  strongest_graha text,
  weakest_graha  text,
  completed_at   timestamptz not null default now()
);

comment on table  public.assessment_results is 'Computed Financial Kundali result per customer.';
comment on column public.assessment_results.overall_score is 'Sum of 9 graha scores, range 0–90.';
comment on column public.assessment_results.graha_scores is 'JSONB: {surya: 8, chandra: 6, ...} — per-graha 0–10.';
comment on column public.assessment_results.graha_details is 'JSONB: full GrahaDetail objects with observations, suggestions, progress.';
comment on column public.assessment_results.action_plan is 'JSONB array of ActionItem objects for the dashboard.';


-- ═══════════════════════════════════════════════════════════════════
-- 7. MYKUNDALI — PAYMENTS (RAZORPAY)
-- ═══════════════════════════════════════════════════════════════════

-- Razorpay payment records for the ₹999 Financial Kundali unlock.
-- Orders and verification are ONLY written server-side via service-role
-- Route Handlers (never directly by the client).
create table public.payments (
  id                  uuid        primary key default gen_random_uuid(),
  customer_id         uuid        not null references public.customers(id) on delete cascade,
  razorpay_order_id   text        not null unique,
  razorpay_payment_id text,
  amount              int         not null,
  status              text        not null default 'created'
                      check (status in ('created', 'paid', 'failed')),
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);

comment on table  public.payments is 'Razorpay payment records for MyKundali unlock.';
comment on column public.payments.amount is 'Amount in paise (e.g. 99900 = ₹999).';
comment on column public.payments.status is 'Lifecycle: created → paid | failed.';


-- ═══════════════════════════════════════════════════════════════════
-- 8. ANALYTICS — PAGE VIEWS
-- ═══════════════════════════════════════════════════════════════════

-- Lightweight self-hosted analytics beacon.
create table public.page_views (
  id        uuid        primary key default gen_random_uuid(),
  path      text        not null,
  referrer  text,
  viewed_at timestamptz not null default now()
);

comment on table public.page_views is 'Self-hosted page view tracking for admin analytics.';


-- ═══════════════════════════════════════════════════════════════════
-- 9. NEWSLETTER SEND HISTORY
-- ═══════════════════════════════════════════════════════════════════

-- Audit trail for newsletter campaigns sent via Resend.
create table public.newsletter_sends (
  id              uuid        primary key default gen_random_uuid(),
  subject         text        not null,
  body            text        not null,
  sent_at         timestamptz not null default now(),
  sent_by         uuid        references public.admin_users(id),
  recipient_count int         not null default 0
);

comment on table public.newsletter_sends is 'Audit trail for newsletter emails sent via Resend.';


-- ═══════════════════════════════════════════════════════════════════
-- 10. ROW LEVEL SECURITY (RLS) — ALL TABLES
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS on every table
alter table public.admin_users            enable row level security;
alter table public.leads                  enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.articles               enable row level security;
alter table public.site_settings          enable row level security;
alter table public.customers              enable row level security;
alter table public.family_profiles        enable row level security;
alter table public.assessment_answers     enable row level security;
alter table public.assessment_results     enable row level security;
alter table public.payments               enable row level security;
alter table public.page_views             enable row level security;
alter table public.newsletter_sends       enable row level security;


-- ─── 10a. Public (anonymous) policies ─────────────────────────────

-- Anyone can submit a contact form
create policy "anon_insert_leads"
  on public.leads for insert to anon
  with check (true);

-- Anyone can subscribe to the newsletter
create policy "anon_insert_subscribers"
  on public.newsletter_subscribers for insert to anon
  with check (true);

-- Anyone can read published articles
create policy "anon_read_published_articles"
  on public.articles for select to anon
  using (published = true);

-- Anyone can read site settings
create policy "anon_read_settings"
  on public.site_settings for select to anon
  using (true);

-- Anyone (anon or authenticated) can log a page view
create policy "anyone_insert_page_views"
  on public.page_views for insert to anon, authenticated
  with check (true);


-- ─── 10b. Admin policies (full access via admin_users membership) ──

create policy "admins_full_leads"
  on public.leads for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

create policy "admins_full_subscribers"
  on public.newsletter_subscribers for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

create policy "admins_full_articles"
  on public.articles for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

create policy "admins_full_settings"
  on public.site_settings for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admin users can read their own row (avoids self-reference recursion)
create policy "admins_read_own_row"
  on public.admin_users for select to authenticated
  using (id = auth.uid());

create policy "admins_full_newsletter_sends"
  on public.newsletter_sends for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins can read all page views for analytics
create policy "admins_read_page_views"
  on public.page_views for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins can read customer accounts (support/analytics)
create policy "admins_read_customers"
  on public.customers for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins can read raw assessment answers
create policy "admins_read_answers"
  on public.assessment_answers for select to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins have FULL access to family profiles & results (advisor edits)
create policy "admins_full_family_profiles"
  on public.family_profiles for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

create policy "admins_full_assessment_results"
  on public.assessment_results for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

create policy "admins_full_payments"
  on public.payments for all to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));


-- ─── 10c. Customer policies (own data only) ───────────────────────

-- Customers can read their own account row
create policy "customers_read_own_row"
  on public.customers for select to authenticated
  using (id = auth.uid());

-- Customers can insert their own account row (signup)
create policy "customers_insert_own_row"
  on public.customers for insert to authenticated
  with check (id = auth.uid());

-- Customers can manage (CRUD) their own family profile
create policy "customers_manage_own_profile"
  on public.family_profiles for all to authenticated
  using (customer_id = auth.uid());

-- Customers can manage their own assessment answers
create policy "customers_manage_own_answers"
  on public.assessment_answers for all to authenticated
  using (customer_id = auth.uid());

-- Customers can manage their own assessment results
-- (the loading page upserts the computed result)
create policy "customers_manage_own_results"
  on public.assessment_results for all to authenticated
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Customers can only READ their own payment status
-- (orders/verification are written server-side via service role)
create policy "customers_read_own_payments"
  on public.payments for select to authenticated
  using (customer_id = auth.uid());


-- ═══════════════════════════════════════════════════════════════════
-- 11. INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════

-- Leads: filter by status, sort by submission time
create index idx_leads_status       on public.leads (status);
create index idx_leads_submitted_at on public.leads (submitted_at desc);

-- Articles: lookup by slug, filter by published, sort by date
create index idx_articles_slug      on public.articles (slug);
create index idx_articles_published on public.articles (published) where published = true;
create index idx_articles_date      on public.articles (article_date desc);

-- Assessment answers: lookup by customer + graha
create index idx_answers_customer   on public.assessment_answers (customer_id);
create index idx_answers_graha      on public.assessment_answers (customer_id, graha_id);

-- Page views: time-range queries for analytics
create index idx_page_views_time    on public.page_views (viewed_at desc);

-- Payments: lookup by customer + status
create index idx_payments_customer  on public.payments (customer_id);
create index idx_payments_status    on public.payments (customer_id, status);
create index idx_payments_order     on public.payments (razorpay_order_id);

-- Customers: sort by creation date
create index idx_customers_created  on public.customers (created_at desc);


-- Automatically create a customer record in public.customers whenever a new Auth user is created
create or replace function public.handle_new_customer()
returns trigger as $$
begin
  insert into public.customers (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_customer();

-- Insert the singleton site settings row
insert into public.site_settings (id) values (1);

-- Encrypt a text value (call from app with your PII key)
create or replace function public.encrypt_pii(val text, secret text)
returns bytea as $$
begin
  return pgp_sym_encrypt(val, secret);
end;
$$ language plpgsql immutable security definer;

-- Decrypt a bytea value back to text
create or replace function public.decrypt_pii(val bytea, secret text)
returns text as $$
begin
  return pgp_sym_decrypt(val, secret);
end;
$$ language plpgsql immutable security definer;

comment on function public.encrypt_pii is 'AES-256 encrypt a text value using pgp_sym_encrypt.';
comment on function public.decrypt_pii is 'Decrypt a pgp_sym_encrypt-ed bytea value back to text.';


-- ═══════════════════════════════════════════════════════════════════
-- POST-SETUP INSTRUCTIONS
-- ═══════════════════════════════════════════════════════════════════
--
-- 1. Create your admin account via the Supabase Auth dashboard
--    (or sign up through the app, then promote it here).
--
-- 2. Insert that user's id into admin_users:
--      INSERT INTO public.admin_users (id, email)
--      VALUES ('<auth-user-uuid>', 'you@example.com');
--
-- 3. Set the SUPABASE_PII_KEY environment variable in your .env.local
--    to a strong random string (32+ chars). This key is used to
--    encrypt/decrypt PII columns (leads.full_name, customers.email, etc.)
--
-- 4. Update your app code to use encrypt_pii() on INSERT and
--    decrypt_pii() on SELECT for PII columns (leads & customers tables).
--
-- ═══════════════════════════════════════════════════════════════════
