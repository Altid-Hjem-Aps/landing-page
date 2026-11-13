'use client'

import Image from 'next/image'
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

// A button that turns into a QR card in its own place (Thor 13/11: "the button turns into the
// square with a nice easing animation"). Computers only (from 1024 px with a fine pointer): one
// box eases its width, height and corners from the button's shape to the card's, the button's
// face fades out, and the code fades in once the box has settled. Closing runs it back. Escape,
// the close control and a click outside close it; focus goes to the close control on open and
// back to the button on close. On a phone or a tablet it is a plain link to `href`. The motion
// is CSS (.qm in site.css), and with reduced motion the two states swap at once.
//
// Each use sets the closed size (--qm-w0, --qm-h0) and the open width (--qm-w1) in CSS; the open
// height is the card's own, measured here.

const COMPUTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

function subscribeComputer(onChange: () => void) {
  const query = window.matchMedia(COMPUTER)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const readComputer = () => window.matchMedia(COMPUTER).matches
const onServer = () => false

type Props = {
  /** The use's own class, which sizes and colours it. */
  className: string
  /** The corner the card grows out of. */
  anchor: 'bottom-left' | 'bottom-right'
  /** Where the plain link goes on a phone or a tablet. */
  href: string
  newTab?: boolean
  qr: { src: string; alt: string; size: number }
  /** The card's heading, next to the close control. */
  head: ReactNode
  caption: string
  closeLabel: string
  /** More under the caption, such as a link for this computer. */
  extra?: ReactNode
  /** Outside the box, so it can hang over its edge (a badge); it fades out while open. */
  decor?: ReactNode
  onOpenChange?: (open: boolean) => void
  /** The button's face, and the link's on a phone. */
  children: ReactNode
}

export default function QrMorph({ className, anchor, href, newTab = false, qr, head, caption, closeLabel, extra, decor, onOpenChange, children }: Props) {
  const computer = useSyncExternalStore(subscribeComputer, readComputer, onServer)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const face = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const returnFocus = useRef(false)
  const id = useId()

  const change = useCallback(
    (next: boolean, focusBack: boolean) => {
      returnFocus.current = !next && focusBack
      setOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange],
  )

  // Focus follows the box: into the card on open, back to the button on close.
  useEffect(() => {
    if (open) closeButton.current?.focus({ preventScroll: true })
    else if (returnFocus.current) face.current?.focus({ preventScroll: true })
    returnFocus.current = false
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') change(false, true)
    }
    // A click elsewhere leaves focus where it lands.
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) change(false, false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, change])

  // The open height is the card's own, so a longer caption or a late font never cuts it off.
  useEffect(() => {
    if (!computer) return
    const card = panel.current as HTMLDivElement
    const measure = () => root.current?.style.setProperty('--qm-h1', `${card.offsetHeight}px`)
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    return () => observer.disconnect()
  }, [computer])

  if (!computer) {
    return (
      <div className={`qm ${className}`} data-mode="link">
        <a className="qm-link" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
        {decor}
      </div>
    )
  }

  return (
    <div ref={root} className={`qm ${className}`} data-mode="morph" data-anchor={anchor} data-open={open}>
      <div className="qm-box">
        <button ref={face} type="button" className="qm-face" aria-expanded={open} aria-controls={id} inert={open} onClick={() => change(true, false)}>
          {children}
        </button>
        <div ref={panel} id={id} className="qm-panel" role="group" aria-labelledby={`${id}-head`} inert={!open}>
          <div className="qm-head">
            <p id={`${id}-head`} className="qm-title">
              {head}
            </p>
            <button ref={closeButton} type="button" className="qm-close" aria-label={closeLabel} onClick={() => change(false, true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <span className="qm-tile">
            <Image src={qr.src} alt={qr.alt} width={qr.size} height={qr.size} />
          </span>
          <p className="qm-caption">{caption}</p>
          {extra}
        </div>
      </div>
      {decor}
    </div>
  )
}
