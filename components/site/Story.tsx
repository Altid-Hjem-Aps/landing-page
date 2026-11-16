import { Fragment } from 'react'
import { Logo } from '@/components/Logo'
import { STORY } from './copy'
import StoryDots from './StoryDots'

// The old site's "we have done this before" block (components/sections/Trust.tsx) in this
// site's type: Altid Energi blue and Deep forest side by side, edge to edge; the quote with
// its hanging opening mark; the promise on the right, word for word; and at the bottom the two
// logos joined by dots that light up from Altid Energi towards Altid Hjem across the seam,
// placed, sized and moving as on altidhjem.dk (Thor 11/11). On a phone the halves stack: the
// Altid Energi logo ends the blue, the dots run down across the seam and the Altid Hjem logo
// opens the green. The old block's two small labels are left out, as nowhere on this site has
// them. New here: the app icon on the seam down into the FAQ.
export default function Story() {
  return (
    <section data-b="story" className="sy" aria-labelledby="sy-title">
      <div className="sy-panel" data-surface="dark">
        <div className="sy-half sy-energi">
          <blockquote className="sy-quote">
            <span className="sy-wide">{STORY.quote}</span>
            <span className="sy-phone">{STORY.phone.quote}</span>
          </blockquote>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/altidenergi-logo-white.svg" alt="Altid Energi" className="sy-logo sy-stacked" />
          <StoryDots vertical />
        </div>
        <div className="sy-half sy-hjem">
          <Logo variant="forest" className="sy-logo sy-stacked" />
          <h2 id="sy-title" className="sy-title">
            {/* One heading text; the break shows on a phone only (CSS). */}
            {STORY.phone.title.split('\n').map((part, i) => (
              <Fragment key={part}>
                {i > 0 ? <br className="sy-br" /> : null}
                {part}
                {i < STORY.phone.title.split('\n').length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h2>
          <p className="sy-body">
            <span className="sy-wide">{STORY.body}</span>
            <span className="sy-phone">{STORY.phone.body}</span>
          </p>
        </div>
        <div className="sy-bridge">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/altidenergi-logo-white.svg" alt="Altid Energi" className="sy-logo" />
          <StoryDots />
          <Logo variant="forest" className="sy-logo" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app-badge.png" alt="" width={96} height={96} className="sy-icon" />
      </div>
    </section>
  )
}
