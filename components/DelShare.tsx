'use client'

import * as amplitude from '@amplitude/analytics-browser'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { BUTTON_PRIMARY } from '@/lib/typography'
import { SHARE_TEXT, SHARE_TITLE, SHARE_URL, SHARE_URL_SHORT } from '@/lib/share-page'

type Method = 'native' | 'copy'

const FOREST = '#163223'
const SIGNAL = '#90ff7c'
const MUTED = '#6f6a61'
const SAND = '#e6e2d8'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163223]'

// Browser capabilities read during render. Nothing to subscribe to, they do not
// change while the page is open. The server cannot know them: null there.
const noSubscribe = () => () => {}
function useBrowserValue(read: () => boolean): boolean | null {
  return useSyncExternalStore<boolean | null>(noSubscribe, read, () => null)
}

// The cookie banner (components/CookieBanner.tsx) is fixed to the bottom of the
// screen and, on a phone, about as tall as half of it. /del is short, so with
// the banner open the share controls sit under it and the page cannot scroll.
// While the banner is in the DOM, reserve its height below the content so the
// controls can be scrolled up above it. Consent stays as it is.
const COOKIE_BANNER = '[aria-labelledby="cookie-banner-title"]'
function subscribeCookieBanner(onChange: () => void) {
  const mo = new MutationObserver(onChange)
  mo.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('resize', onChange)
  return () => {
    mo.disconnect()
    window.removeEventListener('resize', onChange)
  }
}
function cookieBannerHeight(): number {
  const el = document.querySelector(COOKIE_BANNER)
  return el ? Math.ceil(el.getBoundingClientRect().height) : 0
}

// The system share glyph (a box with an arrow up out of it), so the button reads
// as the phone's own share action.
function ShareIcon() {
  return (
    <svg data-icon="share" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg data-icon="copy" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg data-icon="check" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export default function DelShare({ via }: { via: string }) {
  const bannerHeight = useSyncExternalStore(subscribeCookieBanner, cookieBannerHeight, () => 0)
  const canNativeShare = useBrowserValue(() => typeof navigator.share === 'function')

  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const sharing = useRef(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(copiedTimer.current), [])

  function track(method: Method) {
    amplitude.track('Share Page Shared', { method, via })
  }

  // Must run straight from the tap: browsers only open the share sheet on a
  // user gesture.
  async function nativeShare() {
    // A second tap while the sheet is open rejects with InvalidStateError,
    // which would show the error line next to an open sheet.
    if (sharing.current) return
    sharing.current = true
    setNotice('')
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL })
    } catch (err) {
      // AbortError: the person closed the sheet. Not a failure, nothing to say.
      if ((err as Error)?.name === 'AbortError') return
      setNotice('Delingen virkede ikke. Kopiér linket i stedet.')
      return
    } finally {
      sharing.current = false
    }
    track('native')
  }

  function selectAll(input: HTMLInputElement) {
    input.focus()
    // setSelectionRange, not select(): iOS Safari ignores select() on inputs.
    input.setSelectionRange(0, input.value.length)
  }

  function selectLink() {
    if (inputRef.current) selectAll(inputRef.current)
    setNotice('Linket er markeret, så du kan kopiere det.')
  }

  async function copyLink() {
    setNotice('')
    setCopied(false)
    if (!navigator.clipboard?.writeText) {
      selectLink()
      return
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL)
    } catch {
      // Clipboard refused (permissions, insecure context): hand the person the
      // selected link instead of claiming it was copied.
      selectLink()
      return
    }
    track('copy')
    setCopied(true)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="mx-auto w-full max-w-md"
      // Banner height + its 12px offset (bottom-3) + 16px air + the safe area.
      style={bannerHeight ? { paddingBottom: `calc(${bannerHeight + 28}px + env(safe-area-inset-bottom))` } : undefined}
    >
      <h1 style={{ color: FOREST }} className="text-[32px] font-medium leading-tight sm:text-[40px]">
        Del Altid Hjem
      </h1>
      <p style={{ color: MUTED }} className="mt-3 text-base leading-relaxed">
        Send Altid Hjem videre til en ven eller din partner. Det er gratis at komme i gang.
      </p>

      {/* Before hydration the server cannot know whether the browser shares
          natively: keep the button's space so the field below does not jump
          down under the thumb when it appears. */}
      {canNativeShare === null && <div aria-hidden="true" className="mt-8 h-[66px]" />}
      {canNativeShare === true && (
        <button
          type="button"
          onClick={nativeShare}
          style={{ background: SIGNAL, color: FOREST }}
          className={`mt-8 flex w-full items-center justify-center gap-2 ${BUTTON_PRIMARY} transition-opacity hover:opacity-90 ${FOCUS}`}
        >
          <ShareIcon />
          Del
        </button>
      )}
      {canNativeShare === false && (
        <p style={{ color: FOREST }} className="mt-8 text-base">
          Kopiér linket, og send det videre.
        </p>
      )}

      {/* The link with its copy button at the right end, like a share field. */}
      <div
        className={`${canNativeShare === false ? 'mt-3' : 'mt-4'} flex min-h-[52px] items-center gap-2 rounded-2xl border bg-white py-1 pl-4 pr-1`}
        style={{ borderColor: SAND }}
      >
        <label htmlFor="del-link" className="sr-only">
          Link til Altid Hjem
        </label>
        <input
          id="del-link"
          ref={inputRef}
          readOnly
          value={SHARE_URL_SHORT}
          onClick={(e) => selectAll(e.currentTarget)}
          style={{ color: FOREST }}
          className={`min-w-0 flex-1 truncate bg-transparent text-base outline-none ${FOCUS}`}
        />
        <button
          type="button"
          onClick={copyLink}
          aria-label={copied ? 'Kopieret' : 'Kopiér link'}
          style={copied ? { background: SIGNAL, color: FOREST } : { background: FOREST, color: '#ffffff' }}
          className={`flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-colors ${FOCUS}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span className="hidden sm:inline">{copied ? 'Kopieret' : 'Kopiér'}</span>
        </button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Kopieret' : ''}
      </span>

      {/* Always mounted: screen readers announce a live region's text changes,
          not a region that appears together with its text. */}
      <p role="status" style={{ color: FOREST }} className={notice ? 'mt-4 text-sm' : 'sr-only'}>
        {notice}
      </p>

      {/* On a computer: scan, and share from the phone (QR = this page, via=qr). */}
      <div
        className="mt-10 hidden items-center gap-5 rounded-2xl border p-5 md:flex"
        style={{ background: '#ffffff', borderColor: SAND }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/del/qr-del.png" alt="QR-kode til siden Del Altid Hjem" width={120} height={120} className="block" />
        <p style={{ color: FOREST }} className="text-base leading-relaxed">
          Scan med telefonen, så kan du dele derfra
        </p>
      </div>
    </div>
  )
}
