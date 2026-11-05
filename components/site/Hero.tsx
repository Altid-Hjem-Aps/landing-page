import Image from 'next/image'
import StoreBadges from '@/components/StoreBadges'
import { HERO } from './copy'
import HeroLanes from './HeroLanes'
import HeroTunnel from './HeroTunnel'
import Phone from './Phone'
import QrCard from './QrCard'
import StagedNote from './StagedNote'

// Hero: sky with clouds, the tunnel of light, the text, one tilted phone and a smaller
// one in front of it, and cards that travel under the phones as the page scrolls.
export default function Hero() {
  return (
    <section id="top" data-b="hero" className="h">
      <div className="h-panel" aria-hidden="true">
        <span className="h-sky" />
        <HeroTunnel />
        <Image src="/site/render/clouds.webp" alt="" width={1424} height={338} className="h-clouds" loading="eager" fetchPriority="low" />
      </div>
      <div className="h-text">
        <h1 className="t-h1 h-title">{HERO.title}</h1>
        <p className="t-body h-line">{HERO.line}</p>
        <div className="h-pills">
          <StoreBadges position="hero" variant="cream" size="lg" className="justify-center" />
        </div>
        <p className="h-rating">{HERO.rating}</p>
      </div>
      <div className="h-bottom">
        <HeroLanes />
        <div className="h-phones">
          <div className="h-phone">
            <Phone src="/site/app/hjem-top.webp" alt={HERO.altPhone} sizes="(max-width: 767px) 62vw, 320px" preload />
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
