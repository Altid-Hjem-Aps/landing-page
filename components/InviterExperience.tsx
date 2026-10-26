'use client'

import { useEffect, useState } from 'react'
import InviterShare from '@/components/InviterShare'
import StoreButtons from '@/components/StoreButtons'

function PartnerInviteFallback() {
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 style={{ color: '#000000' }} className="text-3xl font-normal leading-tight sm:text-4xl">
        Åbn invitationen i Altid Hjem
      </h1>
      <p style={{ color: '#6f6a61' }} className="mt-3 text-base leading-relaxed">
        Installér eller åbn appen. Gå derefter tilbage til beskeden og tryk på invitationslinket igen.
      </p>
      <StoreButtons />
    </div>
  )
}

export default function InviterExperience({ code }: { code: string }) {
  const [isPartnerInvite, setIsPartnerInvite] = useState(false)

  useEffect(() => {
    if (!window.__altiPartnerInviteFallback) return
    delete window.__altiPartnerInviteFallback
    setIsPartnerInvite(true)
  }, [])

  return isPartnerInvite ? <PartnerInviteFallback /> : <InviterShare code={code} />
}
