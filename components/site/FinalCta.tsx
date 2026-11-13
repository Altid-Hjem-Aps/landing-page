import Image from 'next/image'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { FINAL, QR } from './copy'
import GetAppButton from './GetAppButton'
import Marquee from './Marquee'
import StagedNote from './StagedNote'

// Each list holds the screens twice, so one list is wider than any window and the loop never
// shows a gap. Only the very first round carries the alt texts; the rest is hidden from
// screen readers.
const screens = (hidden: boolean) =>
  [...FINAL.screens, ...FINAL.screens].map((screen, i) => {
    const repeat = hidden || i >= FINAL.screens.length
    return (
      <li key={`${screen.src}-${i}`} className="e-screen" aria-hidden={repeat && !hidden ? true : undefined}>
        <Image src={screen.src} alt={repeat ? '' : screen.alt} width={900} height={1951} sizes="(max-width: 767px) 166px, 240px" />
      </li>
    )
  })

// Where every "Hent appen" lands. On a computer the one QR code sits under the pills (from
// 1024 px with a fine pointer, CSS). Under it the app's own screens pass slowly, edge to edge.
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
        <Image src="/site/qr/app.svg" alt={QR.alt} width={74} height={74} />
        <p className="qr-line">{QR.line}</p>
      </div>
      <div data-staged="true">
        <Marquee label={FINAL.screensLabel} className="e-mq" first={screens(false)} second={screens(true)} scrollsByKey />
      </div>
      <StagedNote className="e-note" />
    </section>
  )
}
