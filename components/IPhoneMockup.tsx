'use client'

import { useState, useRef, useEffect } from 'react'
import { Logo } from '@/components/Logo'

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
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function onEnter() { setHovered(true) }
  function onLeave() { setHovered(false) }

  useEffect(() => {
    if (!navigator.maxTouchPoints) return
    const t1 = setTimeout(() => {
      setHovered(true)
      resetTimerRef.current = setTimeout(() => setHovered(false), 3200)
    }, 1800)
    return () => clearTimeout(t1)
  }, [])

  return (
    <div
      className="mx-auto select-none cursor-default"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={() => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(onLeave, 2800)
      }}
      style={{
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        transition: hovered
          ? 'transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)'
          : 'transform 0.5s ease',
      }}
    >
      <div style={{ position: 'relative', width: 270, height: 560 }}>
        {/* Drop shadow */}
        <div style={{
          position: 'absolute', inset: '-8%',
          background: hovered ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.32)',
          filter: hovered ? 'blur(52px)' : 'blur(40px)',
          borderRadius: 80, zIndex: -1,
          transition: 'background 0.4s ease, filter 0.4s ease',
        }}/>

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

            {/* Screen */}
            <div className="flex flex-col" style={{ position: 'absolute', inset: 0, background: 'var(--cream)', borderRadius: 44, overflow: 'hidden' }}>

              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
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

              {/* Header */}
              <div className="px-5 pt-1 pb-2 shrink-0">
                <p className="text-[10px] font-medium uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-light)' }}>Hej, velkommen hjem</p>
                <h2 className="text-base font-bold" style={{ color: 'var(--forest)' }}>Dit overblik</h2>
              </div>

              {/* Hero savings card */}
              <div className="mx-4 mb-2 px-4 py-3 rounded-2xl shrink-0" style={{ background: 'var(--forest)' }}>
                <p className="text-[10px] font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Samlet besparelse</p>
                <p className="font-bold text-white leading-none mb-1.5" style={{ fontSize: 22 }}>
                  <Slot from="892" to="1.034" hovered={hovered} h={28} />
                  <span className="font-medium opacity-60" style={{ fontSize: 14 }}> kr./md.</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a8e063' }}/>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a8e063' }}/>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a8e063' }}/>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: hovered ? '#a8e063' : 'rgba(168,224,99,0.28)', transition: 'background 0.5s ease' }}/>
                  </div>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <Slot from="3" to="4" hovered={hovered} h={14} /> aktive produkter
                  </p>
                </div>
              </div>

              {/* 2x2 service grid */}
              <div className="mx-4 grid grid-cols-2 gap-2 mb-2 shrink-0">

                {/* Energi */}
                <div className="px-3 py-2.5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(168,224,99,0.22)' }}>
                      <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
                        <path d="M5.5 1L1 6H4.5L3.5 10L8 5H4.5L5.5 1Z" fill="#1a3d22"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-light)' }}>Energi</span>
                  </div>
                  <p className="font-bold leading-none mb-0.5" style={{ fontSize: 13, color: 'var(--text-dark)' }}>
                    <Slot from="1,23" to="0,87" hovered={hovered} h={18} />
                    <span className="font-medium opacity-55" style={{ fontSize: 9 }}> kr./kWh</span>
                  </p>
                  <span className="font-semibold" style={{ fontSize: 9, color: '#1a6e3c' }}>Lav pris ↓</span>
                </div>

                {/* Forsikring */}
                <div className="px-3 py-2.5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(143,204,255,0.22)' }}>
                      <svg width="10" height="11" viewBox="0 0 10 11" fill="none">
                        <path d="M5 1L1 3V6C1 8.2 2.8 10.2 5 11C7.2 10.2 9 8.2 9 6V3L5 1Z" fill="#2e6da8"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-light)' }}>Forsikring</span>
                  </div>
                  <p className="font-bold leading-none mb-0.5" style={{ fontSize: 13, color: 'var(--text-dark)' }}>
                    389<span className="font-medium opacity-55" style={{ fontSize: 9 }}> kr./md.</span>
                  </p>
                  <span className="font-semibold" style={{ fontSize: 9, color: '#2e6da8' }}>Aktiv ✓</span>
                </div>

                {/* Ladning */}
                <div className="px-3 py-2.5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(245,240,118,0.28)' }}>
                      <svg width="10" height="11" viewBox="0 0 10 11" fill="none">
                        <path d="M5.5 1L2 6H5L4 10L8 5H5L5.5 1Z" fill="#7a6a00"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-light)' }}>Ladning</span>
                  </div>
                  <p className="font-bold leading-none mb-0.5" style={{ fontSize: 13, color: 'var(--text-dark)' }}>02:00</p>
                  <span className="font-semibold" style={{ fontSize: 9, color: '#7a6a00' }}>Optimal tid</span>
                </div>

                {/* Mobil — activates on hover */}
                <div
                  className="px-3 py-2.5 rounded-2xl"
                  style={{
                    background: hovered ? 'rgba(168,224,99,0.12)' : 'white',
                    border: hovered ? '1px solid rgba(168,224,99,0.4)' : '1px dashed rgba(27,104,64,0.22)',
                    transition: 'background 0.45s ease, border-color 0.45s ease',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(189,176,249,0.28)' }}>
                      <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
                        <rect x="0.5" y="0.5" width="6" height="10" rx="1.5" stroke="#5040b0" strokeWidth="1.2" fill="none"/>
                        <rect x="2.5" y="8.5" width="2" height="1" rx="0.5" fill="#5040b0"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-light)' }}>Mobil</span>
                  </div>
                  <p className="font-bold leading-none mb-0.5" style={{ fontSize: 13, color: hovered ? 'var(--forest)' : 'var(--text-dark)', transition: 'color 0.35s ease' }}>
                    <Slot from="119" to="89" hovered={hovered} h={18} />
                    <span className="font-medium opacity-55" style={{ fontSize: 9 }}> kr./md.</span>
                  </p>
                  <span className="font-semibold" style={{ fontSize: 9, color: hovered ? '#1a6e3c' : '#5040b0', transition: 'color 0.35s ease' }}>
                    {hovered ? 'Spar 30 kr. ↓' : 'Tilføj →'}
                  </span>
                </div>
              </div>

              {/* Smart Tip card — swaps on hover */}
              <div className="mx-4 shrink-0" style={{ position: 'relative', height: 82, overflow: 'hidden' }}>

                {/* Tip A — energy (default) */}
                <div
                  className="absolute inset-0 px-3.5 py-3 rounded-2xl flex flex-col gap-1"
                  style={{
                    background: 'var(--forest)',
                    opacity: hovered ? 0 : 1,
                    transform: hovered ? 'translateX(-12%)' : 'translateX(0)',
                    transition: 'opacity 0.3s ease, transform 0.4s ease',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                      <path d="M4.5 1L1 5.5H4L3 9L7 4.5H4L4.5 1Z" fill="#a8e063"/>
                    </svg>
                    <span className="font-semibold uppercase tracking-widest" style={{ fontSize: 8, color: 'rgba(168,224,99,0.8)' }}>Smart tip</span>
                  </div>
                  <p className="font-bold text-white" style={{ fontSize: 11, lineHeight: 1.3 }}>
                    Kør opvaskeren kl. 14 og spar 4 kr.
                  </p>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
                    Lav elpris kl. 13–15 i dag
                  </p>
                  <span className="font-semibold" style={{ fontSize: 9, color: '#a8e063' }}>Se alle besparelser →</span>
                </div>

                {/* Tip B — AI household (hover) */}
                <div
                  className="absolute inset-0 px-3.5 py-3 rounded-2xl flex flex-col gap-1"
                  style={{
                    background: 'var(--forest)',
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translateX(0)' : 'translateX(110%)',
                    transition: hovered
                      ? 'opacity 0.3s ease 0.1s, transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1) 0.1s'
                      : 'opacity 0.25s ease, transform 0.35s ease',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: 9, lineHeight: 1 }}>🤖</span>
                    <span className="font-semibold uppercase tracking-widest" style={{ fontSize: 8, color: 'rgba(168,224,99,0.8)' }}>Smart tip</span>
                  </div>
                  <p className="font-bold text-white" style={{ fontSize: 11, lineHeight: 1.3 }}>
                    Ugeplanen er klar
                  </p>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
                    5 måltider bestilt på Nemlig
                  </p>
                  <span className="font-semibold" style={{ fontSize: 9, color: '#a8e063' }}>Se ugeplanen →</span>
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
