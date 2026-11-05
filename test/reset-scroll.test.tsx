import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import ResetScrollOnLoad from '@/components/ResetScrollOnLoad'

// A deep link such as /#altid-mad (nav on another page, mails, shared links)
// must land on its section; only a plain load starts at the top.
afterEach(() => {
  window.history.replaceState(null, '', '/')
  vi.unstubAllGlobals()
})

describe('ResetScrollOnLoad', () => {
  it('leaves the scroll alone when the URL names a section', () => {
    window.history.replaceState(null, '', '/#altid-mad')
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    render(<ResetScrollOnLoad />)
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('scrolls to the top on a load without a hash', () => {
    window.history.replaceState(null, '', '/')
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    render(<ResetScrollOnLoad />)
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
