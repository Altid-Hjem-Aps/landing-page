import Image from 'next/image'
import Phone from '@/components/site/primitives/Phone'
import Reveal from '@/components/site/Reveal'
import { SCREENS } from '@/components/site/screens'

// Four icons float around the phone, each its own place in velkommen.css. Two share a
// beat and two the other, as in the reference. The third is left out at phone width there.
const ICONS = ['madplan', 'strom', 'okonomi', 'forsikring'] as const

export function VelkommenStage() {
  return (
    <>
      {ICONS.map((icon) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={icon} src={`/site/icons/${icon}.svg`} alt="" width={115} height={115} loading="lazy" className={`vk-coin vk-coin--${icon}`} />
      ))}
      <Reveal margin="-22%" className="vk-stage">
        <div className="vk-card vk-card--left">
          <div className="vk-card-tilt">
            <Image src={SCREENS.okonomiTop.src} alt={SCREENS.okonomiTop.alt} fill sizes="(max-width: 767px) 40vw, 300px" />
          </div>
        </div>
        <div className="vk-card vk-card--right">
          <div className="vk-card-tilt">
            <Image src={SCREENS.madHome.src} alt={SCREENS.madHome.alt} fill sizes="(max-width: 767px) 40vw, 300px" />
          </div>
        </div>
        <Phone screen={SCREENS.hjemTop} className="vk-phone" sizes="(max-width: 767px) 50vw, 300px" />
      </Reveal>
    </>
  )
}
