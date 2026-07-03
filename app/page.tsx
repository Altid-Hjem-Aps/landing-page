import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Testimonials from '@/components/sections/Testimonials'
import FounderVideo from '@/components/sections/FounderVideo'
import SavingsCounter from '@/components/sections/SavingsCounter'
import Services from '@/components/sections/Services'
import HowItWorks from '@/components/sections/HowItWorks'
// The "one home, too many bills" story — the bills→app-icon→phone animation.
import WhatIs from '@/components/sections/WhatIs'
import Trust from '@/components/sections/Trust'
import Faq from '@/components/sections/Faq'
import Blog from '@/components/sections/Blog'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Testimonials />
        <FounderVideo />
        <SavingsCounter />
        <Services />
        <WhatIs />
        <HowItWorks />
        <Trust />
        <Faq />
        <Blog />
        <BottomCta />
      </main>
      <Footer />
    </>
  )
}
