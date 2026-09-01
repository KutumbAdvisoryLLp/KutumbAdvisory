-- Additive migration — safe to run standalone against the live database.
-- Does NOT touch any existing table or data. Run this whole file once in the
-- Supabase SQL editor.
--
-- Replaces Supabase's built-in generateLink(type:'signup') OTP mechanism,
-- which creates the actual auth.users row the moment an OTP is requested —
-- before it's ever verified. A failed or expired code left a permanent
-- unconfirmed "ghost" account that blocked that email from ever signing up
-- again ("already registered" with no way to verify). This table lets us
-- verify the code BEFORE creating any account at all.
--
-- No RLS policies are defined on purpose — this table is only ever read or
-- written by the server's service-role client, never by a browser client.

create table if not exists public.signup_otp_codes (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  otp_hash    text        not null,
  attempts    integer     not null default 0,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

alter table public.signup_otp_codes enable row level security;
