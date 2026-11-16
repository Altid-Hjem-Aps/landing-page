'use client'

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { APP_INTENT, countClick, STORE_MARK } from '@/components/StoreBadges'
import { trackEvent } from '@/lib/analytics'
import { countEvent } from '@/lib/count'
import { sitePage } from '@/lib/site-counts'
import type { Store, StorePosition } from '@/lib/store-links'
import { PILL_QR, QR } from './copy'

// A button that, on a computer, turns into a QR code (Thor 15/11: "when you click on the button
// it transforms into a QR-code ... and potentially have a Kopiér link to the specific store").
// The card starts exactly on the button, in its colour and with its corners, and grows to its
// full size with rounded corners all the way (CSS @starting-style in site.css); the code fades
// in once it has settled, and "Kopiér link" copies a store's link (a store's code only: the
// Altid Energi offer's one code for both stores has no button, Thor 15/11). Behind it the rest of the
// page is lightly blurred.
//
// The open card and the blur live in a layer of their own at the top of the page (a portal into
// .site, fixed to the window), so no section can clip the card or cover it: the steps hid it,
// the hero's stars showed through it. That is why it closes as soon as the page scrolls (then at
// once, without shrinking back), as well as on a click outside it, Escape, the close control, or
// another code opening.
//
// The store pills' codes are public/site/qr/appstore.svg and play.svg, made from storeLink(), and
// on a guide public/site/qr/guide/<guide>-<store>.svg with the guide's campaign (ALT-1713,
// scripts/site-assets.py guide-qr); make them again when a store link changes. Opening is not a store click; copying a store's
// link is. The Altid Energi offer uses it too, with the one code for both stores.

const OTHER_OPENED = 'pill-qr-open'
/** Where an open card is, every frame while it grows or shrinks, then null once it has closed:
 * the final block's gallery moves the tiles it hits out of its way (FinalGallery). */
export const QR_CARD_PLACE = 'qr-card-place'
export type QrCardPlace = { id: string; rect: DOMRect | null }
const CARD = { width: 250, height: 330 }
const SETTLED_MS = 520
/** The window's edge the card keeps clear of. */
const EDGE = 16

/** What the card shows: its code, its heading and the link "Kopiér link" copies. */
export type QrCode = {
  src: string
  alt: string
  /** The card's heading, after the store's mark when there is one. */
  title: string
  /** Names the card for screen readers. */
  label: string
  /** What "Kopiér link" copies; without it the card has no such button. */
  link?: string
  /** One store's code: its mark in the heading, and a copy counted as that store's click. */
  store?: { store: Store; position: StorePosition }
}

/** Which way the card grows from its button: from its left edge to the right ('start'), from
 * its right edge to the left ('end'), or centred on it ('middle'); downwards from the button's
 * top, or upwards from its bottom where the window has no room below ('middle': centred). */
export type QrAnchor = 'start' | 'end' | 'middle'

type Place = { x0: number; y0: number; w0: number; h0: number; r0: number; x1: number; y1: number }

