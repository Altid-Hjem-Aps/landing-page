import StoreBadges from '@/components/StoreBadges'
import AppRating from './AppRating'
import { HERO } from './copy'
import HeroOrbit from './HeroOrbit'
import Phone from './Phone'
import QrCard from './QrCard'
import StagedNote from './StagedNote'

// Hero: the text on the page's light ground, one tilted phone and a smaller one in front of
// it, and the four services circling them with light trails.
export default function Hero() {
  return (
    <section id="top" data-b="hero" className="h">
      <div className="h-text">
        <h1 className="t-h1 h-title">{HERO.title}</h1>
        <p className="t-body h-line">{HERO.line}</p>
        <div className="h-pills">
          <StoreBadges position="hero" variant="cream" size="lg" className="justify-center" />
        </div>
        <AppRating />
      </div>
      <div className="h-bottom">
        <HeroOrbit />
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
