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
import Footer from '@/components/Footer'

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
      <Footer />
    </>
  )
}
