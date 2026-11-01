import type { Metadata } from 'next'
import DelShare from '@/components/DelShare'
import { sanitizeVia } from '@/lib/share-page'

// Share page for people who already use Altid Hjem (linked from the welcome
// mail with ?via=hjem-welcome). Not for search: noindex.
export const metadata: Metadata = {
  title: 'Del Altid Hjem',
  description: 'Send Altid Hjem videre til en ven eller din partner. Det er gratis at komme i gang.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Del Altid Hjem',
    description: 'Send Altid Hjem videre til en ven eller din partner. Det er gratis at komme i gang.',
    url: 'https://www.altidhjem.dk/del',
    siteName: 'Altid Hjem',
    type: 'website',
  },
}

export default async function DelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { via } = await searchParams
  return (
    <main
      style={{
        background: '#fdfaf4',
        minHeight: '100vh',
        fontFamily: 'var(--font-onest), "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Same header as /inviter: dark green bar with the white logo. */}
      <header style={{ background: '#163223' }}>
        <div className="mx-auto flex max-w-xl items-center px-6 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.altidhjem.dk/altid-hjem-logo-white.svg"
            alt="Altid Hjem"
            width={88}
            height={47}
            style={{ display: 'block' }}
          />
        </div>
      </header>

      <div className="px-4 py-10 sm:px-6 sm:py-16">
        <DelShare via={sanitizeVia(via)} />
      </div>
    </main>
  )
}
