import Image from 'next/image'
import { FEATURES } from './copy'
import Parallax from './Parallax'
import Phone from './Phone'
import Rings from './Rings'
import ScrollPan from './ScrollPan'
import StagedNote from './StagedNote'

const PHONE = '(max-width: 767px) 72vw, 320px'
const [tilbage, brugt, regninger] = FEATURES.cards

function CardText({ title, body }: { title: string; body: string }) {
  return (
    <div className="f-card-top">
      <h3 className="t-h3">{title}</h3>
      <p className="t-body">{body}</p>
    </div>
  )
}

export default function Features() {
  return (
    <section id="okonomi" data-b="features" className="sec f">
      <header className="f-head">
        <h2 className="t-h2">{FEATURES.title}</h2>
        <p className="t-body">{FEATURES.line}</p>
      </header>

      <div className="f-cards">
        <article className="f-card" data-tone={tilbage.tone}>
          <CardText title={tilbage.title} body={tilbage.body} />
          <div className="f-card-bottom">
            <ScrollPan className="f-card-phone">
              <Phone src={tilbage.src} alt={tilbage.alt} sizes={PHONE} />
            </ScrollPan>
            <div className="f-rows">
              <Image src="/site/app/crop-foran-card.webp" alt={FEATURES.pieces.foran} width={915} height={285} sizes="(max-width: 767px) 288px, 354px" />
              <Image src="/site/app/piece-ting.webp" alt={FEATURES.pieces.ting} width={1033} height={288} sizes="(max-width: 767px) 288px, 354px" />
            </div>
          </div>
        </article>

        <article className="f-card" data-tone={brugt.tone}>
          <CardText title={brugt.title} body={brugt.body} />
          <div className="f-card-bottom">
            <ScrollPan className="f-card-phone">
              <Phone src={brugt.src} alt={brugt.alt} sizes={PHONE} />
            </ScrollPan>
            <Image className="f-tile" src="/site/app/piece-takeaway.webp" alt={FEATURES.pieces.takeaway} width={380} height={503} sizes="(max-width: 767px) 131px, 161px" />
          </div>
        </article>

        <article className="f-card" data-tone={regninger.tone}>
          <CardText title={regninger.title} body={regninger.body} />
          <div className="f-card-bottom">
            <ScrollPan className="f-card-phone">
              <Phone src={regninger.src} alt={regninger.alt} sizes={PHONE} />
            </ScrollPan>
            <div className="f-pair">
              <Image src="/site/app/piece-regning.webp" alt={FEATURES.pieces.regning} width={376} height={198} sizes="(max-width: 767px) 153px, 188px" />
              <Image src="/site/app/piece-fast.webp" alt={FEATURES.pieces.fast} width={376} height={198} sizes="(max-width: 767px) 153px, 188px" />
            </div>
          </div>
        </article>
      </div>

      <article id="altid-energi" className="f-bento f-bento-a">
        <div className="f-bento-text">
          <h3 className="t-h3b">{FEATURES.energi.title}</h3>
          <p className="t-body">{FEATURES.energi.body}</p>
        </div>
        <div className="f-cols" data-staged="true">
          <Image className="f-col f-col-1" src="/site/app/energi-col-2.webp" alt={FEATURES.energi.altTwo} width={784} height={1484} sizes="(max-width: 767px) 222px, 392px" />
          <Image className="f-col f-col-2" src="/site/app/energi-col-1.webp" alt={FEATURES.energi.altOne} width={784} height={1427} sizes="(max-width: 767px) 222px, 392px" />
        </div>
      </article>

      <article id="altid-forsikring" className="f-bento f-bento-b">
        <Rings />
        <div className="f-records">
          <Phone src="/site/app/b-flow-3_insurances_chosen.webp" alt={FEATURES.forsikring.alt} sizes="(max-width: 767px) 64vw, 340px" />
          <Parallax range={18} className="f-float f-float-1">
            <Image src="/site/app/chip-hus.webp" alt={FEATURES.forsikring.chipHus} width={499} height={396} sizes="(max-width: 767px) 110px, 175px" />
          </Parallax>
          <Parallax range={18} className="f-float f-float-2">
            <Image src="/site/app/chip-bil.webp" alt={FEATURES.forsikring.chipBil} width={499} height={396} sizes="(max-width: 767px) 118px, 185px" />
          </Parallax>
        </div>
        <div className="f-bento-text f-bento-text-right">
          <h3 className="t-h3b">{FEATURES.forsikring.title}</h3>
          <p className="t-body">{FEATURES.forsikring.body}</p>
        </div>
      </article>
      <StagedNote className="f-note" />
    </section>
  )
}
