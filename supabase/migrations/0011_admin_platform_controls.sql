-- Purely additive — new tables, or new nullable/defaulted columns on
-- existing tables. Nothing is dropped and no existing data is touched.
-- Safe to run standalone against the live database.

-- ═══════════════════════════════════════════════════════════════════
-- 1. Admin audit log — who did what, when, from what device/IP.
--    No insert policy on purpose: every insert goes through service-role
--    from server API routes, never directly from the browser.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.admin_audit_log (
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
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
alter table public.admin_audit_log enable row level security;
drop policy if exists "Admins view audit log" on public.admin_audit_log;
create policy "Admins view audit log" on public.admin_audit_log
  for select using (public.is_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════════════
-- 2. Feature flags / kill switches. Only the flags that non-admin users
--    genuinely need to read client-side (maintenance mode, the testimonial
--    pause toggle — both low-stakes, UI-only checks) are publicly
--    readable. pause_payments and pause_new_signups are enforced only
--    server-side and stay admin-only, so anonymous visitors can't
--    enumerate that operational state.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.feature_flags (
  flag_key   text        primary key,
  enabled    boolean     not null default false,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.feature_flags enable row level security;
drop policy if exists "Public read maintenance flag" on public.feature_flags;
create policy "Public read maintenance flag" on public.feature_flags
  for select using (flag_key in ('maintenance_mode_customer_portal', 'pause_testimonial_submissions'));
drop policy if exists "Admins manage feature_flags" on public.feature_flags;
create policy "Admins manage feature_flags" on public.feature_flags
  for all using (public.is_admin(auth.uid()));

insert into public.feature_flags (flag_key, enabled) values
  ('maintenance_mode_customer_portal', false),
  ('pause_new_signups', false),
  ('pause_testimonial_submissions', false),
  ('pause_payments', false)
on conflict (flag_key) do nothing;

-- ═══════════════════════════════════════════════════════════════════
-- 3. Admin-editable email templates. Seeded with the copy currently
--    hardcoded in src/lib/email.ts so existing emails are unaffected until
--    an admin actually changes something.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.email_templates (
  template_key text        primary key,
  subject      text        not null,
  heading      text        not null,
  intro_text   text        not null,
  footer_text  text,
  updated_at   timestamptz not null default now()
);
alter table public.email_templates enable row level security;
drop policy if exists "Admins manage email_templates" on public.email_templates;
create policy "Admins manage email_templates" on public.email_templates
  for all using (public.is_admin(auth.uid()));

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
   null)
on conflict (template_key) do nothing;

-- ═══════════════════════════════════════════════════════════════════
-- 4. Server error log, for the admin monitoring dashboard.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.error_log (
  id          uuid        primary key default gen_random_uuid(),
  context     text        not null,
  message     text        not null,
  details     jsonb,
  customer_id uuid,
  created_at  timestamptz not null default now()
);
create index if not exists error_log_created_idx on public.error_log (created_at desc);
alter table public.error_log enable row level security;
drop policy if exists "Admins view error_log" on public.error_log;
create policy "Admins view error_log" on public.error_log
  for select using (public.is_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════════════
-- 5. Admin-editable Financial Kundali price (nullable — falls back to the
--    code constant when unset, so this is safe pre- and post-migration).
-- ═══════════════════════════════════════════════════════════════════
alter table public.site_settings add column if not exists financial_kundali_price_inr numeric;

-- ═══════════════════════════════════════════════════════════════════
-- 6. Real "source" column on payments for manual admin grants, instead of
--    sniffing a prefix out of razorpay_order_id — a money table deserves an
--    explicit column, not a stringly-typed signal.
-- ═══════════════════════════════════════════════════════════════════
alter table public.payments add column if not exists source text not null default 'razorpay';
