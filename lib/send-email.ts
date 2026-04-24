import { getResend, FROM_EMAIL } from './resend'
import { waitlistConfirmation } from '@/emails/waitlist-confirmation'
import { waitlistFollowup1 } from '@/emails/waitlist-followup-1'
import { waitlistFollowup2 } from '@/emails/waitlist-followup-2'

export async function sendWaitlistConfirmation(name: string, email: string) {
  const { subject, html } = waitlistConfirmation({ name, email })
  return getResend().emails.send({ from: FROM_EMAIL, to: email, subject, html })
}

export async function sendWaitlistFollowup1(name: string, email: string) {
  const { subject, html } = waitlistFollowup1({ name, email })
  return getResend().emails.send({ from: FROM_EMAIL, to: email, subject, html })
}

export async function sendWaitlistFollowup2(name: string, email: string) {
  const { subject, html } = waitlistFollowup2({ name, email })
  return getResend().emails.send({ from: FROM_EMAIL, to: email, subject, html })
}
