import type { Metadata } from 'next'
import { META, NAV, LEAVE, OFFER_POPUP } from '@/components/site/copy'
import CopyEditGate from '@/components/site/CopyEditGate'
import EngagementTracker from '@/components/site/EngagementTracker'
import FaqSection from '@/components/site/FaqSection'
import FinalCta from '@/components/site/FinalCta'
import { dmSans } from '@/components/site/fonts'
import Hero from '@/components/site/Hero'
import LeavePopup from '@/components/site/LeavePopup'
import OfferPopup from '@/components/site/OfferPopup'
import { readUserCount, usersPlus, usersOver } from '@/lib/user-count'
import { jsonLdScript } from '@/components/site/jsonLd'
import MadDark from '@/components/site/MadDark'
import Steps from '@/components/site/Steps'
import Story from '@/components/site/Story'
import Zoomer from '@/components/site/Zoomer'
import { MotionPrefs } from '@/components/site/MotionPrefs'
import Privacy from '@/components/site/Privacy'
import Proof from '@/components/site/Proof'
import Reveal from '@/components/site/Reveal'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'
import GetAppSticky from '@/components/site/GetAppSticky'
import EnergiSticky from '@/components/site/EnergiSticky'
import Values from '@/components/site/Values'
import Blog from '@/components/sections/Blog'
import { APP_STORE_ID } from '@/lib/store-links'
import { SITE_IMAGE } from '@/lib/site-image'
import './site.css'

const IMAGE = SITE_IMAGE

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

export default async function Home() {
  // How many have the app, read once here for the reviews heading and the leave popup; the
  // hero's line reads it in AppRating (lib/user-count.ts caches the read for an hour).
  const users = await readUserCount()
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
          <Proof users={users} />
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
        <GetAppSticky />
        <EnergiSticky />
        <CopyEditGate />
        <EngagementTracker />
        <LeavePopup proof={LEAVE.proof.replace('{over}', usersOver(users))} />
        {/* After about 30 % of the page: the Energi block with its offer card is behind the reader. */}
        <OfferPopup after={0.3} proof={OFFER_POPUP.proof.replace('{plus}', usersPlus(users))} />
      </MotionPrefs>
      <SiteFooter />
      <Reveal />
    </div>
  )
}
