'use client'

import { useEffect, useRef, useState } from 'react'

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
      <img src={icon} alt="" style={{ width: 30, height: 30, flexShrink: 0 }} />
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

/** Reduced-motion + in-view plumbing: `running` is true only while the card
 * is in the viewport, so phase loops pause off-screen. */
export function useMockupStart() {
  const [running, setRunning] = useState(false)
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
    const el = ref.current
    if (!el || reduced) return
    if (typeof IntersectionObserver !== 'function') {
      const fallback = setTimeout(() => setRunning(true), 1500)
      return () => clearTimeout(fallback)
    }
    const io = new IntersectionObserver(
      (entries) => setRunning(entries.some(e => e.isIntersecting)),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return { ref, running, reduced }
}

/** Narrative phase loop in the ForsikringHusstandMockup style: a SEQ of
 * (phase, ms) steps advancing on slow, deliberate timing and looping via
 * modulo. Reduced motion pins the final phase; scrolling away pauses the
 * loop and it resumes from the same phase. Returns an `at(target)`
 * comparator so consumers don't hand-maintain their own phase order.
 * NOTE: pass a module-level SEQ constant — an inline array literal in the
 * deps would restart the effect on every render. */
export function usePhaseLoop<P extends string>(seq: readonly { p: P; ms: number }[]) {
  const { ref, running, reduced } = useMockupStart()
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
  const at = (target: P) => {
    const order = seq.map(s => s.p)
    return order.indexOf(phase) >= order.indexOf(target)
  }
  return { ref, phase, at, reduced }
}
