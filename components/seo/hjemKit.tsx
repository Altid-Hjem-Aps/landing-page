'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

/**
 * Shared tokens, primitives and animation plumbing for the SEO-page
 * mockups and calculators on altidhjem.dk. Mirrors the design language of
 * the existing page mockups (ForsikringHusstandMockup, ElprisAppMockup):
 * white app-card on the cream page, forest ink, sage accents, red only for
 * flagged problems, and slow narrative phase timing.
 */

export const FOREST = 'var(--forest)'
export const SAGE = 'var(--sage)'
export const RED = '#c0392b'
export const CARD_BORDER = 'rgba(26,61,34,0.1)'
export const HAIRLINE = 'rgba(26,61,34,0.08)'
export const CARD_SHADOW = '0 14px 34px rgba(17,40,24,0.10)'
export const INK_MUTED = 'rgba(26,61,34,0.55)'
export const SAGE_WASH = 'rgba(168,224,99,0.18)'
export const RED_WASH = 'rgba(192,57,43,0.1)'
// Secondary text on forest: high enough for small functional text (≥4.5:1).
export const ON_FOREST_MUTED = 'rgba(255,255,255,0.78)'

/* Motion tokens: EASE_OUT for entrances/reveals (fast start, soft landing),
 * EASE_STANDARD for state/colour changes, EASE_OVERSHOOT only for small
 * elements (pills, glyphs) — scaling whole text rows past 1.0 blurs on iOS. */
export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const EASE_STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)'
export const EASE_OVERSHOOT = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export const DUR_FAST = 200
export const DUR_POP = 320
export const DUR_MED = 450
export const DUR_SLOW = 650
export const STAGGER_STEP = 60
export const REVEAL_DELAY = 120
/* The loop pauses below this visibility ratio. The callback compares against
 * a value 0.01 lower because at the threshold crossing the reported ratio can
 * sit a float-rounding hair below the threshold itself. */
const IN_VIEW_THRESHOLD = 0.3

export type PhaseStep<P extends string> = Readonly<{ p: P; ms: number }>

/** Cascade delay for the wash → glyph → badge beat inside a phase change.
 * `active=false` (phase-zero reset, reduced motion) must return '0ms' so the
 * loop wrap snaps back instead of unwinding element by element. */
export function staggerDelay(index: number, active = true, stepMs = STAGGER_STEP): string {
  if (!active) return '0ms'
  return `${Math.max(0, index) * Math.max(0, stepMs)}ms`
}

/** One-time card entrance: fade + 12px rise on first scroll into view.
 * Reduced motion renders the final state with no transition. */
export function mockupEntranceStyle(entered: boolean, reduced: boolean): CSSProperties {
  return {
    opacity: entered || reduced ? 1 : 0,
    transform: entered || reduced ? 'translateY(0)' : 'translateY(12px)',
    transition: reduced
      ? 'none'
      : `opacity ${DUR_SLOW}ms ${EASE_OUT}, transform ${DUR_SLOW}ms ${EASE_OUT}`,
  }
}

/** The final "receipt" panel of a phase-loop mockup: the payoff frame gets a
 * slightly delayed, deliberate rise; the reset back to hidden is undelayed. */
