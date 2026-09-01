-- Additive/corrective migration — safe to run standalone against the live
-- database. Does not drop or wipe any existing table.

-- ═══════════════════════════════════════════════════════════════════
-- 1. admin_users was publicly readable (any anon request could list every
--    admin's id/email) — restrict to admins themselves.
-- ═══════════════════════════════════════════════════════════════════
drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users" on public.admin_users
  for select using (auth.uid() = id or auth.uid() in (select id from public.admin_users));

-- ═══════════════════════════════════════════════════════════════════
-- 2. customers table: the existing RLS update policy let a customer change
--    ANY column on their own row via a direct table call, including email —
--    which would desync from their real Supabase Auth login email. Restrict
--    at the column-privilege level (RLS can't do column-level restriction).
--    NOTE: Postgres roles don't distinguish "admin" from "customer" within
--    `authenticated` — this grant applies to admins too. No current admin
--    feature updates other customer columns directly (all such writes
--    already go through service-role API routes); if one ever is built as
--    a plain client-side table call, it'll need to go through a
--    service-role route instead, since it would silently fail here.
-- ═══════════════════════════════════════════════════════════════════
revoke update on public.customers from authenticated;
grant update (full_name, phone) on public.customers to authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- 3. Rate limiting for auth-sensitive routes (signup OTP, password reset).
--    No RLS policies on purpose — only the service-role client touches it.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.rate_limit_hits (
  id         uuid        primary key default gen_random_uuid(),
  key        text        not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_key_created_idx
  on public.rate_limit_hits (key, created_at);

alter table public.rate_limit_hits enable row level security;

-- ═══════════════════════════════════════════════════════════════════
-- 4. Length limits on user-submitted free text (storage/abuse guard).
--    Postgres has no "ADD CONSTRAINT IF NOT EXISTS" — guard manually so
--    this migration stays safe to re-run.
-- ═══════════════════════════════════════════════════════════════════
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'testimonial_submissions_length_chk'
  ) then
    alter table public.testimonial_submissions
      add constraint testimonial_submissions_length_chk
      check (char_length(testimonial) <= 2000 and char_length(name) <= 200);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_notes_length_chk'
  ) then
    alter table public.leads
      add constraint leads_notes_length_chk
      check (notes is null or char_length(notes) <= 2000);
  end if;
end $$;
