import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import PartnerInvitation from '@/components/PartnerInvitation'
import { PARTNER_INVITATION } from '@/lib/partner-invitation'

// The invitation token lives in the URL fragment and never reaches the server.
// This page must not read it; instrumentation-client.ts strips it before analytics.
export const metadata: Metadata = {
  title: PARTNER_INVITATION.title,
  description: PARTNER_INVITATION.description,
  robots: { index: false },
  openGraph: {
    title: PARTNER_INVITATION.title,
    description: PARTNER_INVITATION.description,
    url: 'https://altidhjem.dk/invitation',
    siteName: 'Altid Hjem',
    locale: 'da_DK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PARTNER_INVITATION.title,
    description: PARTNER_INVITATION.description,
  },
}

export default function InvitationPage() {
  return (
    <main
      style={{
        background: '#fdfaf4',
        minHeight: '100vh',
        fontFamily: 'var(--font-onest), "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <header className="px-6" style={{ background: '#163223' }}>
        <div className="mx-auto flex max-w-md items-center py-5">
          <Link href="/" aria-label="Altid Hjem" className="shrink-0">
            <Logo className="h-11 w-auto" variant="forest" />
          </Link>
        </div>
      </header>

      <div className="px-6 py-12 sm:py-16">
        <PartnerInvitation />
      </div>
    </main>
  )
}
