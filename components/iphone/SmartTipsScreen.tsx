'use client'

import { ReactNode } from 'react'
import { TabBar, HomeIndicator } from './PhoneShell'

type Props = { hovered: boolean }

type Tip = {
  category: string
  when: string
  title: string
  reason: string
  saving: string
  bgIcon: string
  icon: ReactNode
  isNew?: boolean
}

const tips: Tip[] = [
  {
    category: 'Energi',
    when: 'i dag',
    title: 'Kør opvasker kl. 14',
    reason: 'Lavest elpris i dag',
    saving: '+4 kr.',
    bgIcon: 'transparent',
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-strom.svg" alt="" style={{ width: 18, height: 18 }} />
    ),
  },
  {
    category: 'Mobil',
    when: 'denne uge',
    title: 'Skift til mindre datapakke',
    reason: 'Du bruger kun 4 GB / md.',
    saving: '+30 kr./md.',
    bgIcon: 'transparent',
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-mobil.svg" alt="" style={{ width: 18, height: 18 }} />
    ),
  },
  {
    category: 'Forsikring',
    when: 'denne uge',
    title: 'Saml indbo og ulykke',
    reason: 'Aftaler udløber 1. juni',
    saving: '+180 kr./md.',
    bgIcon: 'transparent',
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/services/icon-forsikring.svg" alt="" style={{ width: 18, height: 18 }} />
    ),
  },
  {
    category: 'Internet',
    when: 'lige nu',
    title: 'Skift til mindre pakke',
    isNew: true,
    reason: 'Du bruger kun 8% af din kapacitet',
    saving: '+100 kr./md.',
    bgIcon: 'rgba(245,240,118,0.32)',
    icon: (
      <svg width="11" height="9" viewBox="0 0 12 9" fill="none">
        <path d="M6 7.5C6.4 7.5 6.7 7.8 6.7 8.2C6.7 8.6 6.4 9 6 9C5.6 9 5.3 8.6 5.3 8.2C5.3 7.8 5.6 7.5 6 7.5Z" fill="#7a6a00" />
        <path d="M3 5.2C3.8 4.4 4.9 4 6 4C7.1 4 8.2 4.4 9 5.2" stroke="#7a6a00" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <path d="M1 3C2.4 1.7 4.1 1 6 1C7.9 1 9.6 1.7 11 3" stroke="#7a6a00" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
]

function NumberSlot({ from, to, hovered }: { from: number; to: number; hovered: boolean }) {
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

export default function SmartTipsScreen({ hovered }: Props) {
  return (
    <>
      <div className="px-5 pt-2 pb-3 shrink-0 flex items-start justify-between">
        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-widest mb-0.5"
            style={{ color: 'var(--text-light)' }}
          >
            Til dig
          </p>
          <h2 className="text-base font-bold" style={{ color: 'var(--forest)' }}>
            Anbefalinger
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 7px',
            borderRadius: 999,
            background: 'rgba(168,224,99,0.18)',
            marginTop: 2,
            boxShadow: hovered ? '0 0 0 3px rgba(168,224,99,0.18)' : 'none',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#1a6e3c',
              animation: 'tips-dot-pulse 1.6s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: 8, fontWeight: 700, color: '#1a6e3c', letterSpacing: '0.06em' }}>
            PERSONLIG AI
          </span>
        </div>
      </div>

      <div
        className="mx-4 mb-3 px-4 py-2.5 rounded-2xl shrink-0 flex items-center justify-between"
        style={{ background: 'var(--forest)' }}
      >
        <div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 1 }}>
            Du kan spare i denne uge
          </p>
          <p className="font-bold text-white" style={{ fontSize: 20, lineHeight: 1 }}>
            <NumberSlot from={247} to={347} hovered={hovered} />{' '}
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.55 }}>kr.</span>
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 999,
            background: 'rgba(168,224,99,0.18)',
            border: '1px solid rgba(168,224,99,0.3)',
            animation: hovered ? 'tips-badge-glow 1.4s ease 2' : 'none',
          }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, color: '#90FF7C', letterSpacing: '0.06em' }}>
            <NumberSlot from={3} to={4} hovered={hovered} />
            <span style={{ marginLeft: 3 }}>NYE</span>
          </span>
        </div>
      </div>

      <div
        className="mx-4 flex flex-col shrink-0"
        style={{
          gap: hovered ? 4 : 6,
          transition: 'gap 0.4s ease',
        }}
      >
        {tips.map((tip, i) => {
          const isNew = !!tip.isNew

          const cardEl = (
            <div
              className="px-3 rounded-2xl"
              style={{
                background: 'white',
                paddingTop: hovered ? 6 : 8,
                paddingBottom: hovered ? 6 : 8,
                border: '1px solid rgba(27,104,64,0.08)',
                transition:
                  'border 0.4s ease, box-shadow 0.4s ease, padding-top 0.4s ease, padding-bottom 0.4s ease',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: hovered ? 2 : 4, transition: 'margin-bottom 0.4s ease' }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: tip.bgIcon,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {tip.icon}
                </div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {tip.category}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    color: 'rgba(13,40,24,0.35)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  · {tip.when}
                </span>
              </div>

              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-dark)',
                  lineHeight: 1.2,
                  marginBottom: 1,
                }}
              >
                {tip.title}
              </p>
              <div
                style={{
                  maxHeight: hovered ? 0 : 14,
                  opacity: hovered ? 0 : 1,
                  overflow: 'hidden',
                  transition: hovered
                    ? 'max-height 0.35s ease, opacity 0.2s ease'
                    : 'max-height 0.4s ease 0.1s, opacity 0.3s ease 0.2s',
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    color: 'var(--text-light)',
                    lineHeight: 1.25,
                    marginBottom: 4,
                  }}
                >
                  {tip.reason}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#1a6e3c',
                  }}
                >
                  Spar {tip.saving}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: '#90FF7C',
                    color: '#163223',
                    letterSpacing: '0.04em',
                  }}
                >
                  Aktivér
                </span>
              </div>
            </div>
          )

          if (isNew) {
            return (
              <div
                key={tip.title}
                style={{
                  maxHeight: hovered ? 90 : 0,
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
                  overflow: 'hidden',
                  transition: hovered
                    ? 'max-height 0.45s ease, opacity 0.35s ease, transform 0.4s ease'
                    : 'max-height 0.3s ease, opacity 0.2s ease, transform 0.3s ease',
                }}
              >
                {cardEl}
              </div>
            )
          }

          return <div key={tip.title}>{cardEl}</div>
        })}
      </div>

      <TabBar active="sparetips" />
      <HomeIndicator />

      <style jsx>{`
        @keyframes tips-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes tips-badge-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        }
      `}</style>
    </>
  )
}
