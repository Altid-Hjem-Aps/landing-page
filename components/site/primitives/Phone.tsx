import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Screen } from '@/components/site/screens'

// A phone drawn in CSS (app/globals.css, .ah-phone). The screenshots draw their
// own island and status bar, so the frame adds none unless the screen is empty.
//
// Width: --ah-phone-w or a width class on className. Keep a phone on one line of
// CSS; everything inside scales with it through cqw.
export default function Phone({
  screen,
  children,
  empty = false,
  crop,
  sizes = '(max-width: 767px) 70vw, 360px',
  preload = false,
  className = '',
  style,
}: {
  /** A screen from components/site/screens.ts. */
  screen?: Screen
  /** Drawn on top of the screen, clipped by it. */
  children?: ReactNode
  /** Deep forest screen with a drawn hardware island, for live content in children. */
  empty?: boolean
  /** Show only the top part, as a fraction of the screen's height. Flat bottom edge, no shadow. */
  crop?: number
  sizes?: string
  /** Only the hero's image. */
  preload?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`ah-phone ${crop ? 'ah-phone--crop' : ''} ${className}`} style={style}>
      <div className="ah-phone-body">
        <div className="ah-phone-screen" style={crop ? { aspectRatio: `1179 / ${2556 * crop}` } : undefined}>
          {screen && <Image src={screen.src} alt={screen.alt} fill sizes={sizes} preload={preload} />}
          {empty && <span className="ah-phone-island" aria-hidden />}
          {children && <div className="ah-phone-content">{children}</div>}
        </div>
      </div>
    </div>
  )
}
