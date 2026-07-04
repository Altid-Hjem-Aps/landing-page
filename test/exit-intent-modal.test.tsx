import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import * as amplitude from '@amplitude/analytics-browser'
import ExitIntentModal from '@/components/ExitIntentModal'

// The trigger's guards are conversion-critical: a regression either kills the
// dialog silently (lost signups) or fires it on every mouseout (spams every
// visitor) — and the suite would stay green either way without these tests.

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

const nav = vi.hoisted(() => ({ path: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => nav.path }))

// The dialog body is code-split behind next/dynamic; the trigger contract is
// "renders the dialog on fire", so a stub keeps framer-motion out of jsdom.
vi.mock('next/dynamic', async () => {
  const React = await import('react')
  return {
    default: (loader: () => Promise<{ default: React.ComponentType<{ onClose: () => void }> }>) => {
      const Lazy = React.lazy(loader)
      return function DynamicStub(props: { onClose: () => void }) {
        return React.createElement(React.Suspense, { fallback: null }, React.createElement(Lazy, props))
      }
    },
  }
})
vi.mock('@/components/ExitIntentDialog', async () => {
  const React = await import('react')
  return {
    default: ({ onClose }: { onClose: () => void }) =>
      React.createElement(
        'div',
        { role: 'dialog' },
        React.createElement('button', { 'aria-label': 'Luk', onClick: onClose })
      ),
  }
})

function exitTop(clientY = 10, relatedTarget: EventTarget | null = null) {
  const e = new MouseEvent('mouseout', { bubbles: true, clientY })
  Object.defineProperty(e, 'relatedTarget', { value: relatedTarget })
  document.dispatchEvent(e)
}

function stubPointer(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches }))
}

beforeEach(() => {
  vi.useFakeTimers()
  sessionStorage.clear()
  nav.path = '/'
  stubPointer(true)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

async function arm() {
  await act(async () => {
    vi.advanceTimersByTime(3000)
  })
}

async function findDialog() {
  // The lazy chunk resolves on a microtask; flush it under fake timers.
  await act(async () => {
    await Promise.resolve()
  })
  return screen.queryByRole('dialog')
}

describe('ExitIntentModal trigger guards', () => {
  it('does NOT open before the 3s arm delay', async () => {
    render(<ExitIntentModal />)
    act(() => exitTop())
    expect(await findDialog()).toBeNull()
  })

  it('opens on a top-edge exit after arming, marks the session, tracks Shown', async () => {
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop(10))
    expect(await findDialog()).toBeInTheDocument()
    expect(sessionStorage.getItem('ah-exit-intent-shown')).toBe('1')
    expect(amplitude.track).toHaveBeenCalledWith('Exit Intent Shown', { path: '/' })
  })

  it('ignores exits below the top zone and exits into another element', async () => {
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop(51))
    act(() => exitTop(10, document.body))
    expect(await findDialog()).toBeNull()
  })

  it('never binds on touch devices', async () => {
    stubPointer(false)
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    expect(await findDialog()).toBeNull()
  })

  it('never fires again in a session that already saw it', async () => {
    sessionStorage.setItem('ah-exit-intent-shown', '1')
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    expect(await findDialog()).toBeNull()
  })

  it('never pitches a browser that already joined the waitlist', async () => {
    window.localStorage.setItem('ah-waitlist-joined', '1')
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    expect(await findDialog()).toBeNull()
    window.localStorage.clear()
  })

  it('stays away from excluded utility pages, but not from prefix look-alikes', async () => {
    nav.path = '/slet-konto'
    const { unmount } = render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    expect(await findDialog()).toBeNull()
    unmount()

    // /kontakt is excluded; a hypothetical /kontakt-os style route is NOT —
    // exclusion matches whole path segments only.
    nav.path = '/kontaktperson'
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    expect(await findDialog()).toBeInTheDocument()
  })

  it('does not fire while a fullscreen element is active (video)', async () => {
    render(<ExitIntentModal />)
    await arm()
    const video = document.createElement('video')
    Object.defineProperty(document, 'fullscreenElement', { value: video, configurable: true })
    act(() => exitTop())
    expect(await findDialog()).toBeNull()
    Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
  })

  it('survives a sessionStorage that throws (blocked cookies) without crashing', async () => {
    const throwing = {
      getItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
      setItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
    }
    vi.stubGlobal('sessionStorage', throwing)
    render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    // No throw = the site did not blank; the dialog still shows (no guard).
    expect(await findDialog()).toBeInTheDocument()
  })

  it('closes when the pathname changes under the open dialog', async () => {
    const { rerender } = render(<ExitIntentModal />)
    await arm()
    act(() => exitTop())
    expect(await findDialog()).toBeInTheDocument()
    nav.path = '/privatlivspolitik'
    rerender(<ExitIntentModal />)
    expect(await findDialog()).toBeNull()
  })
})
