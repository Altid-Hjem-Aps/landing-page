'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { QR } from './copy'

// Computers only (CSS): the one QR code on the hero's old dark card, bottom right, with the new
// simple text (Thor 13/11). Not there when the page opens: the hero's notifications and service
// marks pass through that corner. It eases in once the box they move in has scrolled up past
// the card's top edge, so it never sits on them, and fades out again before the testimonials'
// slider comes up into the bottom of the window. Scrolling back up, it comes and goes at the
// same two places.

/** The box the hero's notifications and service marks move in (HeroLanes; the ring sits inside
 * it). The card waits until its bottom is above the card's top edge, with GAP to spare.
 * Measured: at 1280, 1440 and 1920 wide, nothing animated reaches below it near the card. */
const HERO_ANIMATION = '.h-lanes'
const GAP = 16
/** The slider whose arrival hides the card. */
const SLIDER = '[data-b="proof"] .v'
/** How far below the window the slider's top may come before the card goes. */
const SLIDER_GAP = 40

export default function GetAppSticky() {
  const [shown, setShown] = useState(false)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = document.querySelector(HERO_ANIMATION)
    const slider = document.querySelector(SLIDER)
    if (!hero) throw new Error(`GetAppSticky needs ${HERO_ANIMATION} on the page`)
    if (!slider) throw new Error(`GetAppSticky needs ${SLIDER} on the page`)
    const element = card.current as HTMLDivElement
    let frame = 0
    // The card's resting top edge, from its CSS bottom and height, so its own slide does not count.
    let restingTop = 0
    const measure = () => {
      restingTop = window.innerHeight - parseFloat(getComputedStyle(element).bottom) - element.offsetHeight
    }
    const check = () => {
      frame = 0
      const pastHero = hero.getBoundingClientRect().bottom < restingTop - GAP
      const sliderHere = slider.getBoundingClientRect().top < window.innerHeight + SLIDER_GAP
      setShown(pastHero && !sliderHere)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    const onResize = () => {
      measure()
      schedule()
    }
    measure()
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={card} className="gs" data-shown={shown}>
      <span className="gs-tile">
        <Image src="/site/qr/app.svg" alt={QR.alt} width={74} height={74} />
      </span>
      <span className="gs-text">
        <span className="gs-title">{QR.title}</span>
        <span className="gs-line">{QR.line}</span>
      </span>
    </div>
  )
}
