'use client'

import { useState } from 'react'
import { Logo } from '@/components/Logo'

// Slot-machine rolling number — stacks two values and slides between them
function Slot({ from, to, hovered, h = 20 }: { from: string; to: string; hovered: boolean; h?: number }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: h, verticalAlign: 'middle' }}>
      <span style={{
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-50%)' : 'translateY(0%)',
        transition: 'transform 0.85s cubic-bezier(0.34, 1.2, 0.64, 1)',
      }}>
        <span style={{ height: h, display: 'flex', alignItems: 'center' }}>{from}</span>
        <span style={{ height: h, display: 'flex', alignItems: 'center' }}>{to}</span>
      </span>
    </span>
  )
}

export default function IPhoneMockup() {
  const [hovered, setHovered] = useState(false)
  const [wobbling, setWobbling] = useState(false)

  function onEnter() {
    setHovered(true)
    setWobbling(true)
    setTimeout(() => setWobbling(false), 1000)
  }

  // D: progress bar values
  const barPct  = hovered ? 81  : 74
  const barDkk  = hovered ? 403 : 374

  return (
    // A: float up on hover
    <div
      className="mx-auto select-none cursor-default"
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        transition: hovered
          ? 'transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)'
          : 'transform 0.5s ease',
      }}
    >
      {/* B: wobble on entry */}
      <div
        style={{
          position: 'relative',
          width: 270,
          height: 560,
          animation: wobbling ? 'phone-wobble 1s ease' : 'none',
        }}
      >
        {/* Drop shadow — deepens on hover */}
        <div
          style={{
            position: 'absolute',
            inset: '-8%',
            background: hovered ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.32)',
            filter: hovered ? 'blur(52px)' : 'blur(40px)',
            borderRadius: 80,
            zIndex: -1,
            transition: 'background 0.4s ease, filter 0.4s ease',
          }}
        />

        {/* Phone body */}
        <div style={{
          width: '100%', height: '100%', borderRadius: 52, padding: 8,
          background: 'linear-gradient(150deg, #2e2e2e 0%, #141414 45%, #111111 100%)',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.13)',
            'inset 2px 0 0 rgba(255,255,255,0.07)',
            'inset -1px 0 0 rgba(0,0,0,0.6)',
            'inset 0 -1px 0 rgba(0,0,0,0.5)',
          ].join(', '),
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 44, background: '#000', overflow: 'hidden', position: 'relative' }}>

            {/* Screen content */}
            <div className="flex flex-col" style={{ position: 'absolute', inset: 0, background: 'var(--cream)', borderRadius: 44, overflow: 'hidden' }}>

              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-12 pb-1 shrink-0">
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-dark)' }}>9:41</span>
                <div className="flex items-center gap-1">
                  <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
                    <rect x="0" y="3" width="3" height="7" rx="1" fill="#0d2818" opacity="0.3"/>
                    <rect x="4" y="2" width="3" height="8" rx="1" fill="#0d2818" opacity="0.5"/>
                    <rect x="8" y="0.5" width="3" height="9.5" rx="1" fill="#0d2818" opacity="0.7"/>
                    <rect x="12" y="0" width="3" height="10" rx="1" fill="#0d2818"/>
                  </svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                    <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#0d2818" strokeOpacity="0.35"/>
                    <rect x="2" y="2" width="17" height="8" rx="2" fill="#0d2818"/>
                    <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="#0d2818" opacity="0.4"/>
                  </svg>
                </div>
              </div>

              {/* App header */}
              <div className="px-5 pt-2 pb-3 shrink-0">
                <p className="text-[10px] font-medium uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-light)' }}>Altid Energi</p>
                <h2 className="text-base font-bold" style={{ color: 'var(--forest)' }}>Min strøm</h2>
              </div>

              {/* Spot price card — C: rolling spot price, F: badge pulse */}
              <div className="mx-4 mb-2.5 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0" style={{ background: 'var(--forest)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(168,224,99,0.15)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" fill="#a8e063"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Spotpris nu</p>
                  {/* C: rolling spot price */}
                  <p className="text-[15px] font-bold text-white leading-none">
                    <Slot from="1,23" to="0,87" hovered={hovered} h={20} /> kr./kWh
                  </p>
                </div>
                {/* F: badge glow pulse on hover */}
                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0"
                  style={{
                    background: 'rgba(168,224,99,0.15)',
                    color: 'var(--sage)',
                    animation: hovered ? 'badge-glow 1.4s ease 2' : 'none',
                  }}
                >
                  Lav ↓
                </span>
              </div>

              {/* D: Monthly estimate with animated bar */}
              <div className="mx-4 mb-2.5 px-4 py-3 rounded-2xl shrink-0" style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)' }}>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-[11px] font-medium" style={{ color: 'var(--text-light)' }}>Estimat april</p>
                  <p className="text-[12px] font-bold" style={{ color: 'var(--forest)' }}>
                    <Slot from="374" to="403" hovered={hovered} h={17} /> / 500 kr.
                  </p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(27,104,64,0.1)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barPct}%`,
                      background: 'var(--forest)',
                      transition: 'width 1s cubic-bezier(0.34, 1.2, 0.64, 1)',
                    }}
                  />
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-light)' }}>
                  <Slot from="74" to="81" hovered={hovered} h={14} />% af estimeret forbrug
                </p>
              </div>

              {/* Usage + C: rolling savings */}
              <div className="mx-4 grid grid-cols-2 gap-2 mb-2.5 shrink-0">
                <div className="px-3 py-3 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)' }}>
                  <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-light)' }}>Forbrug</p>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text-dark)' }}>287 kWh</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-light)' }}>denne måned</p>
                </div>
                <div className="px-3 py-3 rounded-2xl" style={{ background: 'rgba(168,224,99,0.15)', border: '1px solid rgba(168,224,99,0.25)' }}>
                  <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--forest)' }}>Du sparer</p>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--forest)' }}>
                    <Slot from="112" to="138" hovered={hovered} h={19} /> kr.
                  </p>
                  <p className="text-[9px]" style={{ color: 'var(--text-mid)' }}>vs. Ørsted</p>
                </div>
              </div>

              {/* E: tip card swap */}
              <div className="mx-4 shrink-0" style={{ position: 'relative', height: 46 }}>
                {/* Tip 1 — initial */}
                <div
                  className="absolute inset-0 px-4 py-2.5 rounded-2xl flex items-center gap-2.5"
                  style={{
                    background: 'rgba(245,240,118,0.2)',
                    border: '1px solid rgba(245,240,118,0.35)',
                    opacity: hovered ? 0 : 1,
                    transition: 'opacity 0.5s ease',
                  }}
                >
                  <span style={{ fontSize: 13 }}>⚡</span>
                  <p className="text-[10px] leading-tight" style={{ color: 'var(--text-dark)' }}>
                    <strong>Lav pris nu.</strong> Godt tidspunkt at vaske tøj.
                  </p>
                </div>
                {/* Tip 2 — on hover */}
                <div
                  className="absolute inset-0 px-4 py-2.5 rounded-2xl flex items-center gap-2.5"
                  style={{
                    background: 'rgba(168,224,99,0.15)',
                    border: '1px solid rgba(168,224,99,0.3)',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.3s',
                  }}
                >
                  <span style={{ fontSize: 13 }}>🚗</span>
                  <p className="text-[10px] leading-tight" style={{ color: 'var(--forest)' }}>
                    <strong>Oplad bilen nu.</strong> Du sparer 23 kr. i dag.
                  </p>
                </div>
              </div>

              {/* Logo */}
              <div className="flex justify-center mt-auto pt-3">
                <Logo style={{ height: 22, width: 'auto', color: 'var(--forest)', opacity: 0.35 }} />
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-3 pt-2">
                <div className="w-24 h-1 rounded-full" style={{ background: 'rgba(13,40,24,0.2)' }}/>
              </div>
            </div>

            {/* Glass reflection */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 44,
              background: 'linear-gradient(130deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 30%, transparent 55%)',
              pointerEvents: 'none', zIndex: 10,
            }}/>

            {/* Dynamic island */}
            <div style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
              width: 95, height: 28, background: '#000', borderRadius: 20, zIndex: 20,
            }}/>
          </div>
        </div>
      </div>
    </div>
  )
}
