import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import ResetScrollOnLoad from '@/components/ResetScrollOnLoad'

// A reload starts over at the top. A deep link such as /#altid-mad (nav on another
// page, mails, shared links) lands on its section, and Back keeps the visitor's place.
function arriveBy(type: NavigationTimingType) {
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([{ type }] as unknown as PerformanceEntryList)
  const scrollTo = vi.fn()
  vi.stubGlobal('scrollTo', scrollTo)
  window.history.scrollRestoration = 'auto'
  return scrollTo
}

afterEach(() => {
  window.history.replaceState(null, '', '/')
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('ResetScrollOnLoad', () => {
  it('scrolls to the top on a reload', () => {
    const scrollTo = arriveBy('reload')
    render(<ResetScrollOnLoad />)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    expect(window.history.scrollRestoration).toBe('manual')
  })

  it('leaves the scroll alone on a reload when the URL names a section', () => {
    window.history.replaceState(null, '', '/#altid-mad')
    const scrollTo = arriveBy('reload')
    render(<ResetScrollOnLoad />)
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it.each(['back_forward', 'navigate'] as const)('leaves restoration to the browser on %s', (type) => {
    const scrollTo = arriveBy(type)
    render(<ResetScrollOnLoad />)
    expect(scrollTo).not.toHaveBeenCalled()
    expect(window.history.scrollRestoration).toBe('auto')
  })
})
