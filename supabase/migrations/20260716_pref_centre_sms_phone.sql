-- Preference centre: per-brand, per-channel consent + the phone number it needs.
--
-- Why this exists:
--   1. NOBODY has SMS consent. Every string in lib/copy.ts says "modtage e-mails";
--      SIGNUP_LAUNCH_NOTICE says "besked på e-mail". A consent that names a channel
--      covers that channel. So every *_sms column below starts FALSE for everyone,
--      with no exceptions, and nothing may derive SMS consent from an email one.
--   2. The phone number was never mirrored here. mirrorSignup only ever wrote
--      email/first_name/created_at/source/consent; the number went upstream to
--      MySQL and nowhere else. The preference centre reads THIS database, so it
--      cannot show a person the number they gave us. That is the gap this closes.
--
-- Ordering note: this migration only ADDS nullable columns and backfills them.
-- It does not drop or rewrite marketing_consent_mad / marketing_consent_group,
-- so the currently-deployed code keeps working against the same rows while this
-- ships. Removing the legacy pair is a separate, later change.

-- ---------------------------------------------------------------------------
-- 1. The phone number
-- ---------------------------------------------------------------------------

alter table public.signup add column if not exists phone text;

comment on column public.signup.phone is
  'Danish 8-digit mobile, no country code. NULL means "not given". The sentinel '
  '00000000 must NEVER be stored here: it is a bridge value the waitlist route '
  'sends UPSTREAM only, because the upstream API marks Mobile as [Required]. It '
  'is not a real MSISDN and can never receive an SMS. Storing it would make the '
  'preference centre show a fake number back to the user.';

-- Belt and braces: the sentinel must not reach this column even by mistake, and
-- neither must anything that is not exactly 8 digits — every reader (the route,
-- lib/phone.ts, the backfill script) assumes that shape, and a service-role or
-- ad-hoc SQL write skips the app-side validation entirely.
alter table public.signup drop constraint if exists signup_phone_not_sentinel;
alter table public.signup add constraint signup_phone_not_sentinel
  check (phone is null or (phone ~ '^[0-9]{8}$' and phone <> '00000000'));

-- ---------------------------------------------------------------------------
-- 2. Per-brand, per-channel consent
-- ---------------------------------------------------------------------------
-- Four brands x two channels. Deliberately NOT here:
--   Altid Energi  - a separate legal sender. Altid Hjem ApS cannot hold consent
--                   on its behalf; it collects its own.
--   Altid Alarm   - live on the site but named in NO consent text we have ever
--                   shown. Its sending entity is unconfirmed. Absent on purpose.

alter table public.signup
  add column if not exists consent_hjem_email       boolean not null default false,
  add column if not exists consent_hjem_sms         boolean not null default false,
  add column if not exists consent_mad_email        boolean not null default false,
  add column if not exists consent_mad_sms          boolean not null default false,
  add column if not exists consent_forsikring_email boolean not null default false,
  add column if not exists consent_forsikring_sms   boolean not null default false,
  add column if not exists consent_mobil_email      boolean not null default false,
  add column if not exists consent_mobil_sms        boolean not null default false;

-- ---------------------------------------------------------------------------
-- 3. Backfill: faithful, never widening
-- ---------------------------------------------------------------------------
-- marketing_consent_mad   <- PREF_CONSENT_MAD, which names "Altid Mad".
-- marketing_consent_group <- PREF_CONSENT_GROUP, which names exactly
--                            "Altid Hjem, Altid Forsikring og Altid Mobil".
-- Splitting one yes covering three NAMED brands into three flags is a
-- subdivision of what the person actually agreed to, not an expansion.
--
-- This mapping is source-independent, and that is worth stating because it looks
-- like it should not be: the signup form's single box sets mad AND group together
-- (WaitlistForm: consent: { mad: consentAll, group: consentAll }) under
-- SIGNUP_CONSENT_ALL, which names all four brands; the preference centre sets them
-- independently under the two narrower strings. Either way each flag already
-- carries the right scope, so no signup_source branch is needed here.
--
-- MONOTONE on purpose (review 31/7): each statement only ever widens a per-brand
-- flag from the legacy pair, never narrows one. That makes this UPDATE safe to
-- RE-RUN after the new code is live — which the rollout plan does once, to catch
-- rows written by legacy writers (the old deployed code, the altidmad.dk site)
-- between the migration and their deploys. A plain assignment here would clobber
-- granular new-model states on re-run (e.g. reset consent_hjem_email to false
-- for someone who ticked Hjem but not Forsikring/Mobil, because their
-- conservative marketing_consent_group is false). Widening cannot resurrect a
-- withdrawn consent: every new-model write clears the legacy pair in the same
-- UPDATE it clears the matrix.
--
-- Rows with unsubscribed = true are skipped: before "leaving means leaving"
-- shipped, an unsubscribe could leave stale legacy consent flags behind, and
-- minting fresh per-brand consent for someone who unsubscribed would hand a
-- matrix-reading send-gate exactly the person it must never mail.

update public.signup set
  consent_mad_email        = consent_mad_email        or coalesce(marketing_consent_mad, false),
  consent_hjem_email       = consent_hjem_email       or coalesce(marketing_consent_group, false),
  consent_forsikring_email = consent_forsikring_email or coalesce(marketing_consent_group, false),
  consent_mobil_email      = consent_mobil_email      or coalesce(marketing_consent_group, false)
where (marketing_consent_mad is true or marketing_consent_group is true)
  and unsubscribed is not true;

-- Every *_sms flag keeps its FALSE default. Not one person has consented to SMS.
-- If a future migration ever appears to "restore" SMS consent from historical
-- data, it is wrong: there is no such data to restore.

-- ---------------------------------------------------------------------------
-- 4. The audit trail has to record the new shape too
-- ---------------------------------------------------------------------------
-- consent_event rows are the evidence for "did you hold this consent when you
-- sent that mail?". A row that only carries the old two flags cannot answer that
-- once consent is per-brand and per-channel.
--
-- The new columns are NULLABLE on purpose: rows written before this migration
-- genuinely have no per-channel value, and inventing one would be fabricating
-- evidence. NULL here reads as "recorded under the two-flag model" — which is
-- exactly what happened.

alter table public.consent_event
  add column if not exists consent_hjem_email       boolean,
  add column if not exists consent_hjem_sms         boolean,
  add column if not exists consent_mad_email        boolean,
  add column if not exists consent_mad_sms          boolean,
  add column if not exists consent_forsikring_email boolean,
  add column if not exists consent_forsikring_sms   boolean,
  add column if not exists consent_mobil_email      boolean,
  add column if not exists consent_mobil_sms        boolean;

comment on column public.consent_event.consent_hjem_sms is
  'NULL on rows predating the per-channel model (2026-07-16). NULL means "not '
  'recorded", never "consented".';

-- The append-only triggers from 20260714_consent_event.sql still apply: this
-- migration adds columns, it does not touch the trigger or the RLS posture.
