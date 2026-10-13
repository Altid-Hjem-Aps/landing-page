'use client'

import { useEffect, useState } from 'react'
import InviterShare from '@/components/InviterShare'

function PartnerInviteFallback() {
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 style={{ color: '#000000' }} className="text-3xl font-normal leading-tight sm:text-4xl">
        Åbn invitationen i Altid Hjem
      </h1>
      <p style={{ color: '#6f6a61' }} className="mt-3 text-base leading-relaxed">
        Installér eller åbn appen. Gå derefter tilbage til beskeden og tryk på invitationslinket igen.
      </p>
      <div className="mt-8 grid gap-3">
        <a
          href="https://apps.apple.com/dk/app/altid-hjem/id6794330094"
          className="rounded-[20px] bg-[#163223] px-5 py-3.5 text-center text-base font-medium text-white"
        >
          Hent i App Store
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=dk.altidhjem.app"
          className="rounded-[20px] border border-[#163223] px-5 py-3.5 text-center text-base font-medium text-[#163223]"
        >
          Hent i Google Play
        </a>
      </div>
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
