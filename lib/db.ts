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
export async function mirrorSignup(publicId: string, createdAt?: string): Promise<void> {
  const id = String(publicId || '').trim()
  if (!id) return
  const { error } = await getClient()
    .from('signup')
    .upsert(
      { public_id: id, created_at: createdAt ?? new Date().toISOString() },
      { onConflict: 'public_id', ignoreDuplicates: true },
    )
  if (error) throw new Error(error.message)
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
