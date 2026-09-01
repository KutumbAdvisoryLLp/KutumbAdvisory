-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  KUTUMB ADVISORY — MASTER DATABASE SCHEMA                            ║
-- ║  One file, full reset: drops and recreates every table, then seeds  ║
-- ║  starter content. Run this once, whole file, in the Supabase SQL    ║
-- ║  Editor. This deletes ALL existing data — customers, leads, journal  ║
-- ║  articles, testimonials, everything.                                 ║
-- ╚══════════════════════════════════════════════════════════════════════╝
--
-- AFTER running this file:
--   Run `npm run create-admin` (uses ADMIN_EMAIL / ADMIN_PASSWORD from
--   .env.local). admin_users starts empty after a reset, and every admin
--   write (testimonials, FAQs, journal, banners, leads, ...) is blocked by
--   Row Level Security until a matching row exists there — this is the
--   #1 reason "admin can't save/create anything" after a fresh database.
--   Then sign in at /admin/login.

-- ═══════════════════════════════════════════════════════════════════
-- 1. EXTENSIONS & CLEANUP
-- ═══════════════════════════════════════════════════════════════════
create extension if not exists pgcrypto;

drop table if exists public.rate_limit_hits          cascade;
drop table if exists public.signup_otp_codes        cascade;
drop table if exists public.email_send_log          cascade;
drop table if exists public.testimonial_submissions cascade;
drop table if exists public.device_sessions         cascade;
drop table if exists public.payments               cascade;
drop table if exists public.page_views              cascade;
drop table if exists public.newsletter_sends        cascade;
drop table if exists public.assessment_results       cascade;
drop table if exists public.assessment_answers       cascade;
drop table if exists public.family_profiles          cascade;
drop table if exists public.customers                cascade;
drop table if exists public.site_settings            cascade;
drop table if exists public.announcements            cascade;
drop table if exists public.testimonials             cascade;
drop table if exists public.faqs                     cascade;
drop table if exists public.team_members             cascade;
drop table if exists public.articles                 cascade;
drop table if exists public.newsletter_subscribers   cascade;
drop table if exists public.leads                    cascade;
drop table if exists public.admin_users               cascade;

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
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  location      text        not null,
  role          text        not null,
  quote         text        not null,
  avatar_url    text,
  rating        integer     not null default 5,
  is_featured   boolean     not null default true,
  display_order integer     not null default 0,
  created_at    timestamptz not null default now()
);

create table public.faqs (
  id            uuid        primary key default gen_random_uuid(),
  category      text        not null default 'General',
  question      text        not null,
  answer        text        not null,
  display_order integer     not null default 0,
  is_published  boolean     not null default true,
  created_at    timestamptz not null default now()
);

create table public.team_members (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  role          text        not null,
  bio           text        not null,
  image_url     text        not null,
  linkedin_url  text,
  is_founder    boolean     not null default false,
  display_order integer     not null default 0,
  created_at    timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- 4. PUBLIC CONTENT — LEADS, NEWSLETTER, ARTICLES, SITE SETTINGS
-- ═══════════════════════════════════════════════════════════════════
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
  preferred_time    text,
  notes             text        check (notes is null or char_length(notes) <= 2000),
  status            text        not null default 'new',
  submitted_at      timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id            uuid        primary key default gen_random_uuid(),
  email         text        not null unique,
  source        text        not null default 'footer',
  status        text        not null default 'subscribed',
  subscribed_at timestamptz not null default now()
);

