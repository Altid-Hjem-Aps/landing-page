import StoreBadges from '@/components/StoreBadges'
import AppRating from './AppRating'
import { HERO } from './copy'
import HeroLanes from './HeroLanes'
import Phone from './Phone'
import QrCard from './QrCard'
import StagedNote from './StagedNote'

// Hero: a Deep forest block as on the first store screenshot, the text, one tilted phone
// and a smaller one in front of it, and cards that travel under the phones as the page scrolls.
export default function Hero() {
  return (
    <section id="top" data-b="hero" data-surface="dark" className="h">
      <div className="h-panel" aria-hidden="true" />
      <div className="h-text">
        <h1 className="t-h1 h-title">{HERO.title}</h1>
        <p className="t-body h-line">{HERO.line}</p>
        <div className="h-pills">
          <StoreBadges position="hero" variant="forest" size="lg" className="justify-center" />
        </div>
        <AppRating />
      </div>
      <div className="h-bottom">
        <HeroLanes />
        <div className="h-phones">
          <div className="h-phone">
            <Phone src="/site/app/hjem-top.webp" alt={HERO.altPhone} sizes="(max-width: 767px) 62vw, 320px" quality={75} preload />
          </div>
          <div className="h-second">
            <Phone src="/site/app/mad-meal_plan.webp" alt={HERO.altSecond} sizes="(max-width: 767px) 44vw, 210px" focus="50% 34%" />
          </div>
        </div>
      </div>
      <StagedNote className="h-note" />
      <QrCard />
    </section>
  )
}
