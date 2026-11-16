import { Fragment } from 'react'
import { STORE_ANCHOR } from '@/lib/store-links'
import { FINAL } from './copy'
import FinalGallery from './FinalGallery'
import FinalPills from './FinalPills'
import { keepBrands } from './brand'

// Where every "Hent appen" lands: the heading, the line and the store pills in the middle of
// Thor's gallery (FinalGallery). On a computer the pills open into the one QR code (FinalPills).
// The anchor is the text, so the heading shows above the pills on arrival. The line breaks where
// Thor broke it on a computer and runs on on a phone (CSS).
/** "Hent Altid Hjem i dag" as three lines: the words before the brand, the brand, the rest. */
function titleLines(title: string): string[] {
  const at = title.indexOf('Altid Hjem')
  if (at < 0) return [title]
  return [title.slice(0, at), 'Altid Hjem', title.slice(at + 'Altid Hjem'.length)].map((part) => part.trim()).filter(Boolean)
}

export default function FinalCta() {
  return (
    <section data-b="final" className="sec e">
      <FinalGallery>
        <div id={STORE_ANCHOR} className="e-text">
          {/* On a phone the heading takes three lines, as in Thor's Figma frame (CSS .e-tl). */}
          <h2 className="t-h2" data-reveal>
            {titleLines(FINAL.title).map((line, i) => (
              <Fragment key={line}>
                {i > 0 ? ' ' : null}
                <span className="e-tl">{keepBrands(line)}</span>
              </Fragment>
            ))}
          </h2>
          <p className="t-body e-line" data-reveal>
            {FINAL.body[0]} <br className="e-break" />
            {FINAL.body[1]}
          </p>
          <FinalPills />
        </div>
      </FinalGallery>
    </section>
  )
}
