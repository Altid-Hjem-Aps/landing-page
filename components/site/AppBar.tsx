'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { APP_BAR } from './copy'
import StoreLink from './StoreLink'

const HERO_ZONE = 600
const JITTER = 4

// Phones only (CSS): slides up when you scroll up, away when you scroll down, and stays
// away over the hero, where the store pills are. Android sees Google Play, others App Store.
export default function AppBar() {
  const [shown, setShown] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    last.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last.current) < JITTER) return
      setShown(y < last.current && y > HERO_ZONE)
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <aside className="appbar" data-shown={shown} aria-label={APP_BAR.label}>
      <div className="appbar-who">
        <Image src="/app-badge.png" alt="" width={72} height={72} />
        <div>
          <p className="appbar-name">{APP_BAR.name}</p>
          <p className="appbar-sub">{APP_BAR.sub}</p>
        </div>
      </div>
      <StoreLink store="appstore" position="bar" className="appbar-cta appbar-cta-ios">
        {APP_BAR.cta}
      </StoreLink>
      <StoreLink store="play" position="bar" className="appbar-cta appbar-cta-play">
        {APP_BAR.cta}
      </StoreLink>
    </aside>
  )
}
