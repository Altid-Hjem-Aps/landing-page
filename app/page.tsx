import type { Metadata } from 'next'
import AppBar from '@/components/site/AppBar'
import { META, NAV } from '@/components/site/copy'
import FaqSection from '@/components/site/FaqSection'
import FinalCta from '@/components/site/FinalCta'
import { dmSans } from '@/components/site/fonts'
import Hero from '@/components/site/Hero'
import { jsonLdScript } from '@/components/site/jsonLd'
import Love from '@/components/site/Love'
import MadDark from '@/components/site/MadDark'
import Steps from '@/components/site/Steps'
import WorksWith from '@/components/site/WorksWith'
import { MotionPrefs } from '@/components/site/MotionPrefs'
import PauseButton from '@/components/site/PauseButton'
import Privacy from '@/components/site/Privacy'
import Proof from '@/components/site/Proof'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'
import Blog from '@/components/sections/Blog'
import './site.css'

const IMAGE = { url: '/opengraph-image.png', width: 1200, height: 630, alt: META.imageAlt }

// Full Open Graph and Twitter here: nested objects replace the layout's, they do not merge.
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: 'https://www.altidhjem.dk' },
  openGraph: {
    title: META.title,
    description: META.description,
    url: 'https://www.altidhjem.dk',
    siteName: 'Altid Hjem',
    locale: 'da_DK',
    type: 'website',
    images: [IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: META.title,
    description: META.description,
    images: [IMAGE],
  },
}

export default function Home() {
  return (
    <div className={`site ${dmSans.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript() }} />
      <MotionPrefs>
        <a href="#indhold" className="skip">
          {NAV.skip}
        </a>
        <SiteNav />
        <main id="indhold">
          <Hero />
          <WorksWith />
          <Proof />
          <MadDark />
          <Steps />
          <Privacy />
          <Love />
          <Blog />
          <FaqSection />
          <FinalCta />
        </main>
        <PauseButton />
        <AppBar />
      </MotionPrefs>
      <SiteFooter />
    </div>
  )
}
