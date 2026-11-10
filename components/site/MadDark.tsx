import Image from 'next/image'
import { OKONOMI } from './copy'

// Deep forest: the heading, then the seven feature blocks of the launch mail, word for word and
// in its type styles, with the phone and lifted pieces exported from the mail's Figma frames. The phone
// stays fixed while the cards pass: each card is clipped with clip-path and holds its own
// position: fixed phone, so the screen changes as a card passes. No transform or
// backdrop-filter on any ancestor here.
export default function MadDark() {
  return (
    <>
      <section id="okonomi-universet" data-b="dark" data-surface="dark" className="sec d">
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
                <h3 className="d-card-title">{card.title}</h3>
                <p className="d-card-body">{card.body}</p>
              </div>
              <div className="d-fixed">
                <div className="d-content">
                  <Image src={card.src} alt={card.alt} width={866} height={1477} sizes="(max-width: 767px) 230px, 500px" className="d-shot" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
