import Image from 'next/image'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { FINAL } from './copy'
import StagedNote from './StagedNote'

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
        <StoreBadges position="bottom" variant="cream" size="lg" className="justify-center" />
      </div>
      <div className="e-lay" data-staged="true">
        <Image src="/site/render/flatlay.webp" alt={FINAL.alt} width={2160} height={920} sizes="(max-width: 767px) 975px, 100vw" />
      </div>
      <StagedNote className="e-note" />
    </section>
  )
}
