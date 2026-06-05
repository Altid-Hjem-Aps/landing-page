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
