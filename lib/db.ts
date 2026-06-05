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
