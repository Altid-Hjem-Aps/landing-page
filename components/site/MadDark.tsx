import Image from 'next/image'
import { OKONOMI } from './copy'
import PaydayPace from './PaydayPace'
import StagedNote from './StagedNote'

// Deep forest, Økonomi. Spotlight on the app's front page drawn large (what is left until
// payday, ahead or behind), then the seven feature blocks of the launch mail, word for word,
// with the phone and lifted pieces exported from the mail's Figma frames. The phone
// stays fixed while the cards pass: each card is clipped with clip-path and holds its own
// position: fixed phone, so the screen changes as a card passes. No transform or
// backdrop-filter on any ancestor here.
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
          {OKONOMI.cards.map((card) => (
            <article key={card.src} className="d-card" data-tone={card.tone} data-surface="light">
              <div className="d-card-text">
                <h3 className="t-h3b">{card.title}</h3>
                <p className="t-body">{card.body}</p>
              </div>
              <div className="d-fixed">
                <div className="d-content">
                  <Image src={card.src} alt={card.alt} width={866} height={1477} sizes="(max-width: 767px) 230px, 500px" className="d-shot" />
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
