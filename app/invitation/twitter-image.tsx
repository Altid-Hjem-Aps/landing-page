import { PARTNER_INVITATION } from '@/lib/partner-invitation'
import { partnerInvitationImage } from '@/lib/partner-invitation-image'

export const alt = PARTNER_INVITATION.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return partnerInvitationImage()
}
