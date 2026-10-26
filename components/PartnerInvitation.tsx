import StoreButtons from '@/components/StoreButtons'
import { PARTNER_INVITATION } from '@/lib/partner-invitation'

export default function PartnerInvitation() {
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 style={{ color: '#000000' }} className="text-3xl font-normal leading-tight sm:text-4xl">
        {PARTNER_INVITATION.heading}
      </h1>
      <p style={{ color: '#6f6a61' }} className="mt-3 text-base leading-relaxed">
        {PARTNER_INVITATION.body}
      </p>
      <StoreButtons />
    </div>
  )
}
