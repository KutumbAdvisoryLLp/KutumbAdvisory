-- Additive migration — safe to run standalone against the live database.
-- Does NOT touch any existing table or data. Run this whole file once in the
-- Supabase SQL editor.

create table if not exists public.device_sessions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  user_type     text        not null check (user_type in ('admin','mykundali')),
  device_id     text        not null,
  device_label  text,
  last_seen_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (user_id, device_id)
);

alter table public.device_sessions enable row level security;

create policy "Users manage own device sessions" on public.device_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.testimonial_submissions (
  id            uuid        primary key default gen_random_uuid(),
  customer_id   uuid        references public.customers(id) on delete set null,
  name          text        not null,
  testimonial   text        not null,
  status        text        not null default 'new' check (status in ('new','featured','dismissed')),
  created_at    timestamptz not null default now()
);

alter table public.testimonial_submissions enable row level security;

create policy "Customers submit testimonials" on public.testimonial_submissions
  for insert with check (auth.uid() = customer_id);

create policy "Admins manage testimonial submissions" on public.testimonial_submissions
  for all using (auth.uid() in (select id from public.admin_users));
