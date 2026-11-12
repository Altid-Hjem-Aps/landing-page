import Image from 'next/image'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { FINAL, QR } from './copy'
import GetAppButton from './GetAppButton'
import StagedNote from './StagedNote'

// Where every "Hent appen" lands. On a computer the two QR codes sit under the pills
// (from 1024 px with a fine pointer, CSS), the way the hero's card shows them, but still.
export default function FinalCta() {
  return (
    <section data-b="final" className="sec e">
      <h2 className="t-h2" data-reveal>
        {FINAL.title}
      </h2>
      <p className="t-body e-line" data-reveal>
        {FINAL.body}
      </p>
      <div id={STORE_ANCHOR} className="e-pills">
        <StoreBadges position="bottom" variant="cream" size="lg" className="store-row justify-center" />
        <GetAppButton position="bottom" />
      </div>
      <div className="e-qr">
        <figure>
          <Image src="/site/qr/app-store.svg" alt={QR.appStoreAlt} width={57} height={57} />
          <figcaption>{QR.appStore}</figcaption>
        </figure>
        <figure>
          <Image src="/site/qr/google-play.svg" alt={QR.googlePlayAlt} width={57} height={57} />
          <figcaption>{QR.googlePlay}</figcaption>
        </figure>
        <p className="qr-line">{QR.line}</p>
      </div>
      <div className="e-lay" data-staged="true">
        <Image src="/site/render/flatlay.webp" alt={FINAL.alt} width={2160} height={920} sizes="(max-width: 767px) 975px, 100vw" />
      </div>
      <StagedNote className="e-note" />
    </section>
  )
}
