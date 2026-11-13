'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { QR } from './copy'
import GetAppButton from './GetAppButton'
import QrMorph, { useComputer } from './QrMorph'

// The final block's store pills. On a phone or a tablet they are the store links (and a phone
// sees its one "Hent appen gratis" button instead, CSS), counted as 'bottom'. On a computer
// either pill opens the row into the one QR code (Thor 13/11: the button is "animated in to"
// the code), which is not a store click. Arriving here through a "Hent appen" link, such as
// the menu's, opens the code by itself once the pills are in view.

const ARRIVING = `a[href$="#${STORE_ANCHOR}"]`

export default function FinalPills() {
  const computer = useComputer()
  const [open, setOpen] = useState(false)
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!computer) return
    let arriving = window.location.hash === `#${STORE_ANCHOR}`
    let inView = false
    const openIfHere = () => {
      if (!arriving || !inView) return
      arriving = false
      setOpen(true)
    }
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(ARRIVING)) return
      arriving = true
      openIfHere()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        openIfHere()
      },
      { threshold: 1 },
    )
    observer.observe(row.current as HTMLDivElement)
    document.addEventListener('click', onClick, true)
    return () => {
      observer.disconnect()
      document.removeEventListener('click', onClick, true)
    }
  }, [computer])

  const onOpenChange = useCallback((next: boolean) => setOpen(next), [])

  return (
    <div ref={row} className="e-pills">
      {computer ? (
        <QrMorph
          className="e-qm"
          open={open}
          onOpenChange={onOpenChange}
          qr={{ src: '/site/qr/app.svg', alt: QR.alt, size: 185 }}
          head={QR.title}
          caption={QR.line}
          closeLabel={QR.close}
        >
          {(opener) => <StoreBadges position="bottom" variant="cream" size="lg" className="store-row justify-center" opens={opener} />}
        </QrMorph>
      ) : (
        <>
          <StoreBadges position="bottom" variant="cream" size="lg" className="store-row justify-center" />
          <GetAppButton position="bottom" />
        </>
      )}
    </div>
  )
}
