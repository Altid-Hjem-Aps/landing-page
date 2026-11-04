import ServiceSection from '@/components/forside/ServiceSection'
import { SERVICES, type ServiceKey } from '@/lib/forside-copy'
import { TOURS, type TourData } from '@/lib/screen-captures'

// The four live services of app release 1.0, in the store text's order.
// Desktop alternates the phone's side: right, left, right, left.
const VISUAL: Record<ServiceKey, { tint: string; tour: TourData; phoneLeft: boolean }> = {
  okonomi: { tint: 'var(--tint-okonomi)', tour: TOURS.okonomi, phoneLeft: false },
  mad: { tint: 'var(--tint-mad)', tour: TOURS.mad, phoneLeft: true },
  energi: { tint: 'var(--tint-energi)', tour: TOURS.energi, phoneLeft: false },
  forsikring: { tint: 'var(--tint-forsikring)', tour: TOURS.forsikring, phoneLeft: true },
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
