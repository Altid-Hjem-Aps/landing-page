import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.css'

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-onest',
})

export const metadata: Metadata = {
  title: 'Altid Hjem – Skriv dig på ventelisten',
  description: 'Altid Hjem samler hjemmets faste udgifter i én app, med ét login og én regning – så du sparer tid og penge.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={onest.variable}>
      <body>{children}</body>
    </html>
  )
}