create table public.articles (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        not null unique,
  content      text        not null,
  excerpt      text        not null,
  category     text        not null default 'General',
  cover_image  text,
  read_time    text        not null default '5 min read',
  author       text        not null default 'Kutumb Advisory',
  featured     boolean     not null default false,
  published    boolean     not null default false,
  article_date timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.site_settings (
  id                          integer     primary key,
  site_title                  text        not null default 'Kutumb Advisory',
  meta_description            text,
  favicon_url                 text,
  logo_url                    text,
  financial_kundali_price_inr numeric,
  updated_at                  timestamptz not null default now()
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
  id                   uuid        primary key default gen_random_uuid(),
  customer_id          uuid        not null unique references public.customers(id) on delete cascade,
  primary_member       jsonb       not null,
  spouse               jsonb,
  children             jsonb,
  monthly_expenses     numeric,
  total_assets         numeric,
  total_liabilities    numeric,
  risk_profile         text,
  goals                text[],
  existing_investments jsonb,
  existing_insurance   jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- One row per (customer, graha, question) — not per graha. See
-- src/app/mykundali/assessment/grahas/page.tsx's upsert, which targets
-- exactly this composite key.
create table public.assessment_answers (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references public.customers(id) on delete cascade,
  graha_id    text        not null,
  question_id text        not null,
  value       jsonb       not null,
  answered_at timestamptz not null default now(),
  unique (customer_id, graha_id, question_id)
);

create table public.assessment_results (
  id              uuid        primary key default gen_random_uuid(),
  customer_id     uuid        not null unique references public.customers(id) on delete cascade,
  graha_scores    jsonb       not null,
  graha_details   jsonb,
  overall_score   numeric     not null,
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
  id              uuid        primary key default gen_random_uuid(),
  subject         text        not null,
  body            text        not null,
  recipient_count integer     not null default 0,
  sent_by         uuid        references auth.users(id) on delete set null,
  sent_at         timestamptz not null default now()
);

create table public.page_views (
  id         uuid        primary key default gen_random_uuid(),
  path       text        not null,
  user_agent text,
  referrer   text,
  viewed_at  timestamptz not null default now()
);

create table public.payments (
  id                  uuid        primary key default gen_random_uuid(),
  customer_id         uuid        not null references public.customers(id) on delete cascade,
  razorpay_order_id   text        not null unique,
  razorpay_payment_id text,
  amount              numeric     not null,
  currency            text        not null default 'INR',
  status              text        not null default 'created',
  source              text        not null default 'razorpay',
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

create table public.device_sessions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  user_type     text        not null check (user_type in ('admin','mykundali')),
  device_id     text        not null,
  device_label  text,
  last_seen_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (user_id, device_id)
);

create table public.testimonial_submissions (
  id            uuid        primary key default gen_random_uuid(),
  customer_id   uuid        references public.customers(id) on delete set null,
  name          text        not null check (char_length(name) <= 200),
  testimonial   text        not null check (char_length(testimonial) <= 2000),
  status        text        not null default 'new' check (status in ('new','featured','dismissed')),
  created_at    timestamptz not null default now()
);

create table public.email_send_log (
  id       uuid        primary key default gen_random_uuid(),
  count    integer     not null default 1,
  sent_at  timestamptz not null default now()
);

-- No RLS policies defined on purpose — only the service-role client ever
-- touches this table.
create table public.signup_otp_codes (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  otp_hash    text        not null,
  attempts    integer     not null default 0,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);
create index signup_otp_codes_expires_idx on public.signup_otp_codes (expires_at);

-- No RLS policies defined on purpose — only the service-role client ever
-- touches this table.
create table public.rate_limit_hits (
  id         uuid        primary key default gen_random_uuid(),
  key        text        not null,
  created_at timestamptz not null default now()
);
create index rate_limit_hits_key_created_idx on public.rate_limit_hits (key, created_at);

-- Who did what, when, from what device/IP. No insert policy on purpose —
-- every insert goes through service-role from server API routes.
create table public.admin_audit_log (
  id           uuid        primary key default gen_random_uuid(),
  admin_id     uuid        references auth.users(id) on delete set null,
  admin_email  text        not null,
  action       text        not null,
  target_type  text,
  target_id    text,
  details      jsonb,
  device_label text,
  ip_address   text,
  created_at   timestamptz not null default now()
);
create index admin_audit_log_created_idx on public.admin_audit_log (created_at desc);

-- Feature flags / kill switches. Only the flags that non-admin users
-- genuinely need to read client-side (maintenance mode, the testimonial
-- pause toggle) are publicly readable — pause_payments and
-- pause_new_signups are enforced server-side only and stay admin-only, so
-- anonymous visitors can't enumerate that operational state.
create table public.feature_flags (
  flag_key   text        primary key,
  enabled    boolean     not null default false,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Admin-editable email copy — seeded to match what's hardcoded in
-- src/lib/email.ts so existing emails are unaffected until an admin
-- actually edits something.
create table public.email_templates (
  template_key text        primary key,
  subject      text        not null,
  heading      text        not null,
  intro_text   text        not null,
  footer_text  text,
  updated_at   timestamptz not null default now()
);

-- Server error log, feeding the admin monitoring dashboard.
create table public.error_log (
  id          uuid        primary key default gen_random_uuid(),
  context     text        not null,
  message     text        not null,
  details     jsonb,
  customer_id uuid,
  created_at  timestamptz not null default now()
);
create index error_log_created_idx on public.error_log (created_at desc);

-- SECURITY DEFINER function so "is this uid an admin" can be checked from
-- within admin_users' own RLS policy without the self-reference causing
-- Postgres's "infinite recursion detected in policy" error — the function
-- runs as its owner, exempt from RLS on the table it queries, breaking the
-- cycle. This is the standard pattern for a self-referencing permissions
-- table.
create or replace function public.is_admin(check_uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where id = check_uid);
$$;

-- ═══════════════════════════════════════════════════════════════════
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ═══════════════════════════════════════════════════════════════════
alter table public.admin_users            enable row level security;
alter table public.announcements          enable row level security;
alter table public.testimonials           enable row level security;
alter table public.faqs                   enable row level security;
alter table public.team_members           enable row level security;
alter table public.leads                  enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.articles               enable row level security;
alter table public.site_settings          enable row level security;
alter table public.customers              enable row level security;
alter table public.family_profiles        enable row level security;
alter table public.assessment_answers     enable row level security;
alter table public.assessment_results     enable row level security;
alter table public.newsletter_sends       enable row level security;
alter table public.page_views             enable row level security;
alter table public.payments               enable row level security;
alter table public.device_sessions        enable row level security;
alter table public.testimonial_submissions enable row level security;
alter table public.email_send_log         enable row level security;
alter table public.signup_otp_codes       enable row level security;
alter table public.rate_limit_hits        enable row level security;
alter table public.admin_audit_log        enable row level security;
alter table public.feature_flags          enable row level security;
alter table public.email_templates        enable row level security;
alter table public.error_log              enable row level security;

create policy "Admins can view admin_users" on public.admin_users for select using (auth.uid() = id or public.is_admin(auth.uid()));

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

create policy "Customers view own profile" on public.customers for select using (auth.uid() = id or auth.uid() in (select id from public.admin_users));
create policy "Customers update own profile" on public.customers for update using (auth.uid() = id);
-- RLS restricts which rows; column-level grants restrict which columns —
-- a customer can update their own row but not, say, their own email
-- (which would desync from their real Supabase Auth login email).
-- NOTE: Postgres roles don't distinguish "admin" from "customer" within
-- `authenticated` — this grant applies to admins too. There's currently no
-- admin feature that updates other customer columns directly (all such
-- writes already go through service-role API routes), but if one is ever
-- built as a plain client-side table call, it will silently fail here and
-- needs to go through a service-role route instead.
revoke update on public.customers from authenticated;
grant update (full_name, phone) on public.customers to authenticated;

create policy "Customers manage own family_profile" on public.family_profiles for all using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));
create policy "Customers manage own assessment_answers" on public.assessment_answers for all using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));
create policy "Customers manage own assessment_results" on public.assessment_results for all using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));

