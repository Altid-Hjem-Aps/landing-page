'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion'
import * as amplitude from '@amplitude/analytics-browser'
import WaitlistForm from '@/components/WaitlistForm'
import EtHjemStage from '@/components/sections/why/EtHjemStage'
import { Envelope, ENVELOPE_W, ENVELOPE_H } from '@/components/sections/why/ChaosCard'

// The exit-intent dialog BODY — code-split from the trigger
// (ExitIntentModal.tsx) so framer-motion and the animation stage stay out of
// every page's initial JS. Two columns on desktop: headline + bare form
// left, the full "Ét hjem" story (the WhatIs section's stage) right.

const FOREST = '#163223'

export default function ExitIntentDialog({ onClose }: { onClose: () => void }) {
  const prefersReducedMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  // Signed up inside the dialog — closing afterwards is not a dismissal.
  const converted = useRef(false)
  // Overlay clicks only close when the press STARTED on the overlay too —
  // a text-selection drag that ends outside the panel must not nuke the form.
  const pressOnOverlay = useRef(false)

  // Capture where focus was when the dialog was delivered.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null
  }, [])

  // The delivery intro on one 0→1 clock: a big letter pops in, its flap
  // swings open (same 3D flap as the scene's envelopes) and the dialog
  // slides out of it and grows to full size while the letter drops away.
  const intro = useMotionValue(0)
  const flap = useTransform(intro, [0.34, 0.56], [0, 1])
  const envelopeOpacity = useTransform(intro, [0, 0.12, 0.86, 0.98], [0, 1, 1, 0])
  const envelopeScale = useTransform(intro, [0, 0.32], [0.6, 2.9])
  const envelopeY = useTransform(intro, [0.6, 1], [0, 110])
  const panelScale = useTransform(intro, [0.52, 1], [0.22, 1])
  const panelY = useTransform(intro, [0.52, 1], [170, 0])
  const panelOpacity = useTransform(intro, [0.52, 0.66], [0, 1])

  useEffect(() => {
    if (prefersReducedMotion) {
      intro.set(1)
      return
    }
    intro.set(0)
    const anim = animate(intro, 1, { duration: 1.9, ease: 'easeInOut' })
    return () => anim.stop()
  }, [prefersReducedMotion, intro])

  const close = useCallback(() => {
    if (!converted.current) {
      amplitude.track('Exit Intent Dismissed', { path: window.location.pathname })
    }
    onClose()
    restoreFocusRef.current?.focus?.()
  }, [onClose])

  // Scroll lock + focus while open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Focus the panel, not the close button — autofocusing a button draws
    // the browser's focus ring on open; Tab still reaches the close first.
    panelRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        // On Windows, Escape closing an open native <select> can also reach
        // the document — that must not close the dialog mid-survey.
        if ((e.target as HTMLElement | null)?.tagName === 'SELECT') return
        close()
        return
      }
      // Minimal focus trap: keep Tab cycling inside the dialog.
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      // Focus fell outside the panel (e.g. the focused submit button was
      // removed on a view swap) — pull the trap shut instead of letting Tab
      // wander into the page behind the overlay.
      if (!active || !panelRef.current.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [close])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10, 25, 16, 0.55)', animation: 'modal-fade-in 0.25s ease' }}
      onPointerDown={e => { pressOnOverlay.current = e.target === e.currentTarget }}
      onClick={e => {
        if (e.target === e.currentTarget && pressOnOverlay.current) close()
      }}
    >
      {/* The letter the dialog is delivered in — pops in, opens, drops away. */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: -ENVELOPE_W / 2,
          marginTop: -ENVELOPE_H / 2,
          opacity: envelopeOpacity,
          scale: envelopeScale,
          y: envelopeY,
        }}
      >
        <Envelope flap={flap} />
      </motion.div>

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-heading"
        tabIndex={-1}
        className="relative w-full max-w-[560px] lg:max-w-[1120px] max-h-[92vh] overflow-y-auto rounded-[24px] outline-none"
        style={{ background: FOREST, opacity: panelOpacity, scale: panelScale, y: panelY }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Luk"
          onClick={close}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-11 h-11 rounded-full transition-opacity hover:opacity-70 text-white lg:text-[#163223]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_560px]">
          <div className="p-6 pt-12 sm:p-10 sm:pt-12">
            <h2 id="exit-intent-heading" className="text-[clamp(24px,3vw,32px)] font-normal leading-[1.15] text-white mb-4 max-lg:pr-10">
              Gå ikke glip af besparelser på hjemmets udgifter
            </h2>
            {/* Lone and Michael are named (with consent) in the testimonial
                section; the 1.000+ claim matches the eyebrow there. */}
            <p className="text-[16px] font-semibold text-white mb-2">
              Gør som Lone, Michael og over 1.000 andre danskere
            </p>
            <p className="text-[16px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Skriv dig på ventelisten til Altid Hjem, og få dine faste udgifter samlet ét sted med mulighed for lavere priser.
            </p>

            <WaitlistForm
              variant="dark"
              source="exit-intent"
              embedded
              onSignup={() => {
                converted.current = true
                amplitude.track('Exit Intent Converted', { path: window.location.pathname })
              }}
            />
          </div>

          {/* The full "Ét hjem" story from the WhatIs section, on a soft
              paper-white (deliberately between the homepage's pure white and
              the cream tokens — pure white glares next to the forest panel).
              Desktop only: below lg the column would push the form below the
              fold. The 620px floor is on the COLUMN so the grid row grows
              with it and the stage never renders into a clipped box. */}
          <div aria-hidden className="hidden lg:block relative overflow-hidden pointer-events-none" style={{ background: '#fbf9f3', borderLeft: '1px solid rgba(255,255,255,0.07)', minHeight: 620 }}>
            <div className="absolute inset-0">
              <EtHjemStage compact />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
