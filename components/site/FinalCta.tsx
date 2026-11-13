import { STORE_ANCHOR } from '@/lib/store-links'
import { FINAL } from './copy'
import FinalGallery from './FinalGallery'
import FinalPills from './FinalPills'

// Where every "Hent appen" lands: the heading, the line and the store pills in the middle of
// Thor's gallery (FinalGallery). On a computer the pills open into the one QR code (FinalPills).
// The anchor is the text, so the heading shows above the pills on arrival. The line breaks where
// Thor broke it on a computer and runs on on a phone (CSS).
export default function FinalCta() {
  return (
    <section data-b="final" className="sec e">
      <FinalGallery>
        <div id={STORE_ANCHOR} className="e-text">
          <h2 className="t-h2" data-reveal>
            {FINAL.title}
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