create policy "Admins manage newsletter_sends" on public.newsletter_sends for all using (auth.uid() in (select id from public.admin_users));
create policy "Public insert page_views" on public.page_views for insert with check (true);
create policy "Admins view page_views" on public.page_views for select using (auth.uid() in (select id from public.admin_users));

create policy "Customers view own payments" on public.payments for select using (auth.uid() = customer_id or auth.uid() in (select id from public.admin_users));

create policy "Users manage own device sessions" on public.device_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Customers submit testimonials" on public.testimonial_submissions for insert with check (auth.uid() = customer_id);
create policy "Admins manage testimonial submissions" on public.testimonial_submissions for all using (auth.uid() in (select id from public.admin_users));

create policy "Admins view email_send_log" on public.email_send_log for select using (auth.uid() in (select id from public.admin_users));
create policy "Admins manage payments" on public.payments for all using (auth.uid() in (select id from public.admin_users));

create policy "Admins view audit log" on public.admin_audit_log for select using (public.is_admin(auth.uid()));

create policy "Public read maintenance flag" on public.feature_flags for select using (flag_key in ('maintenance_mode_customer_portal', 'pause_testimonial_submissions'));
create policy "Admins manage feature_flags" on public.feature_flags for all using (public.is_admin(auth.uid()));

