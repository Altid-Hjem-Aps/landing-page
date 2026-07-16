import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { cleanPhone } from '@/lib/phone'

// Supabase client (service role — server-side only). Reachable from Vercel,
// unlike the self-hosted MySQL which is firewalled.
let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Supabase env not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
    }
    client = createClient(url, key, { auth: { persistSession: false } })
  }
  return client
}

/**
 * Persistent, race-safe rate limit (one atomic Postgres upsert per call).
 * Replaces the in-memory Map, which reset on every serverless cold start.
 * Returns true if the caller is OVER the limit. Fails OPEN (returns false) on
 * any error so an infra hiccup never blocks real signups.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const k = String(key || '').trim()
  if (!k) return false
  try {
    const { data, error } = await getClient().rpc('check_rate_limit', {
      p_key: k,
      p_max: max,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      console.error('rate limit check failed', error.message)
      return false
    }
    return data === true
  } catch (e) {
    console.error('rate limit check threw', e)
    return false
  }
}

/**
 * Record that `referredEmail` joined via `referrerCode` (the inviter's code).
 * Lives in the `referral` table. Duplicates (same email) are ignored.
 */
export async function recordReferral(opts: {
  referrerCode: string
  referredEmail: string
  referredId?: string | null
}): Promise<void> {
  const referrerCode = String(opts.referrerCode || '').trim().slice(0, 64)
  const referredEmail = String(opts.referredEmail || '').trim().toLowerCase()
  if (!referrerCode || !referredEmail) return
  // Guard against self-referral: the new signup's own id can't be its referrer.
  if (opts.referredId && String(opts.referredId).trim() === referrerCode) return

  const { error } = await getClient()
    .from('referral')
    .upsert(
      { referrer_code: referrerCode, referred_email: referredEmail, referred_id: opts.referredId ?? null },
      { onConflict: 'referred_email', ignoreDuplicates: true },
    )
  if (error) throw new Error(error.message)
}

/** A date's key in the Europe/Copenhagen calendar, formatted 'YYYY-MM-DD'. */
function copenhagenDateKey(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/**
 * Real waitlist signup counts, straight from the `signup` table (the source of
 * truth the Slack tracker should use — NOT delivered Resend emails, whose
 * `last_event` drifts off "delivered" as recipients open them and which also
 * count non-signup blasts). Returns the all-time total, today's count, and a
 * per-day breakdown keyed by Copenhagen calendar day ('YYYY-MM-DD').
 *
 * Pages through the table so the count stays exact past PostgREST's default
 * 1000-row cap (see getQueuePosition for the same concern).
 */
export async function getSignupCounts(): Promise<{
  today: number
  total: number
  perDay: Record<string, number>
}> {
  const supabase = getClient()
  const perDay: Record<string, number> = {}
  let total = 0
  const PAGE = 1000

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('signup')
      .select('created_at')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(error.message)
    if (!data || data.length === 0) break
    for (const row of data) {
      const key = copenhagenDateKey(new Date((row as { created_at: string }).created_at))
      perDay[key] = (perDay[key] ?? 0) + 1
      total++
    }
    if (data.length < PAGE) break
  }

  const today = perDay[copenhagenDateKey(new Date())] ?? 0
  return { today, total, perDay }
}

/** How many people a given referral code has successfully brought in. */
export async function getReferralCount(referrerCode: string): Promise<number> {
  const code = String(referrerCode || '').trim().slice(0, 64)
  if (!code) return 0
  const { count, error } = await getClient()
    .from('referral')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_code', code)
  if (error) throw new Error(error.message)
  return count ?? 0
}

/**
 * Mirror a signup into Supabase (public_id + created_at) so the leaderboard
 * position can be computed where Vercel can reach. Idempotent.
 */
