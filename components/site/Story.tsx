import { Logo } from '@/components/Logo'
import { STORY } from './copy'
import StoryDots from './StoryDots'

// The old site's "we have done this before" block in the new type, edge to edge as it was:
// Altid Energi blue and Deep forest side by side, the quote with its hanging opening mark on
// the left, the promise on the right, the two logos joined by dots across the seam, and the
// app icon sitting on the seam down into the FAQ below.
export default function Story() {
  return (
    <section data-b="story" className="sy" aria-labelledby="sy-title">
      <div className="sy-panel" data-surface="dark">
        <div className="sy-half sy-energi">
          <blockquote className="sy-quote">{STORY.quote}</blockquote>
        </div>
        <div className="sy-half sy-hjem">
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
