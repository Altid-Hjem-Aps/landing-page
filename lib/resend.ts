import { Resend } from 'resend'

// Switch to hej@altidhjem.dk once DNS propagates (~24h from Simply.com setup)
export const FROM_EMAIL = 'Altid Hjem <onboarding@resend.dev>'

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set')
  return new Resend(process.env.RESEND_API_KEY)
}
