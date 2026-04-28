'use client'

import { TabBar, HomeIndicator } from './PhoneShell'

type Props = { hovered: boolean }

function Slot({ from, to, hovered, h = 20 }: { from: string; to: string; hovered: boolean; h?: number }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: h, verticalAlign: 'middle' }}>
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? 'translateY(-50%)' : 'translateY(0%)',
          transition: 'transform 0.85s cubic-bezier(0.34, 1.2, 0.64, 1)',
        }}
      >
        <span style={{ height: h, display: 'flex', alignItems: 'center' }}>{from}</span>
        <span style={{ height: h, display: 'flex', alignItems: 'center' }}>{to}</span>
      </span>
    </span>
  )
}

function EnergySparkline({ hovered }: { hovered: boolean }) {
  const line =
    'M 0,12 C 17,9 31,5 49,5 C 67,5 81,9 95,11 C 106,13 115,22 129,22 C 143,22 157,4 171,4 C 185,4 199,10 210,12'
  const fill = line + ' L 210,28 L 0,28 Z'
  return (
    <svg width="100%" height="28" viewBox="0 0 210 28" fill="none" style={{ display: 'block' }}>
      <path d={fill} fill="rgba(26,61,34,0.06)" />
      <path d={line} stroke="rgba(26,61,34,0.35)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle
        cx="129"
        cy="22"
        r="8"
        fill="rgba(168,224,99,0.25)"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />
      <circle cx="129" cy="22" r="3" fill="#1a3d22" />
    </svg>
  )
}

function PulseRings({ hovered }: { hovered: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1px solid rgba(168,224,99,0.22)',
          transform: hovered ? 'scale(1.18)' : 'scale(1)',
          opacity: hovered ? 0.7 : 0.35,
          transition: 'transform 0.65s ease, opacity 0.65s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '1px solid rgba(168,224,99,0.45)',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
          opacity: hovered ? 0.9 : 0.55,
          transition: 'transform 0.55s ease 0.05s, opacity 0.55s ease',
        }}
      />
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#a8e063',
          transform: hovered ? 'scale(1.25)' : 'scale(1)',
          transition: 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
          boxShadow: hovered ? '0 0 10px rgba(168,224,99,0.55)' : 'none',
        }}
      />
    </div>
  )
}

