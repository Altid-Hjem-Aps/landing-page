import { STORE_ANCHOR } from '@/lib/store-links'
import { FINAL } from './copy'
import FinalGallery from './FinalGallery'
import FinalPills from './FinalPills'
import StagedNote from './StagedNote'

// Where every "Hent appen" lands: the heading, the line and the store pills in the middle of a
// collage of app screens and photos (FinalGallery). On a computer the pills open into the one
// QR code (FinalPills). The anchor is the text, so the heading shows above the pills on arrival.
export default function FinalCta() {
  return (
    <section data-b="final" className="sec e">
      <FinalGallery>
        <div id={STORE_ANCHOR} className="e-text">
          <h2 className="t-h2" data-reveal>
            {FINAL.title}
          </h2>
          <p className="t-body e-line" data-reveal>
            {FINAL.body}
          </p>
          <FinalPills />
        </div>
      </FinalGallery>
      <StagedNote className="e-note" />
    </section>
  )
}
