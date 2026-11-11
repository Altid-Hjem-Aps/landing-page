'use client'

import { useState } from 'react'
import { rich } from './rich'
import type { Guide } from './types'

// The front page's FAQ rows (.q-item) in the guide's column: one answer open at a time. The
// answers stay in the page when folded, so they match the FAQPage data word for word.
export default function GuideFaq({ items }: { items: Guide['faq'] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="gd-faq">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="q-item">
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`gd-answer-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                <span>{item.q}</span>
                <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div id={`gd-answer-${i}`} className="q-answer" data-open={isOpen ? 'true' : undefined} aria-hidden={!isOpen}>
              <div>
                {item.a.map((line) => (
                  <p key={line}>{rich(line)}</p>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
