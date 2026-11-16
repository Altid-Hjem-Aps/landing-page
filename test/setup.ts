import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// next/font/google only exists inside the Next compiler; the package's own entry is empty.
vi.mock('next/font/google', () => ({ DM_Sans: () => ({ variable: 'font-dm-sans', className: 'font-dm-sans' }) }))

// Node 26's web-storage integration makes jsdom leave window.localStorage
// undefined unless the process runs with --localstorage-file. Components
// treat a missing localStorage as "no flag" (try/catch), but tests need a
// working one to assert the flag behaviour — polyfill in-memory.
if (typeof window !== 'undefined' && !window.localStorage) {
  const store = new Map<string, string>()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => store.get(String(k)) ?? null,
      setItem: (k: string, v: string) => {
        store.set(String(k), String(v))
      },
      removeItem: (k: string) => {
        store.delete(String(k))
      },
      clear: () => {
        store.clear()
      },
      get length() {
        return store.size
      },
      key: (i: number) => Array.from(store.keys())[i] ?? null,
    },
  })
}

// jsdom has no layout, so no matchMedia, IntersectionObserver or ResizeObserver. These stand in
// as a browser where no media query matches and nothing is ever seen or resized; tests that
// need otherwise stub their own.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
  }
  if (!('IntersectionObserver' in window)) {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return []
        }
      },
    })
  }
  if (!('ResizeObserver' in window)) {
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    })
  }
}
