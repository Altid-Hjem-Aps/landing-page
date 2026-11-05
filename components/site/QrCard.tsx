'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { QR } from './copy'

// Bottom right of the first viewport, from 1024 px with a fine pointer (CSS). It belongs
// to the hero and fades out over the first 900 px of scrolling, as the reference does.
const GONE_AT = 900

export default function QrCard() {
  const card = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = card.current as HTMLElement
    const update = () => {
      const opacity = Math.max(0, 1 - window.scrollY / GONE_AT)
      element.style.opacity = String(opacity)
      element.style.visibility = opacity === 0 ? 'hidden' : 'visible'
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="qr-frame">
      <aside ref={card} className="qr" aria-label={QR.label}>
        <figure>
          <Image src="/site/qr/app-store.svg" alt={QR.appStoreAlt} width={57} height={57} />
          <figcaption>{QR.appStore}</figcaption>
        </figure>
        <figure>
          <Image src="/site/qr/google-play.svg" alt={QR.googlePlayAlt} width={57} height={57} />
          <figcaption>{QR.googlePlay}</figcaption>
        </figure>
        <div className="qr-text">
          <p className="qr-title">{QR.title}</p>
          <p className="qr-line">{QR.line}</p>
        </div>
      </aside>
    </div>
  )
}
