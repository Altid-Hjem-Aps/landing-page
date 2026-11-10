import Image from 'next/image'
import { OKONOMI } from './copy'
import Parallax from './Parallax'
import PaydayPace from './PaydayPace'
import Phone from './Phone'
import StagedNote from './StagedNote'

const RANGES = [7, 28, 37, 39]

// Deep forest, Økonomi. Spotlight on the app's front page drawn large (what is left until
// payday, ahead or behind), then four cards the phone
// stays fixed behind:
// each card is clipped with clip-path and holds its own position: fixed phone, so the
// screen changes as a card passes. No transform or backdrop-filter on any ancestor here.
export default function MadDark() {
  return (
    <>
      <section id="okonomi-universet" data-b="dark" data-surface="dark" className="sec d">
        <Image src="/site/render/spotlight.webp" alt="" width={688} height={495} className="d-spot" aria-hidden="true" />
        <PaydayPace />
        <header className="d-head">
          <h2 className="t-h2 d-title">
            <span className="d-title-dim">{OKONOMI.titleFirst}</span> {OKONOMI.titleSecond}
          </h2>
          <div className="d-para">
            <p className="t-body">{OKONOMI.line}</p>
          </div>
        </header>
        <div className="d-cards">
          {OKONOMI.cards.map((card, i) => (
            <article key={card.title} className="d-card" data-tone={card.tone} data-surface="light">
              <div className="d-card-text">
                <h3 className="t-h3b">{card.title}</h3>
                <p className="t-body">{card.body}</p>
              </div>
              <div className="d-fixed">
                <div className="d-content">
                  <Phone src={card.src} alt={card.alt} sizes="(max-width: 767px) 110px, 340px" />
                  <Parallax range={RANGES[i]} className={`d-piece d-piece-${i + 1}`}>
                    <Image src={card.piece} alt={card.pieceAlt} width={card.pieceSize[0]} height={card.pieceSize[1]} sizes="(max-width: 767px) 135px, 478px" />
                  </Parallax>
                </div>
              </div>
            </article>
          ))}
        </div>
        <StagedNote className="d-note" />
      </section>
    </>
  )
}
