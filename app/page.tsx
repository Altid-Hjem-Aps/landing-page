import Nav from '@/components/Nav'
import Hero from '@/components/forside/Hero'
import Services from '@/components/forside/Services'
import Reassurance from '@/components/forside/Reassurance'
import Faq from '@/components/forside/Faq'
import BottomCta from '@/components/forside/BottomCta'
import Blog, { type BlogCategory } from '@/components/sections/Blog'
import Footer from '@/components/Footer'

// Blog posts on the front page: only the categories of services that are in
// the app (plus the general overview posts). Mobil, Opladning and Alarm posts
// stay on the SEO side.
const LIVE_BLOG_CATEGORIES: readonly BlogCategory[] = ['Energi', 'Forsikring', 'Overblik']

// The launch front page (2 Nov 2026): the Altid Hjem app and the four
// services live in app release 1.0, with the store badges as the only primary
// call to action. All copy is in lib/forside-copy.ts.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Reassurance />
        <Faq />
        <Blog categories={LIVE_BLOG_CATEGORIES} />
        <BottomCta />
      </main>
      <Footer />
    </>
  )
}
