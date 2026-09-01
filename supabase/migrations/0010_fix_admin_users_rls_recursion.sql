-- URGENT — run this immediately. Migration 0008 introduced a
-- self-referential RLS policy on admin_users (a policy on admin_users that
-- queries admin_users) which Postgres rejects with "infinite recursion
-- detected in policy for relation admin_users". This breaks ALL access to
-- admin_users right now, including for real admins — isAdminUser() gets
-- that error, treats it as "not an admin", and admin login fails outright.
--
-- Fix: a SECURITY DEFINER function performs the self-lookup outside of RLS
-- (it runs as the function owner, which is exempt from RLS on tables it
-- owns), breaking the recursive cycle. This is the standard, documented
-- Postgres/Supabase pattern for this exact situation.

create or replace function public.is_admin(check_uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where id = check_uid);
$$;

drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users" on public.admin_users
  for select using (auth.uid() = id or public.is_admin(auth.uid()));
