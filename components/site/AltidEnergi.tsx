import Link from 'next/link'
import type { ElpriserData } from '@/lib/elpriser'

export default function AltidEnergi({ elpriser }: { elpriser: ElpriserData | null }) {
  return (
    <section id="altid-energi" className="ah-sec ah-bg-sky">
      <div className="ah-wrap">
        <h2 className="ah-h2 ah-hang max-w-[16ch]">“Hvornår skal opvasken sættes over?”</h2>
        <p className="ah-body mt-6 max-w-[520px]">Følg elprisen time for time og få besked, når strømmen er billigst.</p>
        {elpriser === null && <p className="ah-body mt-6">Priserne kan ikke hentes lige nu.</p>}
        <p className="ah-body mt-6">
          <Link href="/hvornar-er-strommen-billigst" className="underline underline-offset-2">
            Se dagens elpriser
          </Link>
        </p>
      </div>
    </section>
  )
}
