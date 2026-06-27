import type { Metadata } from 'next'
import InviterShare from '@/components/InviterShare'

export const metadata: Metadata = {
  title: 'Inviter venner – Altid Hjem',
  description: 'Del dit personlige link og ryk frem i køen til Altid Hjem.',
  openGraph: {
    title: 'Kom med på Altid Hjem',
    description: 'Bedre råd til hjemmet. Tilmeld dig ventelisten med mit link.',
    url: 'https://altidhjem.dk/inviter',
    siteName: 'Altid Hjem',
    type: 'website',
  },
}

const CATEGORY_ICONS: [string, string][] = [
  ['aktiv-5', 'Hjem'],
  ['aktiv-2_1', 'Forsikring'],
  ['aktiv-1', 'Ladning'],
  ['aktiv-4', 'Alarm'],
  ['aktiv-3', 'Energi'],
  ['aktiv-6', 'Mobil'],
]

export default async function InviterPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  return (
    <main
      style={{
        background: '#fdfaf4',
        minHeight: '100vh',
        fontFamily: 'var(--font-onest), "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Header — matches the email templates: dark-green bar + white logo */}
      <header style={{ background: '#163223' }}>
        <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.altidhjem.dk/altid-hjem-logo-white.svg"
            alt="Altid Hjem"
            width={88}
            height={47}
            style={{ display: 'block' }}
          />
          <div className="hidden items-center gap-1.5 sm:flex">
            {CATEGORY_ICONS.map(([file, alt]) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={file}
                src={`https://www.altidhjem.dk/icons/${file}.svg`}
                alt={alt}
                width={34}
                height={34}
                style={{ display: 'inline-block' }}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="px-6 py-12 sm:py-16">
        <InviterShare code={ref ?? ''} />
      </div>
    </main>
  )
}
