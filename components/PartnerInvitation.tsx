'use client'

import InviteQr from '@/components/InviteQr'
import StoreButtons from '@/components/StoreButtons'
import { PARTNER_INVITATION } from '@/lib/partner-invitation'
import { useInviteToken, usePlatform } from '@/lib/use-invite-device'

export default function PartnerInvitation() {
  const platform = usePlatform()
  const inviteToken = useInviteToken()
  const { next } = PARTNER_INVITATION

  // A computer with the link scans it over to the phone; the stores are no use there.
  const scan = platform === 'desktop' && inviteToken !== null
  const nextLine =
    platform === null
      ? null
      : platform === 'desktop'
        ? scan
          ? next.desktopScan
          : next.desktopNoLink
        : platform === 'android' && inviteToken !== null
          ? next.androidCarried
          : next.tapAgain

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 style={{ color: '#000000' }} className="text-3xl font-normal leading-tight sm:text-4xl">
        {PARTNER_INVITATION.heading}
      </h1>
      <p style={{ color: '#6f6a61' }} className="mt-3 text-base leading-relaxed">
        {PARTNER_INVITATION.intro}
        {nextLine && ` ${nextLine}`}
      </p>
      <p style={{ color: '#163223' }} className="mt-3 text-base font-medium leading-relaxed">
        {PARTNER_INVITATION.privacy}
      </p>
      {scan ? <InviteQr inviteToken={inviteToken} /> : <StoreButtons />}
    </div>
  )
}