export async function mirrorSignup(
  publicId: string,
  opts?: {
    email?: string
    firstName?: string
    createdAt?: string
    source?: string
    phone?: string
    consent?: { version?: string; mad?: boolean; group?: boolean }
  },
): Promise<string | null> {
  const id = String(publicId || '').trim()
  if (!id) return null
  const row: Record<string, unknown> = {
    public_id: id,
    created_at: opts?.createdAt ?? new Date().toISOString(),
  }
  if (opts?.email) row.email = String(opts.email).toLowerCase()
  if (opts?.firstName) row.first_name = opts.firstName
  if (opts?.source) row.signup_source = opts.source
  // The mobile number, so the preference centre can show people the number they
  // actually gave us instead of an empty box. Until now it only went upstream to
  // MySQL, which this database cannot see. cleanPhone rejects the '00000000'
  // sentinel the waitlist route sends UPSTREAM only (that API marks Mobile as
  // [Required]) — it is not a real MSISDN, and storing it would show the user a
  // fake number as if it were theirs. A DB check constraint backs this up.
  const mirroredPhone = cleanPhone(opts?.phone)
  if (mirroredPhone) row.phone = mirroredPhone
  // Documented marketing consent (GDPR / Forbrugerombudsmanden): store exactly
  // which permission each person gave, when, and under which wording version,
  // so a later marketing send can be gated on it. Only written when the form
  // actually sent a consent object. Booleans are normalised so a missing/odd
  // value records as "no consent" rather than null.
  if (opts?.consent) {
    row.marketing_consent_mad = opts.consent.mad === true
    row.marketing_consent_group = opts.consent.group === true
    if (opts.consent.version) row.consent_version = opts.consent.version
    row.consent_at = row.created_at
    // Per-brand mirror of the same yes. SIGNUP_CONSENT_ALL names Altid Hjem,
    // Altid Mad, Altid Forsikring and Altid Mobil in one box, so one tick is a
    // yes to all four — for EMAIL. Writing the four flags is a subdivision of
    // what they agreed to, not an expansion of it.
    row.consent_mad_email = opts.consent.mad === true
    row.consent_hjem_email = opts.consent.group === true
    row.consent_forsikring_email = opts.consent.group === true
    row.consent_mobil_email = opts.consent.group === true
    // SMS is NOT set here, at any value. The signup form has no SMS box, and no
    // wording we have ever shown mentions SMS. The columns default to false; an
    // email consent must never imply an SMS one.
  }

  async function upsert(r: Record<string, unknown>) {
    // Return the per-signup unsubscribe token (auto-generated by the DB default).
    return getClient()
      .from('signup')
      .upsert(r, { onConflict: 'public_id', ignoreDuplicates: false })
      .select('unsub_token')
      .maybeSingle()
  }

  // Columns that may not exist in prod yet (migration not run). A missing one
  // must NEVER break the signup itself — strip the column named in the error
  // and retry. Bounded by the optional-column count so a persistent error
  // can't loop forever.
  // TODO: remove this fallback once these columns are confirmed in prod.
  const OPTIONAL_COLUMNS = [
    'signup_source',
    'marketing_consent_mad',
    'marketing_consent_group',
    'consent_version',
    'consent_at',
    // Added by 20260716_pref_centre_sms_phone.sql. Listed here so a signup still
    // succeeds against a prod database where that migration has not run yet.
    'phone',
    'consent_hjem_email',
    'consent_mad_email',
    'consent_forsikring_email',
    'consent_mobil_email',
  ]

  let { data, error } = await upsert(row)
  for (let i = 0; i < OPTIONAL_COLUMNS.length && error; i++) {
    // Only the unknown-column errors are strippable: PGRST204 (PostgREST
    // schema-cache miss) or Postgres 42703 (column does not exist). Any OTHER
    // error that merely names a column in its message (NOT NULL / CHECK / RLS /
    // trigger) must still throw, so a real failure can never silently drop the
    // consent/source data while the signup itself "succeeds".
    const code = (error as { code?: string }).code
    if (code !== 'PGRST204' && code !== '42703') break
    const msg = error.message ?? ''
    const missing = OPTIONAL_COLUMNS.find((c) => c in row && msg.includes(c))
    if (!missing) break
    console.error(`mirrorSignup: ${missing} column missing, retrying without it`, msg)
    delete row[missing]
    ;({ data, error } = await upsert(row))
  }
  // Transient failure (network / timeout / 5xx) here would otherwise lose the
  // consent record permanently: a later re-signup 409s upstream before
  // mirrorSignup runs, and the 409 path can't backfill without this row's
  // public_id. Retry a few times — this runs in after(), so a short delay does
  // not affect the response.
  for (let i = 0; i < 3 && error; i++) {
    await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)))
    ;({ data, error } = await upsert(row))
  }
  if (error) throw new Error(error.message)
  return (data as { unsub_token?: string } | null)?.unsub_token ?? null
}

