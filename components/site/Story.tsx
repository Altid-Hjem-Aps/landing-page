import { Fragment } from 'react'
import { Logo } from '@/components/Logo'
import { STORY } from './copy'
import StoryDots from './StoryDots'

// The old site's "we have done this before" block, rebuilt one to one from
// components/sections/Trust.tsx as Thor designed it (11/11): Altid Energi blue and Deep forest
// side by side, edge to edge; the quote in the regular weight with its hanging opening mark
// and his letter-spacing per line; the promise on the right; and at the bottom the two logos
// joined by dots that light up from Altid Energi towards Altid Hjem across the seam. On a
// phone the halves stack: the Altid Energi logo ends the blue, the dots run down across the
// seam and the Altid Hjem logo opens the green. The old block's two small labels are left out,
// as nowhere on this site has them. New here: the app icon on the seam down into the FAQ.
export default function Story() {
  const last = STORY.quoteLines.length - 1
  return (
    <section data-b="story" className="sy" aria-labelledby="sy-title">
      <div className="sy-panel" data-surface="dark">
        <div className="sy-half sy-energi">
          <blockquote className="sy-quote">
            {STORY.quoteLines.map((line, i) => (
              <Fragment key={line.text}>
                <span style={{ letterSpacing: line.tracking }}>
                  {line.text}
                  {i < last ? ' ' : ''}
                </span>
                {i < last ? <br className="sy-br" /> : null}
              </Fragment>
            ))}
          </blockquote>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/altidenergi-logo-white.svg" alt="Altid Energi" className="sy-logo sy-stacked" />
          <StoryDots vertical />
        </div>
        <div className="sy-half sy-hjem">
          <Logo variant="forest" className="sy-logo sy-stacked" />
          <h2 id="sy-title" className="sy-title">
            {STORY.title}
          </h2>
          <p className="sy-body">{STORY.body}</p>
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
