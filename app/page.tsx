import Link from 'next/link'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WhatIs from '@/components/sections/WhatIs'
import FounderVideo from '@/components/sections/FounderVideo'
import SavingsCounter from '@/components/sections/SavingsCounter'
import Services from '@/components/sections/Services'
import HowItWorks from '@/components/sections/HowItWorks'
import Why from '@/components/sections/Why'
import Trust from '@/components/sections/Trust'
import BottomCta from '@/components/sections/BottomCta'
import { Logo } from '@/components/Logo'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatIs />
        <FounderVideo />
        <SavingsCounter />
        <Services />
        <HowItWorks />
        <Why />
        <Trust />
        <BottomCta />
      </main>
      <footer
        className="flex flex-wrap items-center justify-between gap-y-3 px-6 sm:px-10 lg:px-12 py-6 sm:py-8"
        style={{ background: 'var(--forest)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Logo className="h-8 w-auto" variant="white" />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          © 2026 Altid Hjem · Skabt af teamet bag{' '}
          <a
            href="https://altidenergi.dk"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Altid Energi
          </a>
          {' · '}
          <Link
            href="/kontakt"
            className="underline-offset-2 hover:underline"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Support
          </Link>
          {' · '}
          <Link
            href="/privatlivspolitik"
            className="underline-offset-2 hover:underline"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Privatlivspolitik
          </Link>
          {' · '}
          <Link
            href="/slet-konto"
            className="underline-offset-2 hover:underline"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Slet konto
          </Link>
        </p>
      </footer>
    </>
  )
}
