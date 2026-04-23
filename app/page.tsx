import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WhatIs from '@/components/sections/WhatIs'
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
        <Logo className="h-8 w-auto text-white" />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © 2025 Altid Hjem · Skabt af teamet bag Altid Energi
        </p>
      </footer>
    </>
  )
}
