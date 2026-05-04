'use client'

import { useState, useEffect } from 'react'
import { AltidMark } from '@/components/AltidMark'

type View = 'form' | 'questions' | 'success'

const DK_ELECTRICITY_PROVIDERS = [
  'AURA Energi',
  'Clever',
  'EWII',
  'Energi Fyn',
  'Energi Viborg',
  'Forsyning Helsingør',
  'Gasel',
  'Goenergi',
  'Jysk Energi',
  'Modstrøm',
  'NRGi',
  'Natur-Energi',
  'Nord Energi',
  'Norlys',
  'OK',
  'Ravdex',
  'SE (Stofa Energi)',
  'SEAS-NVE',
  'Scanenergi',
  'Strøm Fyn',
  'TREFOR El',
  'Vindstød',
  'Velkommen',
  'Verdo',
  'Ørsted',
  'Aal El-Net',
  'Andet',
]

interface Props {
  variant?: 'light' | 'dark'
  id?: string
}

export default function WaitlistForm({ variant = 'light', id }: Props) {
  const [view, setView] = useState<View>('form')
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupId, setSignupId] = useState('')

  const [phone, setPhone] = useState('')

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  }
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [age, setAge] = useState('')
  const [household, setHousehold] = useState('')
  const [why, setWhy] = useState('')
  const [electricity, setElectricity] = useState('')

  const isDark = variant === 'dark'

  // Listen for nav CTA click to auto-expand
  useEffect(() => {
    if (isDark) return
    function handleExpand() {
      setExpanded(true)
      setTimeout(() => {
        document.getElementById('name-input-hero')?.focus()
      }, 60)
    }
    window.addEventListener('expand-waitlist', handleExpand)
    return () => window.removeEventListener('expand-waitlist', handleExpand)
  }, [isDark])

  async function submitStep1() {
    if (!phone || !email || !name) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, email, step: 1 }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Noget gik galt. Prøv igen.')
      return
    }
    setSignupId(data.id)
    setView('questions')
  }

  async function submitStep2() {
    setLoading(true)
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: signupId, age, household, why, electricity, step: 2 }),
    })
    setLoading(false)
    setView('success')
  }

  // ─── Dark variant (BottomCta) ──────────────────────────────────────────────

  const darkInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: 15,
    outline: 'none',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 14,
    color: 'white',
    fontFamily: 'var(--font-onest)',
  }

  const darkLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 6,
    color: 'rgba(255,255,255,0.5)',
  }

  if (isDark) {
    if (view === 'success') return <SuccessCard />

    if (view === 'questions') {
      return (
        <form id={id} onSubmit={e => { e.preventDefault(); submitStep2() }} className="rounded-[20px] p-6 sm:p-10" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-xl font-bold mb-1 text-white">Hjælp os med at gøre Altid Hjem endnu bedre.</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Svar på 4 korte spørgsmål.</p>
          <div className="flex flex-col gap-3 mb-5">
            <div>
              <label style={darkLabelStyle}>Alder</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Din alder" style={darkInputStyle} className="placeholder:text-white/40" />
            </div>
            <div>
              <label style={darkLabelStyle}>Antal i husstanden</label>
              <select value={household} onChange={e => setHousehold(e.target.value)} style={{ ...darkInputStyle, cursor: 'pointer' }} className="appearance-none">
                <option value="" disabled>Vælg antal</option>
                {['1','2','3','4','5+'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={darkLabelStyle}>Hvorfor har du skrevet dig op?</label>
              <input value={why} onChange={e => setWhy(e.target.value)} placeholder="Fortæl os kort..." style={darkInputStyle} className="placeholder:text-white/40" />
            </div>
            <div>
              <label style={darkLabelStyle}>Hvilket elselskab har du i dag?</label>
              <select value={electricity} onChange={e => setElectricity(e.target.value)} style={{ ...darkInputStyle, cursor: 'pointer' }} className="appearance-none">
                <option value="" disabled>Vælg elselskab</option>
                {DK_ELECTRICITY_PROVIDERS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-[10px] text-[15px] font-semibold disabled:opacity-60" style={{ background: 'var(--sage)', color: 'var(--forest)' }}>
              {loading ? 'Sender...' : 'Indsend'}
            </button>
            <button type="button" onClick={() => setView('success')} className="w-full py-3 rounded-[10px] text-sm font-medium border" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>
              Ikke nu
            </button>
          </div>
          <p className="text-xs text-center mt-3.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Dine svar bruges kun til at forbedre Altid Hjem.
          </p>
        </form>
      )
    }

    return (
      <form id={id} onSubmit={e => { e.preventDefault(); submitStep1() }} className="rounded-[20px] p-6 sm:p-10" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="text-2xl font-bold text-white mb-1">Skriv dig gratis på ventelisten</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Få tidlig adgang, når appen lanceres.</p>
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label style={darkLabelStyle}>Navn</label>
            <input name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Dit fulde navn" style={darkInputStyle} className="placeholder:text-white/40" />
          </div>
          <div>
            <label style={darkLabelStyle}>E-mail</label>
            <input type="email" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="din@email.dk" style={darkInputStyle} className="placeholder:text-white/40" />
          </div>
          <div>
            <label style={darkLabelStyle}>Mobil</label>
            <div className="flex overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14 }}>
              <span className="flex items-center px-3 text-sm font-medium border-r select-none shrink-0" style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' }}>+45</span>
              <input type="tel" name="tel" autoComplete="tel" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="12 34 56 78" className="flex-1 placeholder:text-white/40" style={{ padding: '14px 12px', fontSize: 15, outline: 'none', background: 'transparent', color: 'white', fontFamily: 'var(--font-onest)' }} />
            </div>
          </div>
        </div>
        {error && <p className="text-sm mb-3 text-center" style={{ color: '#ff8080' }}>{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-[10px] text-[15px] font-semibold disabled:opacity-60" style={{ background: 'var(--sage)', color: 'var(--forest)' }}>
          {loading ? 'Sender...' : 'Skriv mig på ventelisten →'}
        </button>
        <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Gratis. Ingen spam. <AltidMark dark />
        </p>
        <p className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <a href="/privatlivspolitik" className="underline underline-offset-2 hover:opacity-50 transition-opacity">Privatlivspolitik</a>
        </p>
      </form>
    )
  }

  // ─── Light variant (Hero) ─────────────────────────────────────────────────

  if (view === 'success') return <SuccessCard />

  if (view === 'questions') {
    return (
      <form id={id} onSubmit={e => { e.preventDefault(); submitStep2() }}>
        <div className="rounded-2xl p-2 mb-3" style={{ background: 'rgba(168,224,99,0.08)', border: '1px solid rgba(168,224,99,0.2)' }}>
          <h3 className="text-white font-bold text-lg px-3 pt-3 mb-1">Hjælp os med at gøre det bedre.</h3>
          <p className="text-sm px-3 pb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>4 korte spørgsmål.</p>
          <div className="flex flex-col gap-1.5 px-1 pb-1">
            {[
              { label: 'Alder', el: <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Din alder" className="w-full px-4 rounded-xl text-[15px] outline-none placeholder:text-[#999] bg-white" style={{ height: 50, fontFamily: 'var(--font-onest)', color: 'var(--text-dark)' }} /> },
              { label: 'Antal i husstanden', el: <select value={household} onChange={e => setHousehold(e.target.value)} className="w-full px-4 rounded-xl text-[15px] outline-none appearance-none bg-white cursor-pointer" style={{ height: 50, fontFamily: 'var(--font-onest)', color: household ? 'var(--text-dark)' : '#999' }}><option value="" disabled>Vælg antal</option>{['1','2','3','4','5+'].map(o => <option key={o}>{o}</option>)}</select> },
              { label: 'Hvorfor har du skrevet dig op?', el: <input value={why} onChange={e => setWhy(e.target.value)} placeholder="Fortæl os kort..." className="w-full px-4 rounded-xl text-[15px] outline-none placeholder:text-[#999] bg-white" style={{ height: 50, fontFamily: 'var(--font-onest)', color: 'var(--text-dark)' }} /> },
              { label: 'Hvilket elselskab har du i dag?', el: <select value={electricity} onChange={e => setElectricity(e.target.value)} className="w-full px-4 rounded-xl text-[15px] outline-none appearance-none bg-white cursor-pointer" style={{ height: 50, fontFamily: 'var(--font-onest)', color: electricity ? 'var(--text-dark)' : '#999' }}><option value="" disabled>Vælg elselskab</option>{DK_ELECTRICITY_PROVIDERS.map(o => <option key={o}>{o}</option>)}</select> },
            ].map(({ label, el }) => (
              <div key={label} className="pb-0.5">
                <label className="block text-[11px] font-semibold tracking-widest uppercase mb-1 px-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</label>
                {el}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl text-[15px] font-semibold disabled:opacity-60" style={{ background: 'var(--sage)', color: 'var(--forest)' }}>
            {loading ? 'Sender...' : 'Indsend'}
          </button>
          <button type="button" onClick={() => setView('success')} className="w-full py-3 rounded-2xl text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
            Ikke nu
          </button>
        </div>
      </form>
    )
  }

  return (
    <form id={id} onSubmit={e => { e.preventDefault(); submitStep1() }}>

      {/* Beat 1: container grows (button drops). Beat 2: fields fade+slide in. */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s cubic-bezier(0, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          {/* Entire form card invisible during beat 1 — no clipping visible */}
          <div
            className="rounded-2xl p-2 mb-2"
            style={{
              background: 'rgba(168,224,99,0.07)',
              border: '1px solid rgba(168,224,99,0.3)',
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
              transition: expanded
                ? 'opacity 0.2s ease 0.3s, transform 0.25s ease 0.28s'
                : 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                id="name-input-hero"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dit fulde navn"
                className="w-full rounded-xl placeholder:text-[#bbb]"
                style={{ height: 52, padding: '0 16px', fontSize: 15, outline: 'none', background: 'white', color: 'var(--text-dark)', fontFamily: 'var(--font-onest)' }}
              />
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
              >
                <input
                  id="email-input-hero"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Din e-mailadresse"
                  className="flex-1 placeholder:text-[#bbb]"
                  style={{ height: 56, padding: '0 16px', fontSize: 16, outline: 'none', background: 'transparent', color: 'var(--text-dark)', fontFamily: 'var(--font-onest)' }}
                />
              </div>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ background: 'white' }}>
                <span
                  className="flex items-center justify-center pl-4 pr-3 text-sm font-semibold select-none border-r shrink-0"
                  style={{ height: 52, color: 'var(--text-mid)', borderColor: 'rgba(27,104,64,0.1)', background: 'var(--cream)' }}
                >
                  🇩🇰 +45
                </span>
                <input
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))}
                  placeholder="Dit mobilnummer"
                  className="flex-1 placeholder:text-[#bbb]"
                  style={{ height: 52, padding: '0 16px', fontSize: 15, outline: 'none', background: 'transparent', color: 'var(--text-dark)', fontFamily: 'var(--font-onest)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single button — always visible, drops down as fields expand above it */}
      {error && <p className="text-sm mb-2 text-center" style={{ color: '#ff8080' }}>{error}</p>}
      <button
        type={expanded ? 'submit' : 'button'}
        onClick={!expanded ? () => { setExpanded(true); setTimeout(() => document.getElementById('name-input-hero')?.focus(), 60) } : undefined}
        disabled={expanded && loading}
        className="w-full py-4 rounded-2xl text-[15px] font-semibold disabled:opacity-60"
        style={{
          background: 'var(--sage)',
          color: 'var(--forest)',
          animation: !expanded ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }}
      >
        {expanded ? (loading ? 'Sender...' : 'Skriv mig på ventelisten →') : 'Skriv dig på ventelisten →'}
      </button>

      {/* Microcopy — travels with button */}
      <p className="text-xs text-center mt-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {expanded ? <>Gratis. Ingen spam. <AltidMark dark /></> : 'Vær blandt de første — vi giver dig besked, når appen er klar.'}
      </p>
      {expanded && (
        <p className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
          <a href="/privatlivspolitik" className="underline underline-offset-2 hover:opacity-50 transition-opacity">Privatlivspolitik</a>
        </p>
      )}

    </form>
  )
}

export function SuccessCard() {
  return (
    <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'rgba(168,224,99,0.08)', border: '1px solid rgba(168,224,99,0.2)' }}>
      <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">Tak. Du er med.</h3>
      <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Vi giver dig besked, så snart Altid Hjem åbner dørene.
      </p>

      <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a
          href="https://altidenergi.dk/galleri/?_gl=1*g0q8vi*_up*MQ..*_ga*NTIwMDkxNzQ4LjE3Nzc0Njc5MzQ.*_ga_ZESHL2Q0DX*czE3Nzc0Njc5MzMkbzEkZzAkdDE3Nzc0Njc5MzMkajYwJGwwJGgxNTQwNDUyNTc1"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Altid Energi hjælper danske familier med at forstå deres elregning. Tjek din egen, mens du venter.
          </p>
          <span
            className="inline-block mt-3 text-sm font-medium group-hover:opacity-70 transition-opacity"
            style={{ color: '#73d0e7', borderBottom: '1px solid rgba(115,208,231,0.4)', paddingBottom: 1 }}
          >
            altidenergi.dk
          </span>
          <div className="mt-5">
            <img src="/altidenergi-logo-stamp.svg" alt="Altid Energi" style={{ height: 26, width: 'auto', opacity: 0.95 }} />
          </div>
        </a>
      </div>
    </div>
  )
}
