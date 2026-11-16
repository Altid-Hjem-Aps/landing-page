'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { INITIAL_CONSENT } from 'altid-consent'
import { ConsentBlock } from 'altid-consent/react'

// The newsletter signup (lib/newsletter.ts stores it). Sits on the forest
// surface under the store pills, deliberately quieter than they are.

// True once the form runs in the browser. Before that (a slow phone still loading the page's
// script) a press on "Tilmeld" would post the form natively to a page that does not take it,
// and the address would be lost without a word (review 16/11), so the button waits until then.
const noSubscribe = () => () => {}
const useLive = () => useSyncExternalStore(noSubscribe, () => true, () => false)

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

// Types its lines into the empty field's placeholder one letter at a time, holds each, wipes it
// and types the next, round and round; one line is typed once and stays. The first line comes
// first; the rest come in a new order on each visit. It pauses while the
// field has focus or text, and with reduced motion the first line simply stands there.
const TYPE_MS = 70
const WIPE_MS = 35
const HOLD_MS = 1800
function useTypewriter(input: React.RefObject<HTMLInputElement | null>, lines: readonly string[] | undefined, quiet: boolean) {
  useEffect(() => {
    const field = input.current
    if (!field || !lines?.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      field.setAttribute('placeholder', lines[0])
      return
    }
    const [first, ...rest] = lines
    const order = [first, ...[...rest].sort(() => Math.random() - 0.5)]
    let line = 0
    let shown = 0
    let wiping = false
    let timer = 0
    const step = () => {
      if (quiet || document.activeElement === field) {
        timer = window.setTimeout(step, 400)
        return
      }
      const text = order[line]
      if (!wiping) {
        shown += 1
        field.setAttribute('placeholder', text.slice(0, shown))
        if (shown < text.length) return void (timer = window.setTimeout(step, TYPE_MS))
        if (order.length === 1) return
        wiping = true
        return void (timer = window.setTimeout(step, HOLD_MS))
      }
      shown -= 1
      field.setAttribute('placeholder', text.slice(0, shown))
      if (shown > 0) return void (timer = window.setTimeout(step, WIPE_MS))
      wiping = false
      line = (line + 1) % order.length
      timer = window.setTimeout(step, 300)
    }
    timer = window.setTimeout(step, 600)
    return () => window.clearTimeout(timer)
  }, [input, lines, quiet])
}

/** `heading={false}`: the place around it names it (the new site's footer column "Nyhedsbrev").
 * `typewriter`: the field's label is kept for screen readers only, and these lines are typed into
 * its placeholder instead (the footer, Thor 15/11). */
export default function NewsletterForm({ className = '', heading = true, typewriter }: { className?: string; heading?: boolean; typewriter?: readonly string[] }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(INITIAL_CONSENT)
  const [status, setStatus] = useState<Status>('idle')
  const [problem, setProblem] = useState<Problem>(null)
  const emailId = useId()
  const statusId = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)
  useTypewriter(emailRef, typewriter, email.length > 0)
  const live = useLive()

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
    <form method="post" onSubmit={submit} noValidate className={`w-full max-w-[440px] text-left ${className}`}>
      {heading ? <h3 className="text-[17px] font-medium leading-snug text-white">{NEWSLETTER.title}</h3> : null}
      <label htmlFor={emailId} className={typewriter ? 'sr-only' : `${heading ? 'mt-4' : ''} block text-[14px] leading-snug text-white/80`}>
        {NEWSLETTER.emailLabel}
      </label>
      <div className={`${typewriter ? '' : 'mt-1.5'} flex flex-col gap-2.5 sm:flex-row`}>
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
          className="min-h-[48px] w-full min-w-0 flex-1 rounded-[14px] border border-white/40 bg-transparent px-4 text-[16px] text-white placeholder:text-white/55 focus-visible:border-[#90ff7c]"
        />
        {/* Once something is typed, the button takes the site's Signal green, as its other buttons (Thor 15/11). */}
        <button
          type="submit"
          disabled={sending || !live}
          data-ready={email.trim() ? 'true' : undefined}
          className="min-h-[48px] shrink-0 cursor-pointer rounded-[14px] border border-white/60 bg-transparent px-6 text-[16px] font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-70 data-[ready=true]:border-[#90ff7c] data-[ready=true]:bg-[#90ff7c] data-[ready=true]:text-[#003c16] data-[ready=true]:hover:bg-[#90ff7c] data-[ready=true]:hover:opacity-90"
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
