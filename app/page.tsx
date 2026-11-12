import type { Metadata } from 'next'
import { META, NAV } from '@/components/site/copy'
import FaqSection from '@/components/site/FaqSection'
import FinalCta from '@/components/site/FinalCta'
import { dmSans } from '@/components/site/fonts'
import Hero from '@/components/site/Hero'
import LeavePopup from '@/components/site/LeavePopup'
import { jsonLdScript } from '@/components/site/jsonLd'
import MadDark from '@/components/site/MadDark'
import Steps from '@/components/site/Steps'
import Story from '@/components/site/Story'
import Zoomer from '@/components/site/Zoomer'
import { MotionPrefs } from '@/components/site/MotionPrefs'
import PauseButton from '@/components/site/PauseButton'
import Privacy from '@/components/site/Privacy'
import Proof from '@/components/site/Proof'
import Reveal from '@/components/site/Reveal'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'
import Values from '@/components/site/Values'
import Blog from '@/components/sections/Blog'
import { APP_STORE_ID } from '@/lib/store-links'
import './site.css'

const IMAGE = { url: '/opengraph-image.png', width: 1200, height: 630, alt: META.imageAlt }

// Full Open Graph and Twitter here: nested objects replace the layout's, they do not merge.
// itunes: Safari on an iPhone shows Apple's own app banner on this page only.
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
  itunes: { appId: APP_STORE_ID },
}

export default function Home() {
  return (
    <div className={`site ${dmSans.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript() }} />
      <MotionPrefs>
        <a href="#indhold" className="skip">
          {NAV.skip}
        </a>
        <SiteNav getApp />
        <main id="indhold">
          <Hero />
          <Proof />
          <MadDark />
          <Steps />
          <Values />
          <Privacy />
          <Zoomer>
            <Story />
            <FaqSection />
          </Zoomer>
          <Blog />
          <FinalCta />
        </main>
        <PauseButton />
        <LeavePopup />
      </MotionPrefs>
      <SiteFooter />
      <Reveal />
    </div>
  )
}
