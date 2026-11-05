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
      <ul className="p-laurels">
        {PROOF.laurels.map((text) => (
          <li key={text} className="p-laurel">
            <Laurel />
            <span>{text}</span>
            <Laurel flip />
          </li>
        ))}
      </ul>
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
