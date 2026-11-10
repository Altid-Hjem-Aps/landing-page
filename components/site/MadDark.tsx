import Image from 'next/image'
import { MAD, NOTES } from './copy'
import Parallax from './Parallax'
import Phone from './Phone'
import PlateCarousel from './PlateCarousel'
import StagedNote from './StagedNote'

const RANGES = [7, 28, 37, 39]

// Deep forest. Spotlight, week of plates, then four cards the phone stays fixed behind:
// each card is clipped with clip-path and holds its own position: fixed phone, so the
// screen changes as a card passes. No transform or backdrop-filter on any ancestor here.
export default function MadDark() {
  return (
    <>
      <section id="altid-mad" data-b="dark" data-surface="dark" className="sec d">
        <Image src="/site/render/spotlight.webp" alt="" width={688} height={495} className="d-spot" aria-hidden="true" />
        <PlateCarousel />
        <header className="d-head">
          <h2 className="t-h2 d-title">
            <span className="d-title-dim">{MAD.titleFirst}</span> {MAD.titleSecond}
          </h2>
          <div className="d-para">
            <p className="t-body">{MAD.savings.line}</p>
            <p className="t-body d-foot">
              {MAD.savings.footnoteLead}
              <a href={MAD.savings.footnoteHref} target="_blank" rel="noopener noreferrer">
                {MAD.savings.footnoteLink}
              </a>
            </p>
            <p className="t-body d-foot">{NOTES.plates}</p>
          </div>
        </header>
        <div className="d-cards">
          {MAD.cards.map((card, i) => (
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
      <div className="stripes" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </>
  )
}
