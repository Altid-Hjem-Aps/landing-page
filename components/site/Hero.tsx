import StoreBadges from '@/components/StoreBadges'
import AppRating from './AppRating'
import { HERO } from './copy'
import CyclingPhone from './CyclingPhone'
import HeroLanes from './HeroLanes'
import HeroOrbit from './HeroOrbit'
import QrCard from './QrCard'

// Hero: the text on the page's light ground, one tilted phone and a smaller one in front of
// it, both showing their screens in turn, the cards that travel under them as the page
// scrolls, and the four services circling them with light trails.
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
        <HeroLanes />
        <HeroOrbit />
        <div className="h-phones">
          <div className="h-phone">
            <CyclingPhone screens={HERO.mainScreens} sizes="(max-width: 767px) 62vw, 320px" preload />
          </div>
          <div className="h-second">
            <CyclingPhone screens={HERO.secondScreens} sizes="(max-width: 767px) 44vw, 210px" />
          </div>
        </div>
      </div>
      <QrCard />
    </section>
  )
}
