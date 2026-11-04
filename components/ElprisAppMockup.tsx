'use client'

import AppScreenCard from '@/components/AppScreenCard'
import StoreBadges from '@/components/StoreBadges'
import { SCREENSHOT_CAPTION } from '@/lib/copy'
import { SEO_FRAMES } from '@/lib/screen-captures'

/**
 * App-smagsprøve til elpris-siden /hvornar-er-strommen-billigst: tekst og
 * butiksknapper ved siden af et billede af Altid Energi i appen.
 */
export default function ElprisAppMockup() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
      {/* Tekst + CTA */}
      <div className="flex-1">
        <p className="mb-3">
          Det kræver tid at holde øje med elprisen hver dag. I Altid Hjem-appen ser du elprisen
          time for time og får besked, når strømmen er billig.
        </p>
        <p className="mb-3">
          Samtidig samler appen madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik,
          ét login.
        </p>
        <p className="mb-5">Appen er gratis at hente i App Store og Google Play.</p>
        <StoreBadges position="bottom" />
      </div>

      {/* Billede fra appen */}
      <div className="shrink-0 w-full sm:w-72 flex flex-col items-center gap-3">
        <AppScreenCard frame={SEO_FRAMES.elpris} />
        <p className="text-xs text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
          {SCREENSHOT_CAPTION}
        </p>
      </div>
    </div>
  )
}
