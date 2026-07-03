'use client'

import { ReactNode } from 'react'
import { TabBar, HomeIndicator } from './PhoneShell'

type Props = { hovered: boolean }

type Service = {
  label: string
  icon: ReactNode
  bgIcon: string
  bgIconActive?: string
  active: boolean
}

const services: Service[] = [
  {
    label: 'Energi',
    bgIcon: 'transparent',
    active: true,
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-strom.svg" alt="" style={{ width: 20, height: 20 }} />
    ),
  },
  {
    label: 'Mobil',
    bgIcon: 'transparent',
    active: true,
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-mobil.svg" alt="" style={{ width: 20, height: 20 }} />
    ),
  },
  {
    label: 'Forsikring',
    bgIcon: 'transparent',
    active: true,
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-forsikring.svg" alt="" style={{ width: 20, height: 20 }} />
    ),
  },
  {
    label: 'Internet',
    bgIcon: 'rgba(245,240,118,0.32)',
    active: true,
    icon: (
      <svg width="11" height="9" viewBox="0 0 12 9" fill="none">
        <path d="M6 7.5C6.4 7.5 6.7 7.8 6.7 8.2C6.7 8.6 6.4 9 6 9C5.6 9 5.3 8.6 5.3 8.2C5.3 7.8 5.6 7.5 6 7.5Z" fill="#7a6a00" />
        <path d="M3 5.2C3.8 4.4 4.9 4 6 4C7.1 4 8.2 4.4 9 5.2" stroke="#7a6a00" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <path d="M1 3C2.4 1.7 4.1 1 6 1C7.9 1 9.6 1.7 11 3" stroke="#7a6a00" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: 'Streaming',
    bgIcon: 'rgba(13,40,24,0.05)',
    bgIconActive: 'rgba(255,187,248,0.32)',
    active: false,
    icon: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M2 1.5L7.5 4.5L2 7.5V1.5Z" stroke="#5a7a62" strokeWidth="0.9" fill="none" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Alarm',
    bgIcon: 'transparent',
    active: true,
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-alarm.svg" alt="" style={{ width: 20, height: 20 }} />
    ),
  },
  {
    label: 'Madplan',
    bgIcon: 'transparent',
    active: true,
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-mad.svg" alt="" style={{ width: 20, height: 20 }} />
    ),
  },
]

function CountSlot({ from, to, hovered }: { from: number; to: number; hovered: boolean }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: 22, verticalAlign: 'middle' }}>
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? 'translateY(-50%)' : 'translateY(0%)',
          transition: 'transform 0.85s cubic-bezier(0.34, 1.2, 0.64, 1)',
        }}
      >
        <span style={{ height: 22, display: 'flex', alignItems: 'center' }}>{from}</span>
        <span style={{ height: 22, display: 'flex', alignItems: 'center' }}>{to}</span>
      </span>
    </span>
  )
}

export default function SubbrandsScreen({ hovered }: Props) {
  const baseActive = services.filter(s => s.active).length
  const total = services.length
  const activeOnHover = total

  return (
    <>
      <div className="px-5 pt-2 pb-3 shrink-0">
        <p
          className="text-[10px] font-medium uppercase tracking-widest mb-0.5"
          style={{ color: 'var(--text-light)' }}
        >
          Mine tjenester
        </p>
        <h2 className="text-base font-bold" style={{ color: 'var(--forest)' }}>
          Alt på ét sted
        </h2>
      </div>

      <div
        className="mx-4 mb-3 px-4 py-2.5 rounded-2xl shrink-0 flex items-center justify-between"
        style={{ background: 'var(--forest)' }}
      >
        <div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 1 }}>Aktiveret</p>
          <p className="font-bold text-white" style={{ fontSize: 20, lineHeight: 1 }}>
            <CountSlot from={baseActive} to={activeOnHover} hovered={hovered} />{' '}
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.55 }}>af {total}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          {services.map((s, i) => {
            const isLitAtRest = s.active
            const isLit = isLitAtRest || hovered
            return (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  display: 'block',
                  background: isLit ? '#90FF7C' : 'rgba(168,224,99,0.22)',
                  boxShadow: isLit && hovered ? '0 0 6px rgba(168,224,99,0.55)' : 'none',
                  transition: 'background 0.4s ease, box-shadow 0.4s ease',
                  transitionDelay: !isLitAtRest && hovered ? '0.45s' : '0s',
                }}
              />
            )
          })}
        </div>
      </div>

      <div
        className="mx-4 mb-3 rounded-2xl shrink-0"
        style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)', overflow: 'hidden' }}
      >
        {services.map((s, i) => {
          const isStreamingHover = !s.active && hovered
          const iconBg = isStreamingHover && s.bgIconActive ? s.bgIconActive : s.bgIcon
          return (
            <div
              key={s.label}
              className="flex items-center gap-2.5 px-3.5 py-2"
              style={{
                borderBottom: i < services.length - 1 ? '1px solid rgba(27,104,64,0.06)' : 'none',
                background: isStreamingHover ? 'rgba(168,224,99,0.08)' : 'transparent',
                transition: 'background 0.45s ease',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.45s ease',
                }}
              >
                {s.icon}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  flex: 1,
                  color: isStreamingHover ? 'var(--forest)' : 'var(--text-dark)',
                  transition: 'color 0.35s ease',
                }}
              >
                {s.label}
              </span>

              {s.active ? (
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: 'rgba(168,224,99,0.2)',
                    color: '#1a6e3c',
                    letterSpacing: '0.04em',
                    boxShadow: hovered ? '0 0 0 2px rgba(168,224,99,0.18)' : 'none',
                    transition: `box-shadow 0.4s ease ${i * 50}ms`,
                  }}
                >
                  ✓ AKTIV
                </span>
              ) : (
                <span style={{ position: 'relative', display: 'inline-block', width: 56, height: 14 }}>
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#1a6e3c',
                      opacity: hovered ? 0 : 1,
                      transform: hovered ? 'translateX(-8px)' : 'translateX(0)',
                      transition: hovered
                        ? 'opacity 0.25s ease, transform 0.4s ease'
                        : 'opacity 0.3s ease 0.15s, transform 0.45s ease 0.15s',
                      animation: hovered ? 'none' : 'subbrand-cta-bob 2.4s ease-in-out infinite',
                    }}
                  >
                    Tilføj →
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: '#1a6e3c',
                      opacity: hovered ? 1 : 0,
                      transform: hovered ? 'translateX(0)' : 'translateX(8px)',
                      transition: hovered
                        ? 'opacity 0.3s ease 0.2s, transform 0.45s ease 0.2s'
                        : 'opacity 0.2s ease, transform 0.3s ease',
                    }}
                  >
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 6,
                        background: 'rgba(168,224,99,0.2)',
                      }}
                    >
                      ✓ AKTIV
                    </span>
                  </span>
                </span>
              )}
            </div>
          )
        })}
      </div>

      <TabBar active="profil" />
      <HomeIndicator />

      <style jsx>{`
        @keyframes subbrand-cta-bob {
          0%, 100% { transform: translateX(0); opacity: 0.85; }
          50% { transform: translateX(2px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
