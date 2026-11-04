import Image from 'next/image'
import Caption from '@/components/site/primitives/Caption'
import Phone from '@/components/site/primitives/Phone'
import ElprisBars from '@/components/site/ElprisBars'
import Reveal from '@/components/site/Reveal'
import { PAINTING, SCREENS } from '@/components/site/screens'
import type { ElpriserData } from '@/lib/elpriser'
import './proof.css'

// The bento and the marquee. Sizes in proof.css come from the reference at 1440 and 390.

// Rows of empty cells drifting behind the chart. Decoration, no content.
const CELL_ROWS = [0, 1, 2, 3]
const CELLS = Array.from({ length: 9 }, (_, i) => i)

const SPECKS_TALL = [
  [12, 5], [31, 19], [47, 2], [58, 27], [66, 12], [74, 33], [83, 8], [90, 24], [22, 38], [40, 44], [69, 48], [52, 58],
] as const
const SPECKS_LIGHT = [
  [5, 62], [12, 78], [22, 92], [34, 70], [48, 96], [8, 90], [28, 84], [62, 92],
] as const

function Specks({ at }: { at: readonly (readonly [number, number])[] }) {
  return (
    <span className="pf-specks" aria-hidden>
      {at.map(([x, y], i) => (
        <i key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -0.7}s` }} />
      ))}
    </span>
  )
}

/** A real row from the Økonomi screen: Restaurant og takeaway, or Transport. */
function CategoryRow({ row, className }: { row: 'takeaway' | 'transport'; className: string }) {
  return (
    <div className={`pf-row pf-row--${row} ${className}`}>
      <Image src={SCREENS.okonomiTop.src} alt="" width={SCREENS.okonomiTop.width} height={SCREENS.okonomiTop.height} sizes="320px" />
    </div>
  )
}

function FerieRing() {
  return (
    <div className="pf-gauge" aria-hidden>
      <div className="pf-gauge-disc">
        <Image src={PAINTING.colour.src} alt="" width={PAINTING.colour.width} height={PAINTING.colour.height} sizes="280px" />
      </div>
      <svg className="pf-gauge-ring" viewBox="0 0 296 296">
        <defs>
          <linearGradient id="pf-ring" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6fd65e" />
            <stop offset="0.6" stopColor="#b7f2a7" />
            <stop offset="1" stopColor="#90ff7c" />
          </linearGradient>
        </defs>
        <circle cx="148" cy="148" r="140" fill="none" stroke="rgb(253 250 244 / 0.16)" strokeWidth="12" />
        {/* pathLength 100, so the dash is the percentage itself. */}
        <circle
          cx="148"
          cy="148"
          r="140"
          fill="none"
          stroke="url(#pf-ring)"
          strokeWidth="12"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="62 38"
          transform="rotate(64 148 148)"
        />
      </svg>
      <span className="pf-gauge-star" />
      <span className="pf-gauge-pill">62 % på vej</span>
    </div>
  )
}

const MARQUEE_SETS = [0, 1, 2, 3]

// The service logos are the word "altid" alone, so the service's name is set under it the
// way the Altid Energi lockup has it.
function MarqueeSet({ copy }: { copy: number }) {
  // Only the first set is read out; the others are there to close the loop.
  const hidden = copy > 0
  return (
    <ul className="pf-mq-set" aria-hidden={hidden || undefined} data-copy={hidden || undefined}>
      <li className="pf-mq-lockup">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/services/altid-mad.svg" alt={hidden ? '' : 'Altid Mad'} width={84} height={29} loading="lazy" />
        <span aria-hidden>mad</span>
      </li>
      <li>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/altidenergi-logo-white.svg" alt={hidden ? '' : 'Altid Energi'} width={110} height={56} loading="lazy" className="pf-mq-energi" />
      </li>
      <li className="pf-mq-lockup">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/services/altid-forsikring.svg" alt={hidden ? '' : 'Altid Forsikring'} width={84} height={29} loading="lazy" />
        <span aria-hidden>forsikring</span>
      </li>
      <li className="pf-mq-word">Økonomi</li>
    </ul>
  )
}

export default function Proof({ elpriser }: { elpriser: ElpriserData | null }) {
  return (
    <section id="tryghed" className="pf-sec">
      <div className="pf-full">
        <h2 className="pf-h">
          Alt det, der fylder derhjemme. <span className="pf-accent">Samlet i én app.</span>
        </h2>

        <div className="pf-grid">
          {/* The nav on the SEO pages lands on these two tiles. */}
          <Reveal id="altid-energi" className="pf-tile pf-wide ah-reveal--self">
            <div className="pf-cells" aria-hidden>
              {CELL_ROWS.map((row) => (
                <div key={row} className="pf-cell-row" data-row={row}>
                  {CELLS.map((cell) => (
                    <span key={cell} />
                  ))}
                </div>
              ))}
            </div>
            <div className="pf-wide-in">
              <h3 className="pf-t">Hvornår skal opvasken sættes over?</h3>
              <ElprisBars data={elpriser} />
            </div>
          </Reveal>

          <Reveal id="altid-forsikring" className="pf-tile pf-tall ah-reveal--self">
            <Phone screen={SCREENS.forsikringChosen} className="pf-tall-phone" sizes="(max-width: 767px) 76vw, 320px" />
            <Specks at={SPECKS_TALL} />
            <h3 className="pf-t pf-tall-t">Alle jeres forsikringer samlet ét sted</h3>
            <p className="pf-b">Se, hvad I betaler, og få snart nye tilbud. Helt gratis og uforpligtende.</p>
          </Reveal>

          <Reveal className="pf-tile pf-light ah-reveal--self">
            <h3 className="pf-t">Bruger vi for meget på takeaway?</h3>
            <Reveal margin="-58%" className="pf-light-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/site/icons/okonomi.svg" alt="" width={70} height={70} className="pf-light-icon" />
              <CategoryRow row="takeaway" className="pf-light-card" />
              <CategoryRow row="transport" className="pf-light-card2" />
            </Reveal>
            <Specks at={SPECKS_LIGHT} />
          </Reveal>

          <Reveal className="pf-tile pf-dark ah-reveal--self">
            <h3 className="pf-t">Skat, hvornår skal vi på ferie igen?</h3>
            <FerieRing />
          </Reveal>

          <Caption on="forest" className="pf-caption" />
        </div>

        <div className="pf-feat">
          <p className="pf-feat-label">Samlet i Altid Hjem</p>
          <div className="pf-mq">
            <div className="pf-mq-track">
              {MARQUEE_SETS.map((copy) => (
                <MarqueeSet key={copy} copy={copy} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
