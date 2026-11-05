import Image from 'next/image'
import { LOVE, MAD, NOTES } from './copy'
import Marquee from './Marquee'
import ServiceIcon, { type ServiceIconName } from './ServiceIcon'

type Tile =
  | { kind: 'plate'; src: string; tone: string; alt: string }
  | { kind: 'image'; src: string; tone: string; alt: string; cover?: boolean; focus?: string }
  | { kind: 'icon'; icon: ServiceIconName; tone: string }

const plate = (i: number, tone: string): Tile => ({ kind: 'plate', src: MAD.plates[i].src, tone, alt: MAD.plates[i].name })

// Eight columns, in the page's rhythm: two tiles, three tiles, one low, one high, mirrored.
const COLUMNS: Tile[][] = [
  [plate(5, 'rose'), { kind: 'icon', icon: 'energi', tone: 'sky' }],
  [plate(0, 'honey'), { kind: 'image', src: '/site/brand/coin-stack.svg', tone: 'mint', alt: LOVE.collageAlt.coins }, plate(2, 'lavender')],
  [{ kind: 'image', src: '/site/app/mad-meal_plan.webp', tone: 'sand', alt: MAD.cards[0].alt, cover: true }],
  [{ kind: 'image', src: '/site/app/painting.webp', tone: 'sand', alt: LOVE.collageAlt.painting, cover: true, focus: '60% 50%' }],
  [{ kind: 'image', src: '/site/app/hjem-top.webp', tone: 'sand', alt: LOVE.collageAlt.bars, cover: true }],
  [plate(3, 'sky')],
  [{ kind: 'icon', icon: 'forsikring', tone: 'rose' }, plate(1, 'mint'), { kind: 'icon', icon: 'okonomi', tone: 'honey' }],
  [plate(6, 'lavender'), { kind: 'icon', icon: 'mad', tone: 'mint' }],
]

function TileView({ tile }: { tile: Tile }) {
  if (tile.kind === 'icon') {
    return (
      <div className="l-tile l-icon" data-tone={tile.tone}>
        <ServiceIcon name={tile.icon} size={48} />
      </div>
    )
  }
  if (tile.kind === 'plate') {
    return (
      <div className="l-tile l-plate" data-tone={tile.tone}>
        <Image src={tile.src} alt={tile.alt} width={143} height={143} sizes="(max-width: 767px) 160px, 200px" />
      </div>
    )
  }
  return (
    <div className={`l-tile ${tile.cover ? 'l-cover' : 'l-art'}`} data-tone={tile.tone}>
      <Image src={tile.src} alt={tile.alt} fill sizes="(max-width: 767px) 220px, 286px" style={{ objectFit: tile.cover ? 'cover' : 'contain', objectPosition: tile.focus ?? '50% 0%' }} />
    </div>
  )
}

const cards = (hidden: boolean) =>
  LOVE.cards.map((card) => (
    <li key={card.q} className="l-card">
      <span className="l-card-icon">
        <ServiceIcon name={card.icon} size={20} />
      </span>
      {hidden ? <p className="l-card-q">{card.q}</p> : <h3 className="l-card-q">{card.q}</h3>}
      <p className="l-card-service">{card.service}</p>
      <p className="l-card-a">{card.a}</p>
    </li>
  ))

export default function Love() {
  return (
    <section data-b="love" className="sec l">
      <div className="l-collage" data-staged="true">
        {COLUMNS.map((column, c) => (
          <div key={c} className={`l-col l-col-${c + 1}`}>
            {column.map((tile, t) => (
              <TileView key={t} tile={tile} />
            ))}
          </div>
        ))}
      </div>
      <header className="l-head">
        <h2 className="t-h2">{LOVE.title}</h2>
        <p className="t-body">{LOVE.body}</p>
      </header>
      <Marquee label={LOVE.cardsLabel} className="l-mq" first={cards(false)} second={cards(true)} scrollsByKey />
      <p className="l-note">
        {NOTES.staged} {NOTES.plates}
      </p>
    </section>
  )
}
