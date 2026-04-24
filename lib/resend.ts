import { Resend } from 'resend'

export const FROM_EMAIL = 'Altid Hjem <hej@altidhjem.dk>'

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set')
  return new Resend(process.env.RESEND_API_KEY)
}
