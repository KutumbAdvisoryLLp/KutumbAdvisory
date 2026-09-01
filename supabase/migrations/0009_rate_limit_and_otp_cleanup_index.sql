-- Purely additive — adds one index, touches no existing data. Safe to run
-- standalone against the live database.
--
-- Supports the opportunistic cleanup query in send-signup-otp (deletes
-- expired signup_otp_codes rows on every send) so that scan stays cheap as
-- the table grows, instead of a full sequential scan.
create index if not exists signup_otp_codes_expires_idx
  on public.signup_otp_codes (expires_at);
