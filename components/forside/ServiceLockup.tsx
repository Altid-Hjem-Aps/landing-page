import type { ServiceKey } from '@/lib/forside-copy'

// The eyebrow above each service heading: the service's logo lockup. Mad and
// Forsikring are composed from the brand paths
// (round icon + "altid" wordmark + the subbrand word in Afacad), but the
// wordmark and the word are drawn in forest: the brand-coloured wordmark SVGs
// (olive, light blue) fail contrast on the tints. The round icons are graphics
// and keep their colours. Energi ships as one flattened lockup with dark navy
// ink, which reads on its tint. Økonomi is the app's own tab, not a subbrand:
// it gets the round app icon and the word where the subbrand words sit, so all
// four eyebrows share one structure.

/* eslint-disable @next/next/no-img-element */

// The five "altid" letter paths (viewBox 84.0116 x 28.7848), the same data
// as the old service cards used, so the wordmark can be
// filled with the forest ink.
const ALTID_PATHS = [
  'M16.6449 28.0645V25.7886H16.5699C15.6682 27.6468 13.1885 28.7848 10.4457 28.7848C4.28321 28.7857 2.20893e-05 23.8925 2.20893e-05 17.5211C2.20893e-05 11.1496 4.47141 6.29519 10.4457 6.29519C13.0003 6.29519 15.3676 7.31884 16.5699 9.25359H16.6449V7.01634H22.8823V28.0645H16.6449ZM16.6449 17.5211C16.6449 14.5627 14.2776 12.1742 11.3466 12.1742C8.41565 12.1742 6.23659 14.5636 6.23659 17.5976C6.23659 20.6316 8.52893 22.9076 11.4215 22.9076C14.3142 22.9076 16.644 20.556 16.644 17.522L16.6449 17.5211Z',
  'M27.6149 28.0642V0H33.8523V28.0642H27.6149Z',
  'M39.6008 28.0642V11.7949H36.52V7.01606H39.6008V0H45.8383V7.01606H48.8442V11.7949H45.8383V28.0642H39.6008Z',
  'M51.5497 4.77881V0H57.7872V4.77881H51.5497ZM51.5497 28.0642V7.01606H57.7872V28.0642H51.5497Z',
  'M78.0757 28.0642V25.7883H78.0007C76.8358 27.7221 74.7317 28.7467 71.7633 28.7467C65.4509 28.7467 61.3176 23.8544 61.3176 17.483C61.3176 11.1115 65.5633 6.29492 71.65 6.29492C74.0547 6.29492 76.0081 7.01516 77.7742 8.79776V0H84.0117V28.0642H78.0748H78.0757ZM78.1131 17.4452C78.1131 14.5246 75.8966 12.1739 72.8149 12.1739C69.7332 12.1739 67.5541 14.3733 67.5541 17.4452C67.5541 20.517 69.7706 22.8686 72.7765 22.8686C75.7824 22.8686 78.1122 20.5548 78.1122 17.4452H78.1131Z',
]

function Composed({ name, icon, word }: { name: string; icon: string; word: string }) {
  return (
    <div role="img" aria-label={name} className="flex items-center gap-3">
      <img src={icon} alt="" className="h-11 w-11 shrink-0" />
      <div aria-hidden className="flex flex-col items-end">
        <svg viewBox="0 0 84.0116 28.7848" className="w-[68px] h-auto" fill="var(--app-forest)">
          {ALTID_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
        <span className="leading-none text-[17px] text-[var(--app-forest)]" style={{ fontFamily: 'var(--font-afacad)' }}>
          {word}
        </span>
      </div>
    </div>
  )
}

export default function ServiceLockup({ service, name }: { service: ServiceKey; name: string }) {
  switch (service) {
    case 'okonomi':
      return (
        <div className="flex items-center gap-3">
          <img src="/app-badge.png" alt="" className="h-11 w-11 shrink-0 rounded-[12px]" />
          {/* As tall as the "altid" wordmark over a subbrand word, with the
              word at the bottom, where "mad" and "forsikring" sit. */}
          <div className="flex h-10 flex-col justify-end">
            <span className="leading-none text-[17px] text-[var(--app-forest)]" style={{ fontFamily: 'var(--font-afacad)' }}>
              {name}
            </span>
          </div>
        </div>
      )
    case 'mad':
      return <Composed name={name} icon="/services/icon-mad.svg" word="mad" />
    case 'energi':
      return <img src="/services/altid-energi.svg" alt={name} className="h-11 w-auto" />
    case 'forsikring':
      return <Composed name={name} icon="/services/icon-forsikring.svg" word="forsikring" />
  }
}
