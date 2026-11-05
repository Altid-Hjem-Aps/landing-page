import { FAQ } from '@/lib/forside-copy'
import { H2, BODY } from '@/lib/typography'

// Native <details>: keyboard and screen reader support for free, no JS, and
// the answers are in the HTML for search engines.
export default function Faq() {
  return (
    <section id="spoergsmaal" className="focus-ring-light forside-faq bg-[var(--app-paper)] pt-16 pb-12 lg:pt-24 lg:pb-16">
      <div className="mx-auto max-w-[860px] px-6 lg:px-12">
        <h2 className={`${H2} text-[var(--app-forest)]`}>{FAQ.title}</h2>
        <div className="mt-10 border-t border-[var(--app-border)]">
          {FAQ.items.map(({ q, a }) => (
            <details key={q} className="border-b border-[var(--app-border)]">
              <summary className="group flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] font-medium text-[var(--app-forest)]">
                <span className="transition-opacity group-hover:opacity-80">{q}</span>
                <svg
                  aria-hidden
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="forside-faq-chevron shrink-0 transition-transform duration-200"
                >
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className={`${BODY} pb-6 pr-10 text-[var(--app-ink)]`}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
