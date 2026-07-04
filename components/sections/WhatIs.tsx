import EtHjemStage from './why/EtHjemStage'
import { SAVINGS_DISCLAIMER } from '@/lib/copy'
import { H2, EYEBROW, BODY, FINE_PRINT } from '@/lib/typography'

// The full storyboard lives in why/cards.ts; the self-running stage (clock +
// scenery) is why/EtHjemStage.tsx — shared with the exit-intent dialog. This
// section supplies the heading, the stage's box and the legal fine print.

export default function WhatIs() {
  return (
    <section
      className="relative isolate pt-20 sm:pt-28 pb-8 sm:pb-10 px-3 sm:px-10 lg:px-12"
      style={{ background: '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading + body */}
        {/* max-sm padding: section px is only 12px on phones — +16px here gives
            the text the same 28px edge as the Trust section's boxes. */}
        <div className="text-center mx-auto mb-8 sm:mb-10 max-sm:px-4" style={{ maxWidth: 1040 }}>
          <p className={`${EYEBROW} mb-4`} style={{ color: '#6f6a61' }}>
            Problematikken, vi alle kender
          </p>
          <h2 className={`${H2} mb-6`} style={{ color: '#163223' }}>
            Ét hjem. Alt for mange regninger.
          </h2>
          {/* Body width = the heading's rendered text width (15.26 × the H2
              font-size, which is one line at every breakpoint) so the block
              reads as one column. Mirrors the H2 clamp in lib/typography.ts. */}
          <p className={`mx-auto max-lg:text-left ${BODY}`} style={{ color: '#6f6a61', maxWidth: 'calc(15.26 * clamp(28px, 22.4px + 1.44vw, 50px))' }}>
            Strøm hos én leverandør, mobil hos en anden, forsikring hos en tredje. Forskellige vilkår, forskellige regninger og information spredt på mail, papir og i e-Boks. Uden ét samlet overblik. Og med skjulte gebyrer, der stille og roligt vokser sig større. <span style={{ color: '#163223' }}>Det ændrer vi nu med Altid Hjem. Altid Hjem samler hjemmets faste udgifter ét sted og optimerer dem løbende, så du kun betaler for det, du faktisk har behov for.</span>
          </p>
        </div>

        {/* ALL BREAKPOINTS: one CENTERED stage — the sources scene plays
            around the centre, the pile implodes into that centre, the app
            icon appears in the same spot and the phone opens over it. On
            mobile the same composition is stacked/compressed, not split.
            The negative margins eat part of the stage's built-in headroom
            (content is centred in the box) so the scene sits near the text
            above and the section below. */}
        <div className="relative mx-auto -mt-4 sm:-mt-10 -mb-4 sm:-mb-10" style={{ height: 'clamp(620px,calc(595px + 6.5vw),720px)' }}>
          <EtHjemStage />
        </div>

        {/* The mt offsets the stage's negative bottom margin above. */}
        <p className={`${FINE_PRINT} text-center mx-auto mt-8 sm:mt-14 max-w-[560px] max-sm:px-4`} style={{ color: '#6f6a61' }}>
          {SAVINGS_DISCLAIMER}
        </p>

      </div>
    </section>
  )
}
