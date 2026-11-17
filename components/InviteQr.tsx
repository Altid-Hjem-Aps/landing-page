import { inviteLink } from '@/lib/invite-token'
import { PARTNER_INVITATION } from '@/lib/partner-invitation'
import { qrPath } from '@/lib/qr-path'

// The invite link as a QR code, drawn in the browser from the in-memory token:
// it never reaches the server or a QR service.
export default function InviteQr({ inviteToken }: { inviteToken: string }) {
  const { size, d } = qrPath(inviteLink(inviteToken))
  return (
    <svg
      role="img"
      aria-label={PARTNER_INVITATION.qrAlt}
      viewBox={`0 0 ${size} ${size}`}
      width={176}
      height={176}
      shapeRendering="crispEdges"
      className="mt-8 rounded-2xl"
      style={{ background: '#ffffff' }}
    >
      <path d={d} fill="#163223" />
    </svg>
  )
}
