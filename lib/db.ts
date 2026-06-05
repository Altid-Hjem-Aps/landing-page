import { createClient, type SupabaseClient } from '@supabase/supabase-js'

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
  if (referrerCode.toLowerCase() === referredEmail) return // guard against obvious self-refer

  const { error } = await getClient()
    .from('referral')
    .upsert(
      { referrer_code: referrerCode, referred_email: referredEmail, referred_id: opts.referredId ?? null },
      { onConflict: 'referred_email', ignoreDuplicates: true },
    )
  if (error) throw new Error(error.message)
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
  opts?: { email?: string; firstName?: string; createdAt?: string },
): Promise<void> {
  const id = String(publicId || '').trim()
  if (!id) return
  const row: Record<string, unknown> = {
    public_id: id,
    created_at: opts?.createdAt ?? new Date().toISOString(),
  }
  if (opts?.email) row.email = String(opts.email).toLowerCase()
  if (opts?.firstName) row.first_name = opts.firstName
  const { error } = await getClient()
    .from('signup')
    .upsert(row, { onConflict: 'public_id', ignoreDuplicates: false })
  if (error) throw new Error(error.message)
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

/** Mark a person (by public_id) as unsubscribed / re-subscribed. Returns true if a row matched. */
export async function setUnsubscribed(publicId: string, value: boolean): Promise<boolean> {
  const id = String(publicId || '').trim()
  if (!id) return false
  const { error, count } = await getClient()
    .from('signup')
    .update({ unsubscribed: value }, { count: 'exact' })
    .eq('public_id', id)
  if (error) throw new Error(error.message)
  return (count ?? 0) > 0
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
 * Everyone is ranked by referral count (desc), ties broken by signup time (asc).
 * NOTE: reads the full signup + referral lists; fine for the current scale.
 * If the list grows past ~1000, switch to a Postgres view/RPC for ranking.
 */
export async function getQueuePosition(publicId: string): Promise<number | null> {
  const id = String(publicId || '').trim()
  if (!id) return null
  const sb = getClient()

  const { data: signups, error: e1 } = await sb
    .from('signup')
    .select('public_id, created_at')
    .limit(100000)
  if (e1) throw new Error(e1.message)

  const { data: refs, error: e2 } = await sb.from('referral').select('referrer_code').limit(100000)
  if (e2) throw new Error(e2.message)

  const counts = new Map<string, number>()
  for (const r of refs ?? []) {
    const code = (r as { referrer_code: string }).referrer_code
    counts.set(code, (counts.get(code) ?? 0) + 1)
  }

  const ranked = (signups ?? [])
    .map((s) => {
      const row = s as { public_id: string; created_at: string }
      return { id: row.public_id, t: row.created_at, c: counts.get(row.public_id) ?? 0 }
    })
    .sort((a, b) => b.c - a.c || (a.t < b.t ? -1 : a.t > b.t ? 1 : 0))

  const idx = ranked.findIndex((x) => x.id === id)
  return idx === -1 ? null : idx + 1
}
