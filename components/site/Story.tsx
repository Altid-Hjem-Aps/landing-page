import { Logo } from '@/components/Logo'
import { STORY } from './copy'
import StoryDots from './StoryDots'

// The old site's "we have done this before" block in the new skin: one rounded panel split
// in Altid Energi blue and Deep forest, the quote with its hanging opening mark on the left,
// the promise on the right, and the two logos joined by a line of dots across the seam.
export default function Story() {
  return (
    <section data-b="story" className="sec sy" aria-labelledby="sy-title">
      <div className="sy-panel" data-surface="dark">
        <div className="sy-half sy-energi">
          <p className="sy-pill">{STORY.proof}</p>
          <blockquote className="sy-quote">{STORY.quote}</blockquote>
        </div>
        <div className="sy-half sy-hjem">
          <p className="sy-pill">{STORY.eyebrow}</p>
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
      </div>
    </section>
  )
}