/**
 * Merge newly-given marketing consent into an EXISTING signup row. Only flags
 * the new TRUE consents; never downgrades an existing true to false (a re-signup
 * is not a withdrawal). No-op when no consent object is passed or nothing is
 * affirmatively consented.
 *
 * Deliberately NOT called from the anonymous waitlist form: that caller can't
 * prove it owns the email, so letting it write consent would let anyone flip
 * another person's marketing consent. Retained for the authenticated re-consent
 * path (the preference center), which is the only caller that should reach it.
 */
export async function mergeConsent(
  email: string,
  consent?: { version?: string; mad?: boolean; group?: boolean },
): Promise<void> {
  const addr = String(email || '').toLowerCase().trim()
  if (!addr || !consent) return
  const patch: Record<string, unknown> = {}
  // Each legacy yes also writes its per-brand email subdivision (review 31/7):
  // without it, every consent confirmed via /bekraeft AFTER the one-time
  // migration backfill would be invisible to the matrix model — the preference
  // centre would show the person all-unticked minutes after they confirmed, and
  // a save from that misrendered state would revoke the consent they just gave.
  // mad names Altid Mad; group names the other three. SMS is never written here:
  // no double-opt-in wording has ever mentioned SMS.
  if (consent.mad === true) {
    patch.marketing_consent_mad = true
    patch.consent_mad_email = true
  }
  if (consent.group === true) {
    patch.marketing_consent_group = true
    patch.consent_hjem_email = true
    patch.consent_forsikring_email = true
    patch.consent_mobil_email = true
  }
  // Nothing affirmatively consented → nothing to merge (don't touch the row).
  if (Object.keys(patch).length === 0) return
  if (consent.version) patch.consent_version = consent.version
  patch.consent_at = new Date().toISOString()

  const OPTIONAL_COLUMNS = [
    'marketing_consent_mad',
    'marketing_consent_group',
    'consent_version',
    'consent_at',
    // Added by 20260716_pref_centre_sms_phone.sql — strippable so a re-consent
    // still lands on a prod database where that migration has not run yet.
    'consent_mad_email',
    'consent_hjem_email',
    'consent_forsikring_email',
    'consent_mobil_email',
  ]
  async function apply(p: Record<string, unknown>) {
    // Keyed on email: it is the shared-list natural key, so this works from
    // either site's 409 path without a public_id lookup first. .select() returns
    // the rows touched so we can tell a real update from a silent no-match.
    return getClient().from('signup').update(p).eq('email', addr).select('public_id')
  }
  let { data, error } = await apply(patch)
  // Same column-missing fallback as mirrorSignup: a not-yet-migrated column
  // (PGRST204 / 42703) is stripped and retried; any other error still throws.
  for (let i = 0; i < OPTIONAL_COLUMNS.length && error; i++) {
    const code = (error as { code?: string }).code
    if (code !== 'PGRST204' && code !== '42703') break
    const msg = error.message ?? ''
    const missing = OPTIONAL_COLUMNS.find((c) => c in patch && msg.includes(c))
    if (!missing) break
    console.error(`mergeConsent: ${missing} column missing, retrying without it`, msg)
    delete patch[missing]
    if (Object.keys(patch).length === 0) return
    ;({ data, error } = await apply(patch))
  }
  if (error) throw new Error(error.message)
  // A 409 means the email exists upstream, but it may not be mirrored into
  // Supabase (pre-mirror signups). Log a 0-row merge instead of dropping the
  // consent silently, so the gap is monitorable rather than invisible.
  if (!(data as unknown[] | null)?.length) {
    console.error('mergeConsent: no Supabase signup row matched for re-consent — consent not persisted')
  }
}

