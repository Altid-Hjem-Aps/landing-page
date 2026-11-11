import ServiceSection from '@/components/forside/ServiceSection'
import { SERVICES, type ServiceKey } from '@/lib/forside-copy'
import type { StaticImageData } from 'next/image'
import okonomi from './img/okonomi.webp'
import mad from './img/mad.webp'
import energi from './img/energi.webp'
import forsikring from './img/forsikring.webp'

// The four live services of app release 1.0, in the store text's order.
// Desktop alternates the phone's side: right, left, right, left.
const VISUAL: Record<ServiceKey, { tint: string; image: StaticImageData; phoneLeft: boolean }> = {
  okonomi: { tint: 'var(--tint-okonomi)', image: okonomi, phoneLeft: false },
  mad: { tint: 'var(--tint-mad)', image: mad, phoneLeft: true },
  energi: { tint: 'var(--tint-energi)', image: energi, phoneLeft: false },
  forsikring: { tint: 'var(--tint-forsikring)', image: forsikring, phoneLeft: true },
}

export default function Services() {
  return (
    <>
      {SERVICES.map((s) => (
        <ServiceSection key={s.key} copy={s} {...VISUAL[s.key]} />
      ))}
    </>
  )
}
