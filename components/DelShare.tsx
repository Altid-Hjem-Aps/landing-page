'use client'

import * as amplitude from '@amplitude/analytics-browser'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { BUTTON_PRIMARY } from '@/lib/typography'
import { SHARE_TEXT, SHARE_TITLE, isAndroid, shareChannelLinks, shareUrl } from '@/lib/share-page'

type Method = 'native' | 'copy' | 'whatsapp' | 'sms' | 'mail'

const FOREST = '#163223'
const SIGNAL = '#90ff7c'
const MUTED = '#6f6a61'
const SAGE = '#eef2ec'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163223]'

// Browser capabilities read during render. Nothing to subscribe to, they do not
// change while the page is open. The server cannot know them: null there.
const noSubscribe = () => () => {}
function useBrowserValue(read: () => boolean): boolean | null {
  return useSyncExternalStore<boolean | null>(noSubscribe, read, () => null)
}

// The cookie banner (components/CookieBanner.tsx) is fixed to the bottom of the
// screen and, on a phone, about as tall as half of it. /del is short, so with
// the banner open the share buttons sit under it and the page cannot scroll.
// While the banner is in the DOM, reserve its height below the content so the
// buttons can be scrolled up above it. Consent stays as it is.
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

export default function DelShare({ via }: { via: string }) {
  const bannerHeight = useSyncExternalStore(subscribeCookieBanner, cookieBannerHeight, () => 0)
  const url = shareUrl(via)
  const canNativeShare = useBrowserValue(() => typeof navigator.share === 'function')
  const android = useBrowserValue(() => isAndroid(navigator.userAgent))
  const links = shareChannelLinks(via, { android: android === true })

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
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url })
    } catch (err) {
      // AbortError: the person closed the sheet. Not a failure, nothing to say.
      if ((err as Error)?.name === 'AbortError') return
      setNotice('Delingen virkede ikke. Brug en af de andre knapper i stedet.')
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
      await navigator.clipboard.writeText(url)
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

  const channel = `flex min-h-[44px] items-center justify-center rounded-2xl px-3 text-sm font-medium transition-opacity hover:opacity-80 ${FOCUS}`

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
          natively: keep the button's space so the buttons below do not jump
          down under the thumb when it appears. */}
      {canNativeShare === null && <div aria-hidden="true" className="mt-8 h-[66px]" />}
      {canNativeShare === true && (
        <button
          type="button"
          onClick={nativeShare}
          style={{ background: SIGNAL, color: FOREST }}
          className={`mt-8 block w-full ${BUTTON_PRIMARY} transition-opacity hover:opacity-90 ${FOCUS}`}
        >
          Del
        </button>
      )}

      <div className={canNativeShare === false ? 'mt-8' : 'mt-4'}>
        <label htmlFor="del-link" className="sr-only">
          Link til Altid Hjem
        </label>
        <input
          id="del-link"
          ref={inputRef}
          readOnly
          value={url}
          onClick={(e) => selectAll(e.currentTarget)}
          style={{ background: '#ffffff', borderColor: '#e6e2d8', color: FOREST }}
          className={`block min-h-[44px] w-full truncate rounded-2xl border px-4 text-sm ${FOCUS}`}
        />
        <button
          type="button"
          onClick={copyLink}
          style={{ borderColor: FOREST, color: FOREST }}
          className={`mt-3 block min-h-[52px] w-full rounded-[20px] border text-center text-base font-medium transition-colors hover:bg-[#163223]/5 ${FOCUS}`}
        >
          {copied ? 'Kopieret' : 'Kopiér link'}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? 'Kopieret' : ''}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp')}
          style={{ background: SAGE, color: FOREST }}
          className={channel}
        >
          WhatsApp
        </a>
        <a href={links.sms} onClick={() => track('sms')} style={{ background: SAGE, color: FOREST }} className={channel}>
          SMS
        </a>
        <a href={links.mail} onClick={() => track('mail')} style={{ background: SAGE, color: FOREST }} className={channel}>
          Mail
        </a>
      </div>

      {/* Always mounted: screen readers announce a live region's text changes,
          not a region that appears together with its text. */}
      <p role="status" style={{ color: FOREST }} className={notice ? 'mt-4 text-sm' : 'sr-only'}>
        {notice}
      </p>

      {/* On a computer: scan, and share from the phone (QR = this page, via=qr). */}
      <div
        className="mt-10 hidden items-center gap-5 rounded-2xl border p-5 md:flex"
        style={{ background: '#ffffff', borderColor: '#e6e2d8' }}
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
