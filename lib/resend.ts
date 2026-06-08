import { Resend } from 'resend'

export const FROM_EMAIL = 'Altid Hjem <hej@altidhjem.dk>'

// "Altid Hjem – Venteliste" audience (overridable via env).
export const AUDIENCE_ID =
  process.env.RESEND_AUDIENCE_ID ?? 'b9e1fdb0-277b-4613-972f-6e620018be79'

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set')
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Mirror an unsubscribe/resubscribe into the Resend Audience so the dashboard
 * stays in sync with our own Supabase source of truth. Best-effort — a failure
 * here never breaks the user-facing unsubscribe flow.
 */
export async function setResendSubscription(
  email: string,
  unsubscribed: boolean,
): Promise<void> {
  const clean = String(email || '').trim().toLowerCase()
  if (!clean) return
  try {
    await getResend().contacts.update({
      audienceId: AUDIENCE_ID,
      email: clean,
      unsubscribed,
    })
  } catch (e) {
    console.error('Resend subscription sync failed', e)
  }
}

/**
 * Add a new signup to the Resend Audience so the dashboard/list stays in sync
 * with reality. Idempotent: if the contact already exists, we update it instead
 * of failing. Best-effort — never blocks the signup flow.
 */
export async function addAudienceContact(opts: {
  email: string
  firstName?: string
  publicId?: string
}): Promise<void> {
  const email = String(opts.email || '').trim().toLowerCase()
  const key = process.env.RESEND_API_KEY
  if (!email || !key) return
  const properties: Record<string, string | number> = {
    status: 'waitlisted',
    referral_count: 0,
    progress_pct: 0,
    signup_date: new Date().toISOString().slice(0, 10),
  }
  if (opts.publicId) {
    properties.public_id = opts.publicId
    // Store the FULL code — invite links use the whole public_id, not a slice.
    properties.referral_code = opts.publicId
  }
  const body = JSON.stringify({
    email,
    first_name: opts.firstName,
    unsubscribed: false,
    properties,
  })
  const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
  try {
    const res = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers,
      body,
    })
    // If the contact already exists, POST errors — fall back to an update.
    if (!res.ok) {
      await fetch(
        `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`,
        { method: 'PATCH', headers, body },
      )
    }
  } catch (e) {
    console.error('add audience contact failed', e)
  }
}

/**
 * Update a contact's custom Resend Audience properties (referral_count,
 * progress_pct, queue_position, …) so the dashboard reflects live progress.
 * Best-effort — never blocks the signup/referral flow.
 */
export async function syncContactTags(
  email: string,
  props: Record<string, string | number | null>,
): Promise<void> {
  const clean = String(email || '').trim().toLowerCase()
  const key = process.env.RESEND_API_KEY
  if (!clean || !key) return
  try {
    await fetch(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts/${encodeURIComponent(clean)}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: props }),
      },
    )
  } catch (e) {
    console.error('Resend tag sync failed', e)
  }
}
