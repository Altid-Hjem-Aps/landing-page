'use client'

import { DM_Sans } from 'next/font/google'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Envelope, ENVELOPE_H, ENVELOPE_W } from '@/components/sections/why/ChaosCard'
import { useMotionPrefs } from './MotionPrefs'
import { LEAVE, QR } from './copy'

// The old heading's regular weight. The page itself loads DM Sans in 700 and 800 only, so
// this weight comes with the popup's own script and is not preloaded on the page.
const dmSansRegular = DM_Sans({ subsets: ['latin'], weight: '400', preload: false, variable: '--font-dm-sans-regular' })

// The leave popup itself, Thor's design from the old site (ExitIntentDialog) rebuilt with the
// same sizes and the same delivery: a big letter pops in, opens, and the card grows out of it
// while the letter drops away. Loaded only when the popup opens, so framer-motion stays out of
// the page's own script. A native modal dialog: the browser holds focus inside, Escape closes.
export default function LeaveDialog({ onClose }: { onClose: () => void }) {
  const { reduced } = useMotionPrefs()
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  // The backdrop only closes when the press started on it too, as on the old site.
  const pressOnBackdrop = useRef(false)

  // One clock from 0 to 1 for the whole intro, with the old dialog's timings.
  const intro = useMotionValue(0)
  const flap = useTransform(intro, [0.34, 0.56], [0, 1])
  const envelopeOpacity = useTransform(intro, [0, 0.12, 0.86, 0.98], [0, 1, 1, 0])
  const envelopeScale = useTransform(intro, [0, 0.32], [0.6, 2.9])
  const envelopeY = useTransform(intro, [0.6, 1], [0, 110])
  const panelScale = useTransform(intro, [0.52, 1], [0.22, 1])
  const panelY = useTransform(intro, [0.52, 1], [170, 0])
  const panelOpacity = useTransform(intro, [0.52, 0.66], [0, 1])

  useEffect(() => {
    restore.current = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    // The card, not the close button: no focus ring on open, and Tab still reaches the button.
    panel.current?.focus()
  }, [])

  useEffect(() => {
    if (reduced) {
      intro.set(1)
      return
    }
    intro.set(0)
    const run = animate(intro, 1, { duration: 1.9, ease: 'easeInOut' })
    return () => run.stop()
  }, [reduced, intro])

  // Every way out (Escape, the button, the backdrop) ends in the dialog's close event.
  const onDialogClose = () => {
    restore.current?.focus?.()
    onClose()
  }
  const close = () => dialog.current?.close()

  return (
    <dialog
      ref={dialog}
      className={`leave ${dmSansRegular.variable}`}
      aria-labelledby="leave-title"
      onClose={onDialogClose}
      onPointerDown={(e) => {
        pressOnBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressOnBackdrop.current) close()
      }}
    >
      <motion.div
        aria-hidden="true"
        className="leave-letter"
        style={{ marginLeft: -ENVELOPE_W / 2, marginTop: -ENVELOPE_H / 2, opacity: envelopeOpacity, scale: envelopeScale, y: envelopeY }}
      >
        <Envelope flap={flap} logoStamp />
      </motion.div>

      <motion.div ref={panel} className="leave-card" tabIndex={-1} style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}>
        <button type="button" className="leave-close" aria-label={LEAVE.close} onClick={close}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <div className="leave-text">
          <h2 id="leave-title" className="leave-title">
            {LEAVE.title}
          </h2>
          <p className="leave-proof">{LEAVE.proof}</p>
          <p className="leave-body">{LEAVE.body}</p>

          {/* Where the old form was, at its height: the two codes, then the small line. */}
          <div className="leave-get">
            <div className="leave-codes">
              <figure>
                <span className="leave-tile">
                  <Image src="/site/qr/app-store.svg" alt={QR.appStoreAlt} width={57} height={57} />
                </span>
                <figcaption>{QR.appStore}</figcaption>
              </figure>
              <figure>
                <span className="leave-tile">
                  <Image src="/site/qr/google-play.svg" alt={QR.googlePlayAlt} width={57} height={57} />
                </span>
                <figcaption>{QR.googlePlay}</figcaption>
              </figure>
            </div>
            <p className="leave-scan">{QR.line}</p>
            <p className="leave-free">
              {LEAVE.free} <span>{LEAVE.always}</span>
            </p>
          </div>
        </div>

        <div className="leave-photo">
          <Image src="/site/people/trin-1-sofa.webp" alt="" fill sizes="1020px" quality={90} style={{ objectFit: 'cover', objectPosition: '90% 50%' }} />
        </div>
      </motion.div>
    </dialog>
  )
}
