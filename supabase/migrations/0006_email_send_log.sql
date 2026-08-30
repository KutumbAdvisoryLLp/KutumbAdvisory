-- Additive migration — safe to run standalone against the live database.
-- Does NOT touch any existing table or data. Run this whole file once in the
-- Supabase SQL editor.
--
-- Tracks how many emails have actually been sent through Resend so the
-- admin Developer page can show "X of 100 daily emails remaining" — Resend
-- doesn't expose a "remaining quota" API, so this is tracked ourselves.

create table if not exists public.email_send_log (
  id       uuid        primary key default gen_random_uuid(),
  count    integer     not null default 1,
  sent_at  timestamptz not null default now()
);

alter table public.email_send_log enable row level security;

create policy "Admins view email_send_log" on public.email_send_log
  for select using (auth.uid() in (select id from public.admin_users));
