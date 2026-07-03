import type { Metadata } from 'next'
import { Onest, Afacad } from 'next/font/google'
import './globals.css'
import ResetScrollOnLoad from '@/components/ResetScrollOnLoad'
import ExitIntentModal from '@/components/ExitIntentModal'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://altidhjem.dk'),
  alternates: { canonical: './' },
  title: 'Altid Hjem – Skriv dig på ventelisten',
  description: 'Altid Hjem samler hjemmets faste udgifter i én app – ét overblik, ét login, én regning.',
  openGraph: {
    title: 'Altid Hjem – Skriv dig på ventelisten',
    description: 'Altid Hjem samler hjemmets faste udgifter i én app – ét overblik, ét login, én regning.',
    url: 'https://altidhjem.dk',
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
    <html lang="da" data-scroll-behavior="smooth" className={`${onest.variable} ${afacad.variable}`}>
      <body>
        <ResetScrollOnLoad />
        {children}
        <ExitIntentModal />
      </body>
    </html>
  )
}
