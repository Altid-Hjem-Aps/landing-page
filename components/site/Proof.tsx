import Image from 'next/image'
import { PROOF } from './copy'
import Marquee from './Marquee'
import StagedNote from './StagedNote'

// A laurel of our own drawing, one side; the other side is the same drawing mirrored.
const LEAVES = [
  [21, 46, 62],
  [15.5, 41.5, 40],
  [11, 35.5, 24],
  [8, 28.5, 8],
  [7, 21, -8],
  [8, 13.5, -22],
  [11, 6.5, -38],
]

function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 30 51" width="30" height="51" fill="currentColor" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M26 49C13 45 7 30 13 4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {LEAVES.map(([x, y, angle]) => (
        <ellipse key={y} cx={x} cy={y} rx="2.4" ry="5.2" transform={`rotate(${angle} ${x} ${y})`} />
      ))}
    </svg>
  )
}

// The same Apple mark as on the App Store pill (components/StoreBadges.tsx).
const APPLE =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'

const tiles = (hidden: boolean) =>
  PROOF.tiles.map((tile) => (
    <li key={tile.src + tile.q} className="p-tile">
      <Image src={tile.src} alt={hidden ? '' : tile.alt} fill sizes="(max-width: 767px) 142px, 236px" style={{ objectFit: 'cover', objectPosition: '50% 8%' }} />
      <p className="p-cap">{tile.q}</p>
    </li>
  ))

export default function Proof() {
  return (
    <section data-b="proof" className="sec p" aria-labelledby="p-title">
      <p className="p-laurel" aria-label={PROOF.award.label}>
        <Laurel />
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="p-apple">
            <path d={APPLE} />
          </svg>
          {PROOF.award.lines.map((line) => (
            <span key={line} className="p-award-line">
              {line}
            </span>
          ))}
        </span>
        <Laurel flip />
      </p>
      <h2 id="p-title" className="t-h2 p-title">
        {PROOF.title}
      </h2>
      <div data-staged="true">
        <Marquee label={PROOF.title} className="p-mq" first={tiles(false)} second={tiles(true)} scrollsByKey />
      </div>
      <StagedNote className="p-note" />
    </section>
  )
}
