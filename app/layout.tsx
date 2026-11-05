import type { Metadata } from 'next'
import { DM_Sans, Onest, Afacad } from 'next/font/google'
import './globals.css'
import ResetScrollOnLoad from '@/components/ResetScrollOnLoad'
import CookieBanner from '@/components/CookieBanner'
import { MOTION_SCRIPT, PLATFORM_SCRIPT } from '@/lib/platform'

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-onest',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
})

// Afacad is the brand font for the subbrand wordmarks ("energi", "mobil", …)
// in the service-card logo lockups.
const afacad = Afacad({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-afacad',
})

const TITLE = 'Altid Hjem: hele hjemmet i én app'
const DESCRIPTION = 'Få overblik over jeres mad, strøm, forsikring og økonomi. Hent Altid Hjem gratis i App Store og Google Play.'

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
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
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
    // suppressHydrationWarning: the head scripts below set data-platform,
    // data-motion and the js class on <html> before React hydrates.
    <html
      lang="da"
      data-scroll-behavior="smooth"
      className={`${onest.variable} ${dmSans.variable} ${afacad.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Raw scripts, not next/script: they must run before first paint so
            the store pills are in platform order and the pins are on from the
            start. */}
        <script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body>
        <ResetScrollOnLoad />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
