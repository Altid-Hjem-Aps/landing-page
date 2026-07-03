'use client'

import { useState } from 'react'
import { motion, type MotionValue, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import {
  MEMBERS,
  OLD_TOTAL,
  SAVING,
  YEAR_SAVING,
  RECEIPT_ROWS,
  T,
  memberReveal,
  chipReveal,
  totalReveal,
  serviceFlip,
  memberDone,
  savedSoFar,
  totalMonthly,
  chipAmount,
  collapseAmt,
  rowReveal,
  monthlyReveal,
  yearBoxReveal,
  yearValue,
  assistantStatus,
} from './cards'

// The "Min husstand" screen INSIDE the Altid Hjem phone — modelled directly on
// the household card from /hvad-koster-forsikring (ForsikringHusstandMockup):
// same assistant bar, member rows, chip states, collapse and receipt pattern,
// but driven by the section's single entranceProgress clock. The phone shell
// (and tab bar) around it lives in WhatIs.tsx's CardStage.

type Props = {
  /** Full entranceProgress 0..1. Static (receipt end state) when omitted. */
  progress?: MotionValue<number>
}

const GREEN_BG = 'rgba(144,255,124,0.5)'
const GREY_BG = 'rgba(22,50,35,0.08)'

export function HouseholdScreen({ progress }: Props) {
  const fallback = useMotionValue(1)
  const src = progress ?? fallback
  const active = !!progress

  // The members view hands over to the receipt view (hard switch, like the
  // forsikring card's phase === 'total' branch).
  const [receipt, setReceipt] = useState(() => !active || src.get() >= T.receiptAt)
  useMotionValueEvent(src, 'change', (p) => setReceipt(p >= T.receiptAt))

  return (
    <div className="flex-1 min-h-0 flex flex-col px-3.5 pt-1" style={{ color: '#163223' }}>
      <p style={{ fontSize: 15, fontWeight: 700 }}>Min husstand</p>
      <p style={{ fontSize: 9.5, color: 'rgba(22,50,35,0.5)', marginBottom: 8 }}>3 medlemmer</p>

      <AssistantBar src={src} active={active} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {receipt ? <Receipt src={src} active={active} /> : <MembersView src={src} active={active} />}
      </div>
    </div>
  )
}

// === The Altid Assistent — forest bar, sage avatar (forsikring design) ===
function AssistantBar({ src, active }: { src: MotionValue<number>; active: boolean }) {
  const text = useTransform(src, (p) => (active ? assistantStatus(p).text : assistantStatus(1).text))
  const doneOpacity = useTransform(src, (p) => (active ? (assistantStatus(p).done ? 1 : 0) : 1))
  const spinOpacity = useTransform(doneOpacity, (d) => 1 - d)

  return (
    <div className="flex items-center gap-2 rounded-2xl mb-2" style={{ background: '#193D23', padding: '8px 10px' }}>
      <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: '#90FF7C' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" fill="#163223" />
          <circle cx="18.5" cy="17.5" r="2" fill="#163223" />
        </svg>
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#fff' }}>Altid Assistent</p>
        <motion.p
          style={{ fontSize: 9, color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {text}
        </motion.p>
      </div>
      <span className="relative shrink-0" style={{ width: 15, height: 15 }}>
        <motion.span
          className="absolute animate-spin rounded-full"
          style={{ inset: 1, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', opacity: spinOpacity }}
        />
        <motion.span
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{ background: '#90FF7C', color: '#163223', fontSize: 9, fontWeight: 800, opacity: doneOpacity }}
        >
          ✓
        </motion.span>
      </span>
    </div>
  )
}

// === Person icon (copied from the forsikring card) ===
function PersonIcon({ child = false }: { child?: boolean }) {
  const s = child ? 14 : 17
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy={child ? 9 : 8} r={child ? 3.1 : 4} fill="#163223" />
      <path d={child ? 'M6.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2Z' : 'M3.5 20.5c0-4 3.8-7 8.5-7s8.5 3 8.5 7Z'} fill="#163223" />
    </svg>
  )
}

// === Household view: members + their service chips + the running totals ===
function MembersView({ src, active }: { src: MotionValue<number>; active: boolean }) {
  return (
    <div className="flex flex-col">
      {MEMBERS.map((m, i) => (
        <MemberRow key={m.name} index={i} src={src} active={active} />
      ))}
      <TotalsBlock src={src} active={active} />
    </div>
  )
}

function MemberRow({ index, src, active }: { index: number; src: MotionValue<number>; active: boolean }) {
  const m = MEMBERS[index]

  // Sized to each card's actual chip rows so nothing is cropped: the adults
  // wrap to three rows (~85px of content), the child now wraps to two
  // (Mobil/Ulykke + Skolemad). Adults were over-tall (104) which pushed the
  // child + totals against the tab bar — trimmed so the whole stack clears it.
  const rowH = m.role === 'adult' ? 92 : 72

  // Appears while the household loads; folds away bottom-up in the collapse.
  const maxHeight = useTransform(src, (p) => (active ? rowH * memberReveal(p, index) * (1 - collapseAmt(p, index)) : rowH))
  const opacity = useTransform(src, (p) => (active ? memberReveal(p, index) * (1 - collapseAmt(p, index)) : 1))
  const marginTop = useTransform(src, (p) => {
    const shown = active ? memberReveal(p, index) * (1 - collapseAmt(p, index)) : 1
    return index === 0 ? 0 : 6 * shown
  })
  // Avatar: grey while loading/working → sage when the member is optimised.
  const avatarBg = useTransform(src, (p) => ((active ? memberDone(p, index) : 1) > 0.5 ? GREEN_BG : GREY_BG))

  return (
    <motion.div style={{ maxHeight, opacity, marginTop, overflow: 'hidden' }}>
      <div
        className="rounded-2xl flex items-center gap-2"
        style={{ background: '#ffffff', border: '1px solid rgba(22,50,35,0.08)', padding: '7px 9px' }}
      >
        <motion.span
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{ width: 26, height: 26, background: avatarBg }}
        >
          <PersonIcon child={m.role === 'child'} />
        </motion.span>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 10.5, fontWeight: 600 }}>
            {m.name}
            <span style={{ fontSize: 8.5, fontWeight: 400, color: 'rgba(22,50,35,0.4)' }}>{m.role === 'adult' ? ' · voksen' : ' · barn'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-1" style={{ marginTop: 2 }}>
            {m.services.map((svc, j) => (
              <ServiceChip key={svc.label} memberIndex={index} serviceIndex={j} src={src} active={active} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// A service chip with its subbrand icon: neutral while loading → green ✓ once
// the assistant has optimised it (the forsikring card's Tag pattern).
function ServiceChip({
  memberIndex,
  serviceIndex,
  src,
  active,
}: {
  memberIndex: number
  serviceIndex: number
  src: MotionValue<number>
  active: boolean
}) {
  const svc = MEMBERS[memberIndex].services[serviceIndex]
  const opacity = useTransform(src, (p) => (active ? chipReveal(p, memberIndex, serviceIndex) : 1))
  const flip = useTransform(src, (p) => (active ? serviceFlip(p, memberIndex, serviceIndex) : 1))
  const bg = useTransform(flip, (f) => (f > 0.5 ? 'rgba(144,255,124,0.28)' : 'rgba(22,50,35,0.06)'))
  const color = useTransform(flip, (f) => (f > 0.5 ? '#163223' : 'rgba(22,50,35,0.6)'))
  const checkOpacity = flip

  return (
    <motion.span
      className="inline-flex items-center gap-1 rounded-full"
      style={{ fontSize: 8.5, fontWeight: 400, padding: '2px 6px', background: bg, color, whiteSpace: 'nowrap', opacity }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={svc.icon} alt="" style={{ width: 9, height: 9 }} />
      {svc.label}
      <motion.span
        className="inline-flex items-center justify-center shrink-0"
        style={{ width: 9, height: 9, borderRadius: '50%', background: '#163223', color: '#fff', fontSize: 6.5, fontWeight: 700, lineHeight: 1, opacity: checkOpacity }}
      >
        ✓
      </motion.span>
    </motion.span>
  )
}

const fmtMd = (n: number) => `${n.toLocaleString('da-DK')} kr./md.`

// The running numbers under the members: current monthly total (ticks down)
// and the real-time saving with its "+X kr." chip (forsikring pattern).
function TotalsBlock({ src, active }: { src: MotionValue<number>; active: boolean }) {
  const maxHeight = useTransform(src, (p) => (active ? 72 * totalReveal(p) * (1 - collapseAmt(p, 3)) : 72))
  const opacity = useTransform(src, (p) => (active ? totalReveal(p) * (1 - collapseAmt(p, 3)) : 1))
  const totalText = useTransform(src, (p) => (active ? fmtMd(totalMonthly(p)) : fmtMd(OLD_TOTAL - SAVING)))
  const savedText = useTransform(src, (p) => (active ? fmtMd(savedSoFar(p)) : fmtMd(SAVING)))
  const chipText = useTransform(src, (p) => (active ? `+${chipAmount(p).toLocaleString('da-DK')} kr.` : ''))
  const chipOpacity = useTransform(src, (p) => (active && chipAmount(p) > 0 ? 1 : 0))

  return (
    <motion.div style={{ maxHeight, opacity, overflow: 'hidden' }}>
      <div style={{ paddingTop: 9, marginTop: 6, borderTop: '1px solid rgba(22,50,35,0.1)' }}>
        <div className="flex items-center justify-between">
          <p style={{ fontSize: 9.5, color: 'rgba(22,50,35,0.55)' }}>Samlet pr. måned</p>
          <motion.span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{totalText}</motion.span>
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
          <p style={{ fontSize: 9.5, color: 'rgba(22,50,35,0.55)' }}>Sparet i alt</p>
          <div className="flex items-center gap-1.5">
            <motion.span
              className="rounded-full"
              style={{ fontSize: 8.5, fontWeight: 700, padding: '2px 6px', background: '#90FF7C', color: '#163223', opacity: chipOpacity }}
            >
              {chipText}
            </motion.span>
            <motion.span style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{savedText}</motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// === The final summary view (the forsikring card's Bill pattern) ===
function Receipt({ src, active }: { src: MotionValue<number>; active: boolean }) {
  const year = useTransform(src, (p) => (active ? yearValue(p) : YEAR_SAVING))
  const yearText = useTransform(year, (v) => v.toLocaleString('da-DK'))

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 10.5, fontWeight: 700 }}>Det optimerede vi</p>

      <div className="flex flex-col gap-1.5" style={{ marginTop: 8 }}>
        {RECEIPT_ROWS.map((row, i) => (
          <ReceiptRow key={row.label} index={i} src={src} active={active} />
        ))}
      </div>

      {/* Slack goes AFTER the rows so the sum and the sage card sit at the
          bottom of the screen (same as the forsikring receipt). */}
      <div style={{ marginTop: 'auto', paddingBottom: 8 }}>
        <RevealBlock src={src} active={active} at={(p) => monthlyReveal(p)}>
          <div style={{ borderTop: '1px dashed rgba(22,50,35,0.25)', margin: '8px 0' }} />
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10.5, fontWeight: 700 }}>I sparer månedligt</span>
            <span style={{ fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{SAVING.toLocaleString('da-DK')} kr./md.</span>
          </div>
        </RevealBlock>

        <RevealBlock src={src} active={active} at={(p) => yearBoxReveal(p)} scaleIn>
          <div className="rounded-2xl text-center" style={{ marginTop: 8, padding: '11px 10px', background: '#90FF7C' }}>
            <p style={{ fontSize: 9.5, fontWeight: 600, color: 'rgba(22,50,35,0.7)' }}>I sparer nu</p>
            <motion.p style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, color: '#163223', fontVariantNumeric: 'tabular-nums' }}>
              {yearText}
            </motion.p>
            <p style={{ fontSize: 9.5, fontWeight: 600, color: 'rgba(22,50,35,0.7)' }}>kr. årligt</p>
          </div>
        </RevealBlock>
      </div>
    </div>
  )
}

function ReceiptRow({ index, src, active }: { index: number; src: MotionValue<number>; active: boolean }) {
  const row = RECEIPT_ROWS[index]
  const opacity = useTransform(src, (p) => (active ? rowReveal(p, index) : 1))
  const y = useTransform(opacity, (o) => (1 - o) * 6)

  return (
    <motion.div className="flex items-center justify-between" style={{ opacity, y }}>
      <span style={{ fontSize: 10, color: 'rgba(22,50,35,0.7)' }}>
        <span style={{ color: '#163223', fontWeight: 700, marginRight: 4 }}>✓</span>
        {row.label}
      </span>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#163223' }}>−{row.save.toLocaleString('da-DK')} kr./md.</span>
    </motion.div>
  )
}

// Small helper: a block whose opacity/lift follows a progress window.
function RevealBlock({
  src,
  active,
  at,
  scaleIn = false,
  children,
}: {
  src: MotionValue<number>
  active: boolean
  at: (p: number) => number
  scaleIn?: boolean
  children: React.ReactNode
}) {
  const v = useTransform(src, (p) => (active ? at(p) : 1))
  const scale = useTransform(v, (o) => (scaleIn ? 0.96 + o * 0.04 : 1))
  const y = useTransform(v, (o) => (scaleIn ? 0 : (1 - o) * 6))
  return <motion.div style={{ opacity: v, scale, y }}>{children}</motion.div>
}
