-- Altid Energi referral events (ALT-231 / ALT-286).
--
-- The app shows every Altid Energi customer a personal link
-- https://altidhjem.dk/r/<code>. The code is 8 chars derived one-way from the
-- customer number (base32(sha256("altid-referral:" || customerNo))), so this
-- table never holds a customer number in the clear. Treat code as a pseudonym
-- for a customer all the same: we can recompute it, and so could anyone with
-- the customer number. Nothing here may ever be exposed outside the service
-- role (see the grants below).
--
-- One row per event:
--   click  : a friend opened /r/<code> (bots and link unfurlers are skipped)
--   share  : the customer opened the share sheet in the app
--   copy   : the customer copied the link in the app
-- For every kind we store a daily-salted hash of the caller's IP (dedupe only,
-- never the raw IP), the user agent and the Vercel country header. No cookie,
-- no cross-site id, no email. Legal basis: our own service data for a referral
-- programme the customer actively uses (same reasoning as the activation
-- counter, ALT-210). Rows older than 90 days may be purged; the purge cron is
-- not part of this migration, the created_at index below is there for it.

create table if not exists public.energi_referral_event (
  id          bigserial primary key,
  code        text        not null,
  kind        text        not null check (kind in ('click', 'share', 'copy')),
  -- false when /r/<code> was hit with a code that fails the format check; we
  -- still redirect the friend to Energi (without ref) but keep the row so we
  -- can see typos / scraping.
  valid       boolean     not null default true,
  -- sha256(REFERRAL_IP_SALT || 'YYYY-MM-DD' || ip). Rotates daily, so it can
  -- dedupe within a day but never re-identify a person across days.
  ip_hash     text,
  ua          text,
  country     text,
  created_at  timestamptz not null default now()
);

comment on table public.energi_referral_event is
  'Altid Energi referral link events (click/share/copy) per referral code. Hashed IP only. Purge rows older than 90 days.';

create index if not exists energi_referral_event_code_kind_idx
  on public.energi_referral_event (code, kind, created_at desc);

-- For the retention purge (delete ... where created_at < now() - interval '90 days').
create index if not exists energi_referral_event_created_at_idx
  on public.energi_referral_event (created_at);

-- Only the service-role key may read or write. RLS with no policies blocks
-- anon/authenticated through PostgREST; the explicit revoke is belt and braces
-- against Supabase's default grants on new public objects.
alter table public.energi_referral_event enable row level security;
revoke all on public.energi_referral_event from anon, authenticated;
revoke all on sequence public.energi_referral_event_id_seq from anon, authenticated;

-- security_invoker: the view runs with the CALLER's rights, so the base table's
-- RLS applies through it. Without this a plain view runs as its owner and the
-- anon key could read every code's counts via PostgREST.
create or replace view public.energi_referral_stats
  with (security_invoker = true)
as
  select
    code,
    count(*)                 filter (where kind = 'click' and valid)                          as clicks,
    -- Distinct daily IP hashes, so a person clicking on ten days counts ten
    -- times. Named for what it is, not "unique clicks".
    count(distinct ip_hash)  filter (where kind = 'click' and valid and ip_hash is not null) as unique_ip_days,
    count(*)                 filter (where kind = 'share' and valid)                          as shares,
    count(*)                 filter (where kind = 'copy'  and valid)                          as copies,
    min(created_at)          as first_seen,
    max(created_at)          as last_seen
  from public.energi_referral_event
  group by code;

revoke all on public.energi_referral_stats from anon, authenticated;

-- Rollback (additive migration, nothing else depends on these):
--   drop view if exists public.energi_referral_stats;
--   drop table if exists public.energi_referral_event;
