import type { Metadata } from 'next'
import { Onest, Afacad } from 'next/font/google'
import './globals.css'
import ResetScrollOnLoad from '@/components/ResetScrollOnLoad'
import CookieBanner from '@/components/CookieBanner'
import { PLATFORM_SCRIPT } from '@/lib/platform'

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-onest',
})

// Afacad is the brand font for the subbrand wordmarks ("energi", "mobil", …)
// in the service-card logo lockups.
const afacad = Afacad({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-afacad',
})

const TITLE = 'Altid Hjem: hele hjemmets økonomi i én app'
const DESCRIPTION = 'Altid Hjem samler hjemmets faste udgifter i én app: ét overblik og ét login. Hent appen gratis i App Store og Google Play.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.altidhjem.dk'),
  alternates: { canonical: './' },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.altidhjem.dk',
    siteName: 'Altid Hjem',
    locale: 'da_DK',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/icon.svg', type: 'image/svg+xml' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior: opt-in so Next keeps smooth scrolling for anchor
    // jumps but disables it during route transitions (silences the Next 15+
    // console warning).
    // suppressHydrationWarning: the head script below sets data-platform on
    // <html> before React hydrates.
    <html
      lang="da"
      data-scroll-behavior="smooth"
      className={`${onest.variable} ${afacad.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* A raw script, not next/script: it must run before first paint so
            the store pills are in platform order from the start. */}
        <script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }} />
      </head>
      <body>
        <ResetScrollOnLoad />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
