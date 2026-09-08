import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Testimonials from '@/components/sections/Testimonials'
import FounderVideo from '@/components/sections/FounderVideo'
// DISABLED 8 Sep 2026: Altid Energi received a formal notice from the Danish
// Consumer Ombudsman (Forbrugerombudsmanden) about the running "total saved"
// counter, and asked Altid Hjem to hide it too while they work on an
// alternative. The component, ticker and tests are kept intact — re-enable by
// restoring this import and the <SavingsCounter /> below.
// import SavingsCounter from '@/components/sections/SavingsCounter'
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
        {/* <SavingsCounter /> — see note at the import above. */}
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