create policy "Admins manage email_templates" on public.email_templates for all using (public.is_admin(auth.uid()));

create policy "Admins view error_log" on public.error_log for select using (public.is_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════════════
-- 7. ENCRYPTION HELPERS
-- (available for future use — nothing currently encrypts through these;
-- no column is bytea)
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

-- ═══════════════════════════════════════════════════════════════════
-- 8. SEED DATA
-- Starter content so the site and admin panel aren't empty. Every row
-- here is ordinary data — edit or delete it from the admin panel like
-- anything else.
-- ═══════════════════════════════════════════════════════════════════
insert into public.site_settings (id, site_title, meta_description)
values (1, 'Kutumb Advisory', 'Discover your Financial Kundali and bring clarity to your family''s financial universe.');

insert into public.feature_flags (flag_key, enabled) values
  ('maintenance_mode_customer_portal', false),
  ('pause_new_signups', false),
  ('pause_testimonial_submissions', false),
  ('pause_payments', false);

insert into public.email_templates (template_key, subject, heading, intro_text, footer_text) values
  ('welcome',
   'Welcome to Kutumb Advisory — Your Journey Begins ✦',
   'Welcome to Kutumb Advisory, {{first_name}} 🙏',
   'We''re honoured to have you take the first step towards understanding and strengthening your family''s financial health.',
   'With warmth,<br/>The Kutumb Advisory Team'),
  ('signup_otp',
   '{{otp}} is your Kutumb Advisory verification code',
   'Verify Your Email',
   'Use the 6-digit verification code below to complete your Kutumb Advisory account signup.',
   'If you did not request this, please ignore this email.'),
  ('password_reset_otp',
   '{{otp}} is your Kutumb Advisory password reset code',
   'Password Reset Request',
   'Use the 6-digit verification code below to reset your Kutumb Advisory account password.',
   'If you did not request a password reset, please ignore this email.'),
  ('payment_confirmation',
   'Payment Confirmed — Financial Kundali Unlocked ✓',
   'Payment Confirmed!',
   'Thank you, {{first_name}}. Your Financial Kundali is now unlocked.',
   null);

insert into public.announcements (message, link_text, link_url, bg_color, text_color, is_active)
values
  ('✦ Start your 9-Graha Financial Kundali assessment today & gain complete visibility over family wealth.', 'Explore Toolkit →', '/toolkit', 'bg-navy', 'text-gold', true);

insert into public.team_members (name, role, bio, image_url, linkedin_url, is_founder, display_order)
values
  ('Deepika', 'Founder & Principal Advisor', 'With over 12 years of experience in wealth management and private banking, Deepika founded Kutumb Advisory to bring structural clarity to Indian family finances. She specializes in 9-Graha wealth architecture, multi-generational trust design, and holistic risk management.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780300586/deepika-founder_u8eiuz.jpg', 'https://linkedin.com/in/deepika-kutumb', true, 1),
  ('Raunak', 'Technology & Digital', 'Social media strategy and technology operations keeping Kutumb''s client experience seamless and modern.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301027/raunak_ftpboc.png', null, false, 2),
  ('Tanishq', 'Client Relations', 'Ensuring every family receives attentive, responsive service from the first conversation through every milestone.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780394568/tanishq_i9einp.png', null, false, 3),
  ('Harsh', 'CRM & Operations', 'Managing client relationships and internal coordination so your experience with Kutumb is always coherent and reliable.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780394568/harsh_ftie7y.png', null, false, 4),
  ('Atri Ganguly', 'Compliance & Legal', '25+ years of senior management experience across portfolio management, financial planning, and risk management. Our families'' interests are legally protected at every step.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301670/attri_rcnc0p.png', null, false, 5),
  ('Tejpal Singh Bagga', 'Investments & Portfolio', 'Certified financial planner with 20+ years advising on mutual funds, SIFs, AIFs, and portfolio structuring for HNI families.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301742/tejpal_bzcxev.png', null, false, 6),
  ('Soumik Saha', 'Portfolio Management', 'CFP(CM) with 20+ years supporting financial advisory professionals and HNI investors across bonds, AIFs, ETFs, and structured products.', 'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301742/soumik_qfrcte.png', null, false, 7),
  ('Sarbani Sadhu Das', 'Insurance Specialist', 'Experienced sales and distribution professional focused on mediclaim, general insurance, and investor engagement across cross-functional mandates.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', null, false, 8);

insert into public.testimonials (name, location, role, quote, avatar_url, rating, is_featured, display_order)
values
  ('Vikram Mehta', 'Mumbai', 'Tech Entrepreneur & Business Owner', 'Financial Kundali completely transformed how my wife and I view our family wealth. We went from scattered investments across five platforms to a single, crystal-clear 9-graha dashboard.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', 5, true, 1),
  ('Priya & Suresh Kulkarni', 'Bengaluru', 'Senior Corporate Executives', 'The 90-Day Action Plan pinpointed our insurance gaps immediately. Working with Kutumb brought total financial peace to our multi-generational household.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 5, true, 2),
  ('Meera & Arun S.', 'Delhi', 'Entrepreneurs', 'We were with three different advisors before Kutumb. Now we have one complete view, one trusted relationship, and one plan that spans our entire family''s future.', null, 5, true, 3);

insert into public.faqs (category, question, answer, display_order, is_published)
values
  ('Financial Kundali', 'What is the Financial Kundali?', 'Financial Kundali is Kutumb Advisory''s proprietary 9-graha diagnostic model that evaluates every area of family wealth — from income stability and emergency coverage to retirement, investments, and legacy planning.', 1, true),
  ('Financial Kundali', 'How long does the assessment take?', 'The assessment takes approximately 10 to 15 minutes to complete online. You will receive an immediate score breakdown and action plan.', 2, true),
  ('Advisory Services', 'Does Kutumb sell financial products?', 'No. Kutumb Advisory is an independent fee-only family wealth advisory. We do not accept commissions, ensuring our recommendations are 100% unbiased.', 3, true),
  ('Data Security', 'Is my family data kept secure and private?', 'Yes. All sensitive information is handled confidentially and never shared with third parties.', 4, true);

insert into public.articles (title, slug, content, excerpt, category, author, published, article_date)
values
  ('The 9-Graha Architecture of Family Wealth', '9-graha-architecture-family-wealth', 'Wealth management in India has traditionally been transactional — buying an insurance policy here, opening a fixed deposit there. The 9-Graha framework unifies every dimension into a single interconnected structure.', 'Discover how evaluating your wealth across nine interconnected pillars brings complete clarity to multi-generational family finances.', 'Wealth Planning', 'Deepika', true, now()),
  ('Why Most Families Suffer from a Visibility Problem', 'visibility-problem-family-finances', 'Most Indian families do not suffer from a lack of assets. They suffer from scattered visibility — having multiple accounts, brokers, and advisors without a single source of truth.', 'How fragmented financial accounts create hidden risks and how to build a unified family balance sheet.', 'Financial Clarity', 'Rajesh Sharma', true, now());