export default function PillQr({
  code,
  variant,
  className,
  style,
  anchor = 'middle',
  card: cardSize = CARD,
  children,
}: {
  code: QrCode
  variant: string
  className: string
  style?: CSSProperties
  anchor?: QrAnchor
  /** The open card's size in px. */
  card?: { width: number; height: number }
  children: ReactNode
}) {
  const id = useId()
  const [place, setPlace] = useState<Place | null>(null)
  const [open, setOpen] = useState(false)
  // What the copy button last did: nothing yet, copied, or failed (the browser refused).
  const [copied, setCopied] = useState<'done' | 'failed' | null>(null)
  // Closed by a scroll: gone at once instead of shrinking back onto a button that has moved on
  // with the page (Thor 15/11: it floated away "in a weird way").
  const [instant, setInstant] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)

  const shut = (focusBack: boolean) => {
    setOpen(false)
    if (focusBack) button.current?.focus({ preventScroll: true })
  }

  // Measured on the button as it is on screen (its float and scale included), at the moment it
  // is pressed, so the card starts exactly on it.
  const measure = (): Place => {
    const pill = button.current as HTMLButtonElement
    const box = pill.getBoundingClientRect()
    const scale = pill.offsetHeight ? box.height / pill.offsetHeight : 1
    const r0 = Math.min(parseFloat(getComputedStyle(pill).borderTopLeftRadius) * scale, box.height / 2)
    const { width, height } = cardSize
    let x1 = anchor === 'start' ? box.left : anchor === 'end' ? box.right - width : box.left + box.width / 2 - width / 2
    x1 = Math.max(EDGE, Math.min(window.innerWidth - width - EDGE, x1))
    const down = anchor === 'middle' ? box.top + box.height / 2 - height / 2 : box.top
    const y1 = down + height > window.innerHeight - EDGE ? Math.max(EDGE, box.bottom - height) : Math.max(EDGE, down)
    return { x0: box.left, y0: box.top, w0: box.width, h0: box.height, r0, x1, y1 }
  }

  const toggle = () => {
    if (open) return shut(true)
    setInstant(false)
    setPlace(measure())
    setOpen(true)
    const where = { code: code.store?.store ?? 'app', position: code.store?.position ?? 'energi' } as const
    countEvent('QR Card Opened', { ...where, slug: sitePage(window.location.pathname) })
    // The site's main step on a computer, for visitors who accepted statistics (the conversion panel).
    trackEvent(APP_INTENT, { kind: 'qr_open', store: where.code, position: where.position })
  }

  useEffect(() => {
    if (!open) return
    close.current?.focus({ preventScroll: true })
    window.dispatchEvent(new CustomEvent(OTHER_OPENED, { detail: id }))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') shut(true)
    }
    const onPointer = (e: PointerEvent) => {
      if (!card.current?.contains(e.target as Node) && !button.current?.contains(e.target as Node)) shut(false)
    }
    const onScroll = () => {
      setInstant(true)
      shut(false)
    }
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) shut(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onScroll, { passive: true })
    window.addEventListener(OTHER_OPENED, onOther)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener(OTHER_OPENED, onOther)
    }
  }, [open, id])

  // While it grows or shrinks (and a little after), where the card is now; once closed, gone.
  useEffect(() => {
    if (!place) return
    let frame = 0
    const until = performance.now() + SETTLED_MS + 120
    const tell = () => {
      const going = performance.now() < until
      if (open || going) {
        const rect = card.current?.getBoundingClientRect() ?? null
        window.dispatchEvent(new CustomEvent<QrCardPlace>(QR_CARD_PLACE, { detail: { id, rect } }))
        frame = requestAnimationFrame(tell)
        return
      }
      window.dispatchEvent(new CustomEvent<QrCardPlace>(QR_CARD_PLACE, { detail: { id, rect: null } }))
      setPlace(null)
    }
    frame = requestAnimationFrame(tell)
    return () => cancelAnimationFrame(frame)
  }, [open, id, place])

  useEffect(() => {
    if (!copied) return
    const done = window.setTimeout(() => setCopied(null), copied === 'failed' ? 2400 : 1600)
    return () => window.clearTimeout(done)
  }, [copied])

  // A browser can refuse the clipboard (permission, a page not in focus, no clipboard at all):
  // then the button says so and nothing is counted, instead of failing without a word.
  const copy = (link: string) => {
    const refused = (e: unknown) => {
      console.error('Kopiér link: the browser refused the clipboard', e)
      setCopied('failed')
    }
    if (!navigator.clipboard) return refused(new Error('navigator.clipboard is not available'))
    navigator.clipboard.writeText(link).then(() => {
      if (code.store) countClick(code.store.store, code.store.position)
      setCopied('done')
    }, refused)
  }
  const copiedText = copied === 'failed' ? PILL_QR.copyFailed : PILL_QR.copied

  // The layer: the page's .site wrapper. Only looked for once the card exists, after a click.
  const layer = place ? document.querySelector<HTMLElement>('.site') : null
  if (place && !layer) throw new Error('PillQr needs the .site wrapper for its layer')

  const where = place
    ? ({
        '--x0': `${place.x0}px`,
        '--y0': `${place.y0}px`,
        '--w0': `${place.w0}px`,
        '--h0': `${place.h0}px`,
        '--r0': `${place.r0}px`,
        '--x1': `${place.x1}px`,
        '--y1': `${place.y1}px`,
        '--w1': `${cardSize.width}px`,
        '--h1': `${cardSize.height}px`,
      } as CSSProperties)
    : undefined

  return (
    <>
      <button ref={button} type="button" className={`${className} cursor-pointer`} style={style} data-variant={variant} aria-expanded={open} aria-controls={id} onClick={toggle}>
        {children}
      </button>
      {layer && place
        ? createPortal(
            <>
              <div className="pq-veil" data-open={open ? 'true' : undefined} aria-hidden="true" />
              <div ref={card} id={id} className="pq" role="group" aria-label={code.label} data-open={open ? 'true' : undefined} data-instant={instant ? 'true' : undefined} data-variant={variant} style={where}>
                <button ref={close} type="button" className="pq-x" aria-label={QR.close} onClick={() => shut(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <p className="pq-store">
                  {code.store ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={STORE_MARK[code.store.store]} />
                    </svg>
                  ) : null}
                  {code.title}
                </p>
                <span className="pq-tile">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={code.src} alt={code.alt} width={168} height={168} />
                </span>
                <p className="pq-scan">{QR.line}</p>
                {code.link ? (
                  <>
                    <button type="button" className="pq-copy" data-done={copied ? 'true' : undefined} onClick={() => copy(code.link as string)}>
                      <span className="pq-idle">{PILL_QR.copy}</span>
                      <span className="pq-done" aria-hidden="true">
                        {copiedText}
                      </span>
                    </button>
                    <span className="sr-only" role="status">
                      {copied ? copiedText : ''}
                    </span>
                  </>
                ) : null}
              </div>
            </>,
            layer,
          )
        : null}
    </>
  )
}
