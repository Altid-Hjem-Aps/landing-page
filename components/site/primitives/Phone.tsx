import Image from 'next/image'
import type { Screen } from '@/components/site/screens'

// A phone drawn in CSS (app/globals.css, .ah-phone). The screenshots draw their
// own island and status bar, so the frame adds none.
//
// Width: --ah-phone-w or a width class on className. Keep a phone on one line of
// CSS; everything inside scales with it through cqw.
export default function Phone({
  screen,
  sizes = '(max-width: 767px) 70vw, 360px',
  className = '',
}: {
  /** A screen from components/site/screens.ts. */
  screen: Screen
  sizes?: string
  className?: string
}) {
  return (
    <div className={`ah-phone ${className}`}>
      <div className="ah-phone-body">
        <div className="ah-phone-screen">
          <Image src={screen.src} alt={screen.alt} fill sizes={sizes} />
        </div>
      </div>
    </div>
  )
}