export default function HomeScreen({ hovered }: Props) {
  return (
    <>
      <div className="px-5 pt-2 pb-3 shrink-0 flex items-center justify-between">
        <div>
          <p
            className="text-[10px] font-medium uppercase tracking-widest mb-0.5"
            style={{ color: 'var(--text-light)' }}
          >
            Hej, velkommen hjem
          </p>
          <h2 className="text-base font-bold" style={{ color: 'var(--forest)' }}>
            Dit overblik
          </h2>
        </div>
        <PulseRings hovered={hovered} />
      </div>

      <div
        className="mx-4 mb-3 px-4 py-2.5 rounded-2xl shrink-0 flex items-center justify-between"
        style={{ background: 'var(--forest)' }}
      >
        <div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 1 }}>Samlet besparelse</p>
          <p className="font-bold text-white" style={{ fontSize: 20, lineHeight: 1 }}>
            <Slot from="892" to="1.034" hovered={hovered} h={24} />
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.55 }}> kr./md.</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                display: 'block',
                background: i < 3 ? '#a8e063' : hovered ? '#a8e063' : 'rgba(168,224,99,0.25)',
                transition: 'background 0.5s ease',
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="mx-4 mb-2 px-3.5 py-3 rounded-2xl shrink-0"
        style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(168,224,99,0.22)' }}
            >
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
                <path d="M5.5 1L1 6H4.5L3.5 10L8 5H4.5L5.5 1Z" fill="#1a3d22" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: 'var(--text-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Energi
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold" style={{ fontSize: 14, color: 'var(--text-dark)' }}>
              <Slot from="1,23" to="0,87" hovered={hovered} h={18} />
              <span style={{ fontSize: 9, fontWeight: 400, opacity: 0.5 }}> kr./kWh</span>
            </p>
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: 6,
                background: 'rgba(168,224,99,0.2)',
                color: '#1a6e3c',
                animation: hovered ? 'badge-glow 1.4s ease 2' : 'none',
              }}
            >
              Lav ↓
            </span>
          </div>
        </div>
        <EnergySparkline hovered={hovered} />
      </div>

      <div
        className="mx-4 mb-3 rounded-2xl shrink-0"
        style={{ background: 'white', border: '1px solid rgba(27,104,64,0.08)', overflow: 'hidden' }}
      >
        <div
          className="flex items-center gap-2.5 px-3.5 py-2"
          style={{ borderBottom: '1px solid rgba(27,104,64,0.06)' }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              background: 'rgba(143,204,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="10" height="11" viewBox="0 0 8 9" fill="none">
              <path d="M4 0.5L0.5 2V5C0.5 6.9 2 8.6 4 9C6 8.6 7.5 6.9 7.5 5V2L4 0.5Z" fill="#2e6da8" />
            </svg>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dark)', flex: 1 }}>
            Forsikring
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-light)' }}>389 kr./md.</span>
        </div>

        <div
          className="flex items-center gap-2.5 px-3.5 py-2"
          style={{ borderBottom: '1px solid rgba(27,104,64,0.06)' }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              background: 'rgba(245,240,118,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="9" height="10" viewBox="0 0 8 9" fill="none">
              <path d="M4.5 0.5L1 5H4L3 8.5L7 4H4L4.5 0.5Z" fill="#7a6a00" />
            </svg>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dark)', flex: 1 }}>Ladning</span>
          <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Oplader kl. 02:00</span>
        </div>

        <div
          className="flex items-center gap-2.5 px-3.5 py-2"
          style={{
            background: hovered ? 'rgba(168,224,99,0.08)' : 'transparent',
            transition: 'background 0.45s ease',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              background: 'rgba(189,176,249,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="7" height="10" viewBox="0 0 6 9" fill="none">
              <rect x="0.5" y="0.5" width="5" height="8" rx="1.2" stroke="#5040b0" strokeWidth="1" fill="none" />
              <rect x="2" y="7" width="2" height="0.8" rx="0.4" fill="#5040b0" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              flex: 1,
              color: hovered ? 'var(--forest)' : 'var(--text-dark)',
              transition: 'color 0.3s ease',
            }}
          >
            Mobil
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: hovered ? 600 : 400,
              color: hovered ? '#1a6e3c' : '#5040b0',
              transition: 'color 0.3s ease',
            }}
          >
            {hovered ? 'Spar 30 kr. ↓' : 'Tilføj →'}
          </span>
        </div>
      </div>

      <div className="mx-4 shrink-0" style={{ position: 'relative', height: 80 }}>
        <div
          className="absolute inset-0 px-3.5 py-2 rounded-2xl flex flex-col gap-1"
          style={{
            background: 'var(--forest)',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'translateX(-12%)' : 'translateX(0)',
            transition: hovered
              ? 'opacity 0.25s ease, transform 0.4s ease'
              : 'opacity 0.3s ease 0.1s, transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1) 0.1s',
          }}
        >
          <div className="flex items-center gap-1">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
              <path d="M4.5 1L1 5.5H4L3 9L7 4.5H4L4.5 1Z" fill="#a8e063" />
            </svg>
            <span
              style={{
                fontSize: 8,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(168,224,99,0.8)',
              }}
            >
              Smart tip
            </span>
          </div>
          <p className="font-bold text-white" style={{ fontSize: 11, lineHeight: 1.3 }}>
            Kør opvaskeren kl. 14 og spar 4 kr.
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
            Lav elpris kl. 13–15 i dag
          </p>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#a8e063' }}>Se alle besparelser →</span>
        </div>

        <div
          className="absolute inset-0 px-3.5 py-2 rounded-2xl flex flex-col gap-1"
          style={{
            background: 'var(--forest)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(110%)',
            transition: hovered
              ? 'opacity 0.3s ease 0.1s, transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1) 0.1s'
              : 'opacity 0.25s ease, transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1)',
          }}
        >
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 9, lineHeight: 1 }}>🤖</span>
            <span
              style={{
                fontSize: 8,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(168,224,99,0.8)',
              }}
            >
              Smart tip
            </span>
          </div>
          <p className="font-bold text-white" style={{ fontSize: 11, lineHeight: 1.3 }}>
            Ugeplanen er klar
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
            5 måltider bestilt på Nemlig
          </p>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#a8e063' }}>Se ugeplanen →</span>
        </div>
      </div>

      <TabBar active="hjem" />
      <HomeIndicator />
    </>
  )
}
