import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.css'
import ResetScrollOnLoad from '@/components/ResetScrollOnLoad'

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-onest',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://altidhjem.dk'),
  alternates: { canonical: './' },
  title: 'Altid Hjem – Skriv dig på ventelisten',
  description: 'Altid Hjem samler hjemmets faste udgifter i én app – ét overblik, ét login, én regning.',
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
    <html lang="da" className={onest.variable}>
      <body>
        <ResetScrollOnLoad />
        {children}
      </body>
    </html>
  )
}