export function revealPanelStyle(visible: boolean): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity ${DUR_SLOW}ms ${EASE_OUT}, transform ${DUR_SLOW}ms ${EASE_OUT}`,
    transitionDelay: visible ? `${REVEAL_DELAY}ms` : '0ms',
  }
}

export interface MockupStartState {
  ref: RefObject<HTMLDivElement | null>
  running: boolean
  reduced: boolean
  entered: boolean
}

/** Reduced-motion + in-view plumbing. `running` is true only while the card
 * is ≥30% in the viewport AND the tab is visible, so phase loops pause both
 * off-screen and in background tabs (browser timer throttling would desync
 * them anyway). `entered` latches on first intersection and never clears —
 * it drives the one-time entrance. */
export function useMockupStart(): MockupStartState {
  const [inView, setInView] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mql.matches)
    sync()
    // Safari <14 only has the deprecated addListener API.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', sync)
      return () => mql.removeEventListener('change', sync)
    }
    mql.addListener(sync)
    return () => mql.removeListener(sync)
  }, [])

  useEffect(() => {
    if (typeof document.addEventListener !== 'function') return
    const sync = () => setPageVisible(document.visibilityState !== 'hidden')
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver !== 'function') {
      // Without an observer a card would otherwise sit invisible forever;
      // losing the scroll-triggered entrance beats a blank card.
      const fallback = setTimeout(() => {
        setInView(true)
        setHasEntered(true)
      }, 0)
      return () => clearTimeout(fallback)
    }
    const io = new IntersectionObserver(
      (entries) => {
        // Running follows only the NEWEST entry: a batched enter+exit pair
        // from a fast scroll must not leave the loop running off-screen.
        const last = entries[entries.length - 1]
        const visible = last.isIntersecting && last.intersectionRatio >= IN_VIEW_THRESHOLD - 0.01
        setInView(visible)
        // The entrance latches on ANY intersection in the batch, not the 30%
        // ratio: a card taller than ~3x the viewport (400% zoom, WCAG reflow)
        // never reaches 30% visibility and would otherwise stay at opacity 0
        // forever.
        if (entries.some(e => e.isIntersecting)) setHasEntered(true)
      },
      { threshold: [0, IN_VIEW_THRESHOLD] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return {
    ref,
    running: !reduced && inView && pageVisible,
    reduced,
    entered: reduced || hasEntered,
  }
}

/** Narrative phase loop in the ForsikringHusstandMockup style: a SEQ of
 * (phase, ms) steps advancing on slow, deliberate timing and looping via
 * modulo. Reduced motion pins the final phase; scrolling away (or hiding
 * the tab) pauses the loop and it resumes from the same phase, restarting
 * that phase's full hold time. Returns an `at(target)` comparator so
 * consumers don't hand-maintain their own phase order.
 * NOTE: pass a module-level SEQ constant — an inline array literal in the
 * deps would restart the effect on every render. */
export function usePhaseLoop<P extends string>(seq: readonly PhaseStep<P>[]): {
  ref: RefObject<HTMLDivElement | null>
  phase: P
  at: (target: P) => boolean
  running: boolean
  reduced: boolean
  entered: boolean
} {
  const { ref, running, reduced, entered } = useMockupStart()
  const [idx, setIdx] = useState(0)
  const idxRef = useRef(0)

  useEffect(() => {
    idxRef.current = idx
  }, [idx])

  useEffect(() => {
    if (!running || reduced) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let i = idxRef.current
    const next = () => {
      if (cancelled) return
      timer = setTimeout(() => {
        if (cancelled) return
        i = (i + 1) % seq.length
        setIdx(i)
        next()
      }, seq[i].ms)
    }
    next()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [running, reduced, seq])

  const phase = reduced ? seq[seq.length - 1].p : seq[idx].p
  const order = seq.map(s => s.p)
  const at = (target: P) => order.indexOf(phase) >= order.indexOf(target)
  return { ref, phase, at, running, reduced, entered }
}

export function CardHeader({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: string }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-widest mb-0.5" style={{ color: INK_MUTED }}>
          {eyebrow}
        </p>
        <p className="text-base font-bold" style={{ color: FOREST }}>
          {title}
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={30} height={30} style={{ width: 30, height: 30, flexShrink: 0 }} />
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: INK_MUTED }}>
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-xl px-3.5 py-3 text-[14px] font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a3d22]'

export const fieldStyle = { background: SAGE_WASH, border: `1px solid ${CARD_BORDER}`, color: 'var(--forest)' }

/** Danish number input: dots before 3-digit groups are thousands separators
 * ("1.200" = 1200), the comma starts decimals ("2,50" = 2.5). The whole
 * string must be a number — trailing junk ("1200foo") and multiple commas
 * are rejected, not silently truncated. Returns NaN for missing, malformed,
 * or out-of-range values. */
export function parseDanishNumber(v: string, min: number, max: number): number {
  const s = v.trim()
  if (!/^[0-9]+(\.[0-9]{3})*(,[0-9]+)?$/.test(s) && !/^[0-9]+([.,][0-9]+)?$/.test(s)) return NaN
  const n = parseFloat(s.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'))
  return Number.isFinite(n) && n >= min && n <= max ? n : NaN
}
