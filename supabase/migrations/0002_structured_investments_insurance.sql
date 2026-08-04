-- Kutumb Advisory — structured investment/insurance entries
-- Run this in the Supabase SQL editor for your project.
--
-- Converts family_profiles.existing_investments / existing_insurance from
-- text[] (free-text comma-separated tags) to jsonb (array of structured
-- {type, amount, ...} objects), per the new repeatable-row UI on the
-- family profile page. Existing text values are preserved as a
-- best-effort {type: <old string>} entry with zeroed amounts.

-- Temporary helper functions to avoid subqueries in alter table USING clause
create or replace function public.temp_convert_investments(arr text[])
returns jsonb as $$
begin
  return coalesce(
    (select jsonb_agg(jsonb_build_object('type', elem, 'amount', 0))
     from unnest(arr) as elem),
    '[]'::jsonb
  );
end;
$$ language plpgsql immutable;

create or replace function public.temp_convert_insurance(arr text[])
returns jsonb as $$
begin
  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'type', elem, 'sumInsured', 0, 'premium', 0, 'paymentMode', 'Annual'
    ))
     from unnest(arr) as elem),
    '[]'::jsonb
  );
end;
$$ language plpgsql immutable;

-- Drop old default constraints to avoid type casting errors during type alteration
alter table public.family_profiles
  alter column existing_investments drop default,
  alter column existing_insurance drop default;

alter table public.family_profiles
  alter column existing_investments type jsonb
  using public.temp_convert_investments(existing_investments);

alter table public.family_profiles
  alter column existing_investments set default '[]'::jsonb;

alter table public.family_profiles
  alter column existing_insurance type jsonb
  using public.temp_convert_insurance(existing_insurance);

alter table public.family_profiles
  alter column existing_insurance set default '[]'::jsonb;

-- Clean up helper functions
drop function public.temp_convert_investments(text[]);
drop function public.temp_convert_insurance(text[]);

