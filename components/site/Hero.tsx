import Image from 'next/image'
import StoreBadges from '@/components/StoreBadges'
import AppRating from './AppRating'
import { HERO, PRESS } from './copy'
import CyclingPhone from './CyclingPhone'
import Float from './Float'
import HeroLanes from './HeroLanes'
import HeroOrbit from './HeroOrbit'
import QrCard from './QrCard'

// Hero: the text on the page's light ground, Ekstra Bladet's article as a small floating card
// in the open space under the phones on a computer, one tilted phone and a smaller one in front of
// it, both showing their screens in turn, the cards that travel under them as the page
// scrolls, and the four services circling them with light trails.
export default function Hero() {
  return (
    <section id="top" data-b="hero" className="h">
      <div className="h-text">
        <h1 className="t-h1 h-title" data-rise="0">
          {HERO.title}
        </h1>
        <p className="t-body h-line" data-rise="1">
          {HERO.line}
        </p>
        <div className="h-pills" data-rise="2">
          <StoreBadges position="hero" variant="cream" size="lg" className="justify-center" />
        </div>
        <AppRating />
      </div>
      <div className="h-press-frame">
        <Float>
          <a className="h-press" href={PRESS.href} target="_blank" rel="noopener noreferrer">
            <Image src="/site/press/ekstra-bladet.png" alt={PRESS.outlet} width={44} height={44} />
            <span>
              <span className="h-press-label">{PRESS.label}</span>
              <span className="h-press-title">
                {/* The headline's two halves on their own lines, so "Ny app" stays together. */}
                {PRESS.title.split(': ').map((part, i, all) => (
                  <span key={part}>{i < all.length - 1 ? `${part}:` : part}</span>
                ))}
              </span>
              <span className="sr-only">{PRESS.newTab}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Float>
      </div>
      <div className="h-bottom" data-fade>
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
