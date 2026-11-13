'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react'

// Controls that open into a QR card in their own place (Thor 13/11: "the button turns into the
// square with a nice easing animation"; on the final block's store pills since his second
// round). One box, centred over the controls, eases its width, height and corners from their
// row's size to the card's, the controls fade out, and the code fades in once the box has
// settled. Closing runs it back. Escape, the close control and a click outside close it; focus
// goes to the close control on open and back to the control that opened it on close. The
// motion is CSS (.qm in site.css), and with reduced motion the two states swap at once.
//
// Open state is the caller's, so it can also open the card itself (arriving through a link).
// The closed size is the controls' own and the open height the card's, both measured here; the
// use sets the open width (--qm-w1) and the colours in CSS.

const COMPUTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

function subscribeComputer(onChange: () => void) {
  const query = window.matchMedia(COMPUTER)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const readComputer = () => window.matchMedia(COMPUTER).matches
const onServer = () => false

/** From 1024 px with a fine pointer: where a QR code makes sense instead of a store link. */
export function useComputer(): boolean {
  return useSyncExternalStore(subscribeComputer, readComputer, onServer)
}

/** What each opening control needs: its click, and its aria-expanded and aria-controls. */
export type QrOpener = { onOpen: (event: MouseEvent<HTMLElement>) => void; expanded: boolean; controls: string }

type Props = {
  /** The use's own class, which sizes and colours it. */
  className: string
  open: boolean
  onOpenChange: (open: boolean) => void
  qr: { src: string; alt: string; size: number }
  /** The card's heading, next to the close control. */
  head: ReactNode
  caption: string
  closeLabel: string
  /** The controls that open the card. */
  children: (opener: QrOpener) => ReactNode
}

export default function QrMorph({ className, open, onOpenChange, qr, head, caption, closeLabel, children }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const face = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  // The control that opened the card, kept as state: the render prop hands out onOpen.
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const returnFocus = useRef(false)
  const id = useId()

  const close = (focusBack: boolean) => {
    returnFocus.current = focusBack
    onOpenChange(false)
  }

  // Focus follows the box: into the card on open, back to what opened it on close (the first
  // control when the card opened by itself).
  useEffect(() => {
    if (open) {
      closeButton.current?.focus({ preventScroll: true })
      return
    }
    if (returnFocus.current) {
      const back = opener ?? face.current?.querySelector<HTMLElement>('button, a')
      back?.focus({ preventScroll: true })
    }
    returnFocus.current = false
  }, [open, opener])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      returnFocus.current = true
      onOpenChange(false)
    }
    // A click elsewhere leaves focus where it lands.
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, onOpenChange])

  // Both ends of the box are measured, so a late font or a longer caption never cuts it off.
  useEffect(() => {
    const element = root.current as HTMLDivElement
    const controls = face.current as HTMLDivElement
    const card = panel.current as HTMLDivElement
    const measure = () => {
      element.style.setProperty('--qm-w0', `${controls.offsetWidth}px`)
      element.style.setProperty('--qm-h0', `${controls.offsetHeight}px`)
      element.style.setProperty('--qm-h1', `${card.offsetHeight}px`)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(controls)
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  const onOpen = (event: MouseEvent<HTMLElement>) => {
    setOpener(event.currentTarget)
    onOpenChange(true)
  }

  return (
    <div ref={root} className={`qm ${className}`} data-open={open}>
      <div ref={face} className="qm-face" inert={open}>
        {children({ onOpen, expanded: open, controls: id })}
      </div>
      <div className="qm-box">
        <div ref={panel} id={id} className="qm-panel" role="group" aria-labelledby={`${id}-head`} inert={!open}>
          <div className="qm-head">
            <p id={`${id}-head`} className="qm-title">
              {head}
            </p>
            <button ref={closeButton} type="button" className="qm-close" aria-label={closeLabel} onClick={() => close(true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <span className="qm-tile">
            <Image src={qr.src} alt={qr.alt} width={qr.size} height={qr.size} />
          </span>
          <p className="qm-caption">{caption}</p>
        </div>
      </div>
    </div>
  )
}
