'use client'

import { Logo } from '@/components/Logo'

export default function Nav() {
  function handleCTA(e: React.MouseEvent) {
    e.preventDefault()
    const el = document.getElementById('venteliste')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('expand-waitlist'))
    }, 450)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5"
      style={{
        background: 'rgba(245,240,232,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(46,125,82,0.08)',
      }}
    >
      <a href="/">
        <Logo className="h-11 w-auto text-forest" />
      </a>
      <button
        onClick={handleCTA}
        className="bg-forest text-white text-xs sm:text-sm font-medium px-3.5 sm:px-5 py-2.5 rounded-full transition-colors hover:bg-forest-dark whitespace-nowrap"
      >
        Skriv dig på ventelisten
      </button>
    </nav>
  )
}
