import Image from 'next/image'
import StoreBadges from '@/components/StoreBadges'
import AppRating from './AppRating'
import { HERO } from './copy'
import QrCard from './QrCard'
import StagedNote from './StagedNote'

// Hero: the text on the page's own light ground, then the three phones with their lifted
// cards and the service icons with light trails, as in the header of the launch mail
// (Figma 9366:133, exported without its green ground). The picture is cut by the hero's
// bottom edge, as the mail's frame cuts it.
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
      <div className="h-cluster" data-staged="true">
        <Image
          src="/site/hero/phones.webp"
          alt={HERO.altCluster}
          width={1925}
          height={1762}
          sizes="(max-width: 767px) 100vw, 960px"
          quality={75}
          preload
        />
      </div>
      <StagedNote className="h-note" />
      <QrCard />
    </section>
  )
}
