'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { INITIAL_CONSENT } from 'altid-consent'
import { ConsentBlock } from 'altid-consent/react'

// The newsletter signup (lib/newsletter.ts stores it). Sits on the forest
// surface under the store pills, deliberately quieter than they are.

const NEWSLETTER = {
  title: 'Få nyheder fra Altid Hjem',
  emailLabel: 'E-mail',
  button: 'Tilmeld',
  buttonPending: 'Tilmelder…',
  success: 'Tak. Du hører fra os.',
  invalidEmail: 'Skriv en gyldig e-mailadresse.',
  consentMissing: 'Sæt kryds i feltet for at tilmelde dig.',
  tooMany: 'Du har prøvet for mange gange. Prøv igen senere.',
  failed: 'Vi kunne ikke tilmelde dig lige nu. Prøv igen om et øjeblik.',
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONSENT_COLORS = { text: 'rgba(255,255,255,0.72)', muted: 'rgba(255,255,255,0.72)', accent: '#90ff7c' }

type Status = 'idle' | 'sending' | 'done'
type Problem = { message: string; field?: 'email' | 'consent' } | null

export default function NewsletterForm({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(INITIAL_CONSENT)
  const [status, setStatus] = useState<Status>('idle')
  const [problem, setProblem] = useState<Problem>(null)
  const emailId = useId()
  const statusId = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (status === 'done') successRef.current?.focus()
  }, [status])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    const address = email.trim()
    if (!EMAIL_RE.test(address)) {
      setProblem({ message: NEWSLETTER.invalidEmail, field: 'email' })
      emailRef.current?.focus()
      return
    }
    if (!consent.checked) {
      setProblem({ message: NEWSLETTER.consentMissing, field: 'consent' })
      // ConsentBlock owns its checkbox and takes no ref.
      consentRef.current?.querySelector('input')?.focus()
      return
    }
    setProblem(null)
    setStatus('sending')
    let answer: number
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'newsletter', scope: 'hjem', email: address, consent: true }),
      })
      answer = res.status
    } catch (err) {
      console.error('newsletter request failed', err)
      answer = 0
    }
    if (answer >= 200 && answer < 300) {
      setStatus('done')
      return
    }
    setStatus('idle')
    if (answer === 400) setProblem({ message: NEWSLETTER.invalidEmail, field: 'email' })
    else setProblem({ message: answer === 429 ? NEWSLETTER.tooMany : NEWSLETTER.failed })
  }

  if (status === 'done') {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={`text-[16px] leading-[1.6] text-white outline-none ${className}`}
      >
        {NEWSLETTER.success}
      </p>
    )
  }

  const sending = status === 'sending'
  return (
    <form onSubmit={submit} noValidate className={`w-full max-w-[440px] text-left ${className}`}>
      <h3 className="text-[17px] font-medium leading-snug text-white">{NEWSLETTER.title}</h3>
      <label htmlFor={emailId} className="mt-4 block text-[14px] leading-snug text-white/80">
        {NEWSLETTER.emailLabel}
      </label>
      <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
        <input
          ref={emailRef}
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={problem?.field === 'email'}
          aria-describedby={problem?.field === 'email' ? statusId : undefined}
          className="min-h-[48px] w-full min-w-0 flex-1 rounded-[14px] border border-white/40 bg-transparent px-4 text-[16px] text-white focus-visible:border-[#90ff7c]"
        />
        <button
          type="submit"
          disabled={sending}
          className="min-h-[48px] shrink-0 cursor-pointer rounded-[14px] border border-white/60 bg-transparent px-6 text-[16px] font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-70"
        >
          {sending ? NEWSLETTER.buttonPending : NEWSLETTER.button}
        </button>
      </div>
      <div ref={consentRef}>
        <ConsentBlock
          brand="hjem"
          dark
          colors={CONSENT_COLORS}
          spacing={{ marginTop: 14, marginBottom: 0 }}
          value={consent}
          onChange={setConsent}
        />
      </div>
      <p id={statusId} aria-live="polite" className="mt-2.5 min-h-[1.25rem] text-[14px] font-medium leading-snug text-[#ffbab8]">
        {problem?.message}
      </p>
    </form>
  )
}
