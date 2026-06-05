import { getResend, FROM_EMAIL } from './resend'

// 2026-05-27 at 10:00 CEST = 08:00 UTC
const RELEASE_SEND_TIME = new Date('2026-05-27T08:00:00Z')

function firstName(name: string) {
  return name.split(' ')[0]
}

function getNurtureScheduledAt(signupDate: Date): string | null {
  const signupDay = new Date(signupDate)
  signupDay.setUTCHours(0, 0, 0, 0)

  const releaseDay = new Date('2026-05-27T00:00:00Z')
  const daysUntilRelease = Math.round(
    (releaseDay.getTime() - signupDay.getTime()) / 86_400_000,
  )

  if (daysUntilRelease <= 0) return null

  const offset = Math.ceil(daysUntilRelease / 2)
  const nurtureDate = new Date(signupDay)
  nurtureDate.setUTCDate(nurtureDate.getUTCDate() + offset)
  nurtureDate.setUTCHours(8, 0, 0, 0) // 10:00 CEST

  if (nurtureDate >= RELEASE_SEND_TIME) return null

  return nurtureDate.toISOString()
}

export async function sendWaitlistConfirmation(name: string, email: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    template: {
      id: 'waitlist-confirmation',
      variables: { first_name: firstName(name) },
    },
  })
}

export async function sendReferralProgress(
  name: string,
  email: string,
  vars: { referralCount: number; position: number; progressPct: number; inviteUrl: string },
) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    template: {
      id: 'referral-progress',
      variables: {
        first_name: firstName(name),
        referral_count: vars.referralCount,
        position: vars.position,
        progress_pct: vars.progressPct,
        invite_url: vars.inviteUrl,
        invite_url_encoded: encodeURIComponent(vars.inviteUrl),
      },
    },
  })
}

export async function scheduleReleaseEmail(name: string, email: string) {
  if (new Date() >= RELEASE_SEND_TIME) return null

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    scheduledAt: RELEASE_SEND_TIME.toISOString(),
    template: {
      id: 'waitlist-batch-rollout',
      variables: { first_name: firstName(name) },
    },
  })
}

// Nurture email — wired in once template is designed.
export async function scheduleNurtureEmail(
  name: string,
  email: string,
  signupDate: Date,
): Promise<null> {
  const scheduledAt = getNurtureScheduledAt(signupDate)
  if (!scheduledAt) return null
  // TODO: uncomment once waitlist-nurture template is synced to Resend
  // return getResend().emails.send({
  //   from: FROM_EMAIL,
  //   to: email,
  //   scheduledAt,
  //   template: { id: 'waitlist-nurture', variables: { first_name: firstName(name) } },
  // })
  return null
}