/** Look up a signup's unsubscribe token by public_id (for building email links). */
export async function getUnsubToken(publicId: string): Promise<string | null> {
  const id = String(publicId || '').trim()
  if (!id) return null
  const { data, error } = await getClient()
    .from('signup')
    .select('unsub_token')
    .eq('public_id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as { unsub_token?: string } | null)?.unsub_token ?? null
}

/**
 * Look up everything needed to send a referrer their progress email:
 * their email + first name, their current referral count, and queue position.
 */
export async function getReferrerProgress(referrerCode: string): Promise<{
  email: string
  firstName: string
  count: number
  position: number | null
  progressPct: number
} | null> {
  const code = String(referrerCode || '').trim()
  if (!code) return null
  const { data, error } = await getClient()
    .from('signup')
    .select('email, first_name')
    .eq('public_id', code)
    .maybeSingle()
  if (error) throw new Error(error.message)
  const email = (data as { email?: string } | null)?.email
  if (!email) return null
  const count = await getReferralCount(code)
  const position = await getQueuePosition(code)
  const progressPct = Math.min(100, Math.round((Math.min(count, 10) / 10) * 100))
  return { email, firstName: (data as { first_name?: string })?.first_name ?? '', count, position, progressPct }
}

/**
 * Mark a person as unsubscribed / re-subscribed using their secret unsubscribe
 * token (NOT the public referral code, which is shared openly). Returns the
 * matched email + public_id (so callers can mirror to Resend), or null.
 */
export async function setUnsubscribedByToken(
  token: string,
  value: boolean,
): Promise<{ email: string; publicId: string } | null> {
  const t = String(token || '').trim()
  if (!t) return null
  const { data, error } = await getClient()
    .from('signup')
    .update({ unsubscribed: value, unsubscribed_at: value ? new Date().toISOString() : null })
    .eq('unsub_token', t)
    .select('email, public_id')
  if (error) throw new Error(error.message)
  const rows = (data as { email?: string; public_id?: string }[] | null) ?? []
  if (!rows.length) return null
  return { email: rows[0].email ?? '', publicId: rows[0].public_id ?? '' }
}

/** Whether a person (by public_id) has unsubscribed from marketing emails. */
export async function isUnsubscribed(publicId: string): Promise<boolean> {
  const id = String(publicId || '').trim()
  if (!id) return false
  const { data, error } = await getClient()
    .from('signup')
    .select('unsubscribed')
    .eq('public_id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return Boolean((data as { unsubscribed?: boolean } | null)?.unsubscribed)
}

/**
 * Leaderboard queue position for a person (1 = front of the line).
 * Ranking is computed server-side by the `queue_position` Postgres function
 * (rank by referral count desc, ties broken by signup time asc). This avoids
 * pulling the whole table into the function — and avoids PostgREST's default
 * 1000-row cap silently truncating the result once the list grows.
 */
export async function getQueuePosition(publicId: string): Promise<number | null> {
  const id = String(publicId || '').trim()
  if (!id) return null
  const { data, error } = await getClient().rpc('queue_position', { p_public_id: id })
  if (error) throw new Error(error.message)
  return typeof data === 'number' ? data : null
}

/**
 * Look up an existing signup by email, with everything the 409 path needs to
 * decide in ONE round trip: who they are, what consent they already hold, and
 * whether they have left the list. Fail-safe: any error returns null, and the
 * lookup races a 2s timeout, so the 409 response can never break or stall on a
 * Supabase hiccup. Oldest row wins (that is the original signup).
 */
export async function getSignupByEmail(email: string): Promise<{
  publicId: string
  firstName: string | null
  unsubToken: string | null
  unsubscribed: boolean
  consentMad: boolean
  consentGroup: boolean
} | null> {
  try {
    const query = getClient()
      .from('signup')
      .select('public_id, first_name, unsub_token, unsubscribed, marketing_consent_mad, marketing_consent_group')
      .eq('email', String(email).toLowerCase().trim())
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
    const result = await Promise.race([query, timeout])
    if (!result) return null
    const { data, error } = result
    if (error || !data) return null
    const row = data as {
      public_id?: string | null
      first_name?: string | null
      unsub_token?: string | null
      unsubscribed?: boolean | null
      marketing_consent_mad?: boolean | null
      marketing_consent_group?: boolean | null
    }
    if (!row.public_id) return null
    return {
      publicId: row.public_id,
      firstName: row.first_name ?? null,
      unsubToken: row.unsub_token ?? null,
      // A NULL flag is a legacy row with no consent recorded — treat it as "not
      // consented", never as consented.
      unsubscribed: row.unsubscribed === true,
      consentMad: row.marketing_consent_mad === true,
      consentGroup: row.marketing_consent_group === true,
    }
  } catch {
    return null
  }
}

/**
 * The row a confirmation token names. Used on the confirm POST to re-check the
 * row still exists and has not left the list before writing consent — a token
 * minted six days ago says nothing about the row's state today. Throws rather
 * than returning null on error: this call gates a consent write, so a hiccup must
 * fail the write, not silently skip the check.
 */
export async function getSignupByPublicId(publicId: string): Promise<{
  email: string
  unsubscribed: boolean
  consentMad: boolean
  consentGroup: boolean
  matrix: ConsentMatrix
} | null> {
  const id = String(publicId || '').trim()
  if (!id) return null
  const { data, error } = await getClient()
    .from('signup')
    .select(`email, unsubscribed, marketing_consent_mad, marketing_consent_group, ${MATRIX_COLUMNS}`)
    .eq('public_id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  const row = data as Record<string, unknown> | null
  if (!row?.email) return null
  return {
    email: row.email as string,
    unsubscribed: row.unsubscribed === true,
    consentMad: row.marketing_consent_mad === true,
    consentGroup: row.marketing_consent_group === true,
    // For the confirm POST's audit event: the event records full post-state, so
    // the caller needs the row's current matrix (SMS flags included) to merge
    // the newly confirmed email consents into.
    matrix: matrixFromRow(row),
  }
}

/**
 * Append-only record of every consent change: what was granted or withdrawn,
 * under which wording, when, and HOW ownership of the address was proven.
 *
 * The signup row holds only the CURRENT state, and it has ONE consent_version /
 * consent_at pair shared by both flags — so recording a later Mad consent
 * overwrites the wording-version and timestamp that documented an earlier group
 * consent. The row therefore cannot answer the only question a regulator asks:
 * "did you hold this person's consent for this brand when you sent that mail?"
 *
 * Throws on failure. A consent write whose evidence did not land is worse than no
 * write at all: it is a boolean with nothing behind it.
 */
export async function recordConsentEvent(e: {
  publicId: string
  method: 'double-opt-in-email' | 'preference-centre' | 'unsubscribe-all'
  version: string
  // The RESULTING state of both flags, never the delta. A regulator reads the
  // latest row to answer "did you hold this consent when you sent that mail?" —
  // a delta row would answer it wrong for anyone who holds one flag already.
  mad: boolean
  group: boolean
  // The same answer at per-brand, per-channel resolution. Optional because the
  // double-opt-in page still speaks the two-flag language; omitted leaves the
  // new columns NULL, which reads as "recorded under the old model" — true, and
  // better than inventing a per-channel value nobody actually gave.
  matrix?: ConsentMatrix
  // Present only for the double-opt-in path: the confirmation token's identity.
  // A unique index makes the confirmation SINGLE-USE — a replayed link (forwarded
  // mail, scanner log, shared browser, back button) hits the index and throws
  // instead of re-granting consent the person may have revoked since.
  tokenId?: string
}): Promise<void> {
  const { error } = await getClient().from('consent_event').insert({
    public_id: e.publicId,
    method: e.method,
    consent_version: e.version,
    marketing_consent_mad: e.mad,
    marketing_consent_group: e.group,
    ...(e.matrix ? matrixToColumns(e.matrix) : {}),
    ...(e.tokenId ? { token_id: e.tokenId } : {}),
  })
  if (error) throw new Error(`consent_event insert failed: ${error.message}`)
}

/** True when this confirmation token has already been redeemed. */
export function isTokenAlreadyUsed(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  // Postgres unique_violation.
  return msg.includes('23505') || msg.includes('duplicate key')
}

/**
 * Consent per brand, per channel — the shape the preference centre renders.
 *
 * Altid Energi is absent because it is a separate legal sender; Altid Alarm
 * because it is named in no consent text we have ever shown. Neither omission is
 * an oversight, and neither may be added without new wording naming the sender.
 */
export type ConsentMatrix = {
  hjemEmail: boolean
  hjemSms: boolean
  madEmail: boolean
  madSms: boolean
  forsikringEmail: boolean
  forsikringSms: boolean
  mobilEmail: boolean
  mobilSms: boolean
}

export const EMPTY_CONSENT: ConsentMatrix = {
  hjemEmail: false,
  hjemSms: false,
  madEmail: false,
  madSms: false,
  forsikringEmail: false,
  forsikringSms: false,
  mobilEmail: false,
  mobilSms: false,
}

const MATRIX_COLUMNS =
  'consent_hjem_email, consent_hjem_sms, consent_mad_email, consent_mad_sms, ' +
  'consent_forsikring_email, consent_forsikring_sms, consent_mobil_email, consent_mobil_sms'

/**
 * Read the matrix off a row.
 *
 * `=== true` everywhere on purpose: NULL, undefined and a column that does not
 * exist yet must all read as "no consent", never as consent. Absence of evidence
 * is not evidence of a yes.
 *
 * EMAIL flags additionally derive from the legacy pair (review 31/7): writers
 * that predate the matrix — the altidmad.dk site's signup path and any
 * still-deployed old code — set only marketing_consent_mad/group, and a row they
 * touched after the one-time migration backfill would otherwise render as
 * all-unticked, which a subsequent save would then persist, silently revoking a
 * real consent. Deriving is a faithful subdivision of what those flags mean
 * (mad names Altid Mad; group names the other three), and it cannot resurrect a
 * withdrawn consent because every new-model write clears the legacy pair in the
 * same UPDATE. SMS never derives from anything: no legacy flag ever meant SMS.
 */
function matrixFromRow(row: Record<string, unknown>): ConsentMatrix {
  const legacyMad = row.marketing_consent_mad === true
  const legacyGroup = row.marketing_consent_group === true
  return {
    hjemEmail: row.consent_hjem_email === true || legacyGroup,
    hjemSms: row.consent_hjem_sms === true,
    madEmail: row.consent_mad_email === true || legacyMad,
    madSms: row.consent_mad_sms === true,
    forsikringEmail: row.consent_forsikring_email === true || legacyGroup,
    forsikringSms: row.consent_forsikring_sms === true,
    mobilEmail: row.consent_mobil_email === true || legacyGroup,
    mobilSms: row.consent_mobil_sms === true,
  }
}

/**
 * The legacy two-flag pair a matrix maps back to, used by every write that keeps
 * the old columns in step. mad maps cleanly. group cannot: it was ONE consent
 * naming three brands, and three flags cannot be squeezed back into it without
 * lying. So it is derived CONSERVATIVELY — true only when all three are true —
 * because a legacy consumer using it as a send-gate must never mail someone who
 * ticked only one of the three. Under-including is a missed mail; over-including
 * is marketing without consent. ONE definition, because the signup row and the
 * consent_event audit row must never disagree about what "group" means.
 */
export function legacyFlagsFromMatrix(m: ConsentMatrix): { mad: boolean; group: boolean } {
  return { mad: m.madEmail, group: m.hjemEmail && m.forsikringEmail && m.mobilEmail }
}

/** Column payload for a matrix write. */
function matrixToColumns(m: ConsentMatrix): Record<string, boolean> {
  return {
    consent_hjem_email: m.hjemEmail,
    consent_hjem_sms: m.hjemSms,
    consent_mad_email: m.madEmail,
    consent_mad_sms: m.madSms,
    consent_forsikring_email: m.forsikringEmail,
    consent_forsikring_sms: m.forsikringSms,
    consent_mobil_email: m.mobilEmail,
    consent_mobil_sms: m.mobilSms,
  }
}

/** The row an unsubscribe/preference token names, with its current consent state. */
export async function getSignupByUnsubToken(token: string): Promise<{
  publicId: string
  email: string
  unsubscribed: boolean
  consentMad: boolean
  consentGroup: boolean
  phone: string | null
  matrix: ConsentMatrix
} | null> {
  const t = String(token || '').trim()
  if (!t) return null
  const { data, error } = await getClient()
    .from('signup')
    .select(`public_id, email, unsubscribed, marketing_consent_mad, marketing_consent_group, phone, ${MATRIX_COLUMNS}`)
    .eq('unsub_token', t)
    .maybeSingle()
  if (error) throw new Error(error.message)
  const row = data as Record<string, unknown> | null
  if (!row?.public_id || !row.email) return null
  // The sentinel is never stored (check constraint + mirrorSignup guard), but a
  // legacy row could still carry it. Read it as "no number given", which is what
  // it has always meant, rather than showing a fake number back to its owner.
  const rawPhone = String(row.phone ?? '').replace(/\s/g, '')
  return {
    publicId: row.public_id as string,
    email: row.email as string,
    unsubscribed: row.unsubscribed === true,
    consentMad: row.marketing_consent_mad === true,
    consentGroup: row.marketing_consent_group === true,
    phone: rawPhone && rawPhone !== '00000000' ? rawPhone : null,
    matrix: matrixFromRow(row),
  }
}

/**
 * Set consent flags from the preference centre. Unlike mergeConsent this CAN set
 * a flag to false: withdrawal must be as easy as giving consent (GDPR art. 7(3)),
 * and the caller here is authenticated by possession of the emailed unsub_token,
 * so a downgrade is a legitimate act by the address owner, not an attack.
 */
export async function setConsentByToken(
  token: string,
  consent: { version: string; matrix: ConsentMatrix; phone?: string | null },
): Promise<{ publicId: string; email: string; matrix: ConsentMatrix; phone: string | null } | null> {
  const t = String(token || '').trim()
  if (!t) return null

  const phoneGiven = cleanPhone(consent.phone)
  const hasPhone = phoneGiven !== null

  // SMS consent without a number is not a consent, it is a boolean with nothing
  // behind it — there is no one to send to, and nothing the person could ever
  // withdraw by replying STOP. The browser disables the SMS boxes until a number
  // is present, but the browser is not a security boundary: a JS-less client, a
  // stale tab or a hand-made POST can still submit sms=true with no number. So
  // the rule is enforced HERE, where it cannot be bypassed.
  const m: ConsentMatrix = hasPhone
    ? consent.matrix
    : {
        ...consent.matrix,
        hjemSms: false,
        madSms: false,
        forsikringSms: false,
        mobilSms: false,
      }

  const anySms = m.hjemSms || m.madSms || m.forsikringSms || m.mobilSms
  // The number is kept only while an SMS consent justifies it. Without one it has
  // no disclosed purpose, and holding data you have no purpose for is what data
  // minimisation forbids (GDPR art. 5(1)(c)). So consent never outlives the
  // number, and the number never outlives the consent.
  const phoneToStore = anySms && hasPhone ? phoneGiven : null

  const legacy = legacyFlagsFromMatrix(m)
  const { data, error } = await getClient()
    .from('signup')
    .update({
      ...matrixToColumns(m),
      phone: phoneToStore,
      // Legacy pair, kept in step (ONE definition — see legacyFlagsFromMatrix)
      // so anything still reading it keeps working.
      marketing_consent_mad: legacy.mad,
      marketing_consent_group: legacy.group,
      consent_version: consent.version,
      consent_at: new Date().toISOString(),
      // Saving preferences is an active choice to be reachable, so it also ends
      // an unsubscribed state — in the SAME atomic UPDATE. Without this, a save
      // racing an unsubscribe (two tabs, a double-submit) could leave the row
      // "unsubscribed AND consented" at once, and whichever of the two a
      // send-gate happens to read would decide whether they get mailed. With it,
      // whichever write lands last leaves a coherent row: either fully out, or
      // in with exactly the ticked consents.
      unsubscribed: false,
      unsubscribed_at: null,
    })
    .eq('unsub_token', t)
    .select('public_id, email')
  if (error) throw new Error(error.message)
  const rows = (data ?? []) as { public_id: string; email: string }[]
  if (!rows.length) return null
  // Return what was ENFORCED, not what was asked for. The caller writes the audit
  // trail from this, and the audit trail is the evidence for "did you hold this
  // consent when you sent that mail?" — so it has to record the state that
  // actually landed in the row. Returning only the ids let the caller log its own
  // unsanitised input, which could claim an SMS consent this function had just
  // refused for having no number behind it.
  return { publicId: rows[0].public_id, email: rows[0].email, matrix: m, phone: phoneToStore }
}

/**
 * "Afmeld mig fra alt" as ONE atomic UPDATE (review 31/7).
 *
 * The previous flow cleared consent and flipped `unsubscribed` in two separate
 * writes; a concurrent preference save could interleave between them and leave
 * the row "unsubscribed AND consented" — the exact state the send-gates must
 * never see. One UPDATE has no in-between: every flag (SMS included), the legacy
 * pair, and the phone number go in the same statement that sets unsubscribed.
 * "Alt" has to mean alt, and the number's only purpose was the SMS consent that
 * just went away (GDPR art. 5(1)(c)).
 */
export async function unsubscribeAllByToken(
  token: string,
  version: string,
): Promise<{ publicId: string; email: string } | null> {
  const t = String(token || '').trim()
  if (!t) return null
  const { data, error } = await getClient()
    .from('signup')
    .update({
      ...matrixToColumns(EMPTY_CONSENT),
      phone: null,
      marketing_consent_mad: false,
      marketing_consent_group: false,
      consent_version: version,
      consent_at: new Date().toISOString(),
      unsubscribed: true,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('unsub_token', t)
    .select('public_id, email')
  if (error) throw new Error(error.message)
  const rows = (data ?? []) as { public_id: string; email: string }[]
  if (!rows.length) return null
  return { publicId: rows[0].public_id, email: rows[0].email }
}


/**
 * Rate limit that FAILS CLOSED: it throws instead of returning "not limited" when
 * the check itself cannot run.
 *
 * checkRateLimit above returns false on any error, and false means "allowed" —
 * fine for a signup form (a hiccup lets a few extra attempts through), fatal for
 * an unauthenticated MAIL SEND aimed at an address a stranger typed. If the
 * limiter is unreachable we must refuse to send, not send freely.
 */
export async function checkRateLimitStrict(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const k = String(key || '').trim()
  if (!k) throw new Error('checkRateLimitStrict: empty key')
  const { data, error } = await getClient().rpc('check_rate_limit', {
    p_key: k,
    p_max: max,
    p_window_seconds: windowSeconds,
  })
  if (error) throw new Error(`rate limit unavailable: ${error.message}`)
  return data === true
}
