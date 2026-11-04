import Link from 'next/link'
import Caption from '@/components/site/primitives/Caption'
import Phone from '@/components/site/primitives/Phone'
import ElprisBars from '@/components/site/ElprisBars'
import { SCREENS } from '@/components/site/screens'
import type { ElpriserData } from '@/lib/elpriser'
import './altid-energi.css'

export default function AltidEnergi({ elpriser }: { elpriser: ElpriserData | null }) {
  return (
    <section id="altid-energi" className="ae-sec ah-bg-sky">
      <div className="ae-wrap">
        <h2 className="ah-h2 ah-hang ae-title">“Hvornår skal opvasken sættes over?”</h2>
        <ElprisBars data={elpriser} />

        <div className="ae-lower">
          <div className="ae-copy">
            <p className="ae-sentence">Følg elprisen time for time og få besked, når strømmen er billigst.</p>
            <Link href="/hvornar-er-strommen-billigst" className="ae-link ae-link--sky">
              Se dagens elpriser
            </Link>
          </div>
          <div className="ae-phone">
            <Caption kind="screens" on="pastel" className="ae-phone-caption" />
            <Phone screen={SCREENS.energiHome} crop={0.62} sizes="(max-width: 767px) 72vw, 380px" />
          </div>
        </div>
      </div>
    </section>
  )
}
