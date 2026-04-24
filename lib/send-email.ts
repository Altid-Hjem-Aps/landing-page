import { getResend, FROM_EMAIL } from './resend'

export async function sendWaitlistConfirmation(name: string, email: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    template: { id: 'waitlist-confirmation', variables: { FIRST_NAME: name.split(' ')[0] } },
  })
}

export async function sendWaitlistFollowup1(name: string, email: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    template: { id: 'waitlist-followup-1', variables: { FIRST_NAME: name.split(' ')[0] } },
  })
}

export async function sendWaitlistFollowup2(name: string, email: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    template: { id: 'waitlist-followup-2', variables: { FIRST_NAME: name.split(' ')[0] } },
  })
}
