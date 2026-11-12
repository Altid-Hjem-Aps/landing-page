import type { CSSProperties } from 'react'
import { VALUES } from './copy'

// A check in a filled Deep forest circle (what you always get), or a cross in an outlined
// stone circle (what you never meet). Drawn here, so the marks scale with their text.
function Mark({ kind, className }: { kind: 'always' | 'never'; className: string }) {
  return (
    <svg className={`${className} va-mark`} data-kind={kind} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {kind === 'always' ? (
        <>
          <circle cx="12" cy="12" r="12" className="va-disc" />
          <path d="M7.2 12.4l3.1 3.1 6.5-6.9" fill="none" className="va-glyph" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="11.1" fill="none" className="va-ring" strokeWidth="1.8" />
          <path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" fill="none" className="va-glyph" strokeWidth="1.9" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// What the name Altid stands for, as a small ledger: the four values, and for each one what
// you always get and what you never meet. On a computer it is a three-column table whose Altid
// column stands on one tall mint panel, our side of the table; on a phone each value is its
// own block with the Altid line on a mint card. A list, not a table, so the phone layout is
// plain CSS; each line starts with "Altid: " or "Aldrig: " (hidden on a computer, where the
// column heads say it for the eye; shown on a phone, which has no column heads).
export default function Values() {
  return (
    <section data-b="values" id="om" className="sec va" aria-labelledby="va-title">
      <div className="va-in">
        <h2 id="va-title" className="t-h2 va-title" data-reveal>
          {VALUES.title}
        </h2>
        <p className="t-body va-body" data-reveal style={{ '--rd': '90ms' } as CSSProperties}>
          {VALUES.body}
        </p>
        <div className="va-table">
          <div className="va-heads" aria-hidden="true" data-reveal>
            <span className="va-head" data-kind="always">
              <Mark kind="always" className="va-head-mark" />
              {VALUES.always}
            </span>
            <span className="va-head" data-kind="never">
              <Mark kind="never" className="va-head-mark" />
              {VALUES.never}
            </span>
          </div>
          <ul className="va-list">
            {VALUES.rows.map((row, i) => (
              <li key={row.value} className="va-row" data-reveal style={{ '--rd': `${i * 90}ms` } as CSSProperties}>
                <h3 className="va-value">{row.value}</h3>
                <p className="va-line" data-kind="always">
                  <Mark kind="always" className="va-line-mark" />
                  <span className="va-pre">{VALUES.always}: </span>
                  {row.always}
                </p>
                <p className="va-line" data-kind="never">
                  <Mark kind="never" className="va-line-mark" />
                  <span className="va-pre">{VALUES.never}: </span>
                  {row.never}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
