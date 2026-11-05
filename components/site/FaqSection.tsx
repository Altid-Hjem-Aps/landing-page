import { FAQ, type FaqItem } from './copy'

// Native details, several may stay open, the first is open in the HTML. Plain words: the
// JSON-LD reads the same data, so what a search engine sees is what a person reads.
function Answer({ item }: { item: FaqItem }) {
  if (!item.link) return <p>{item.a}</p>
  const [before, after] = item.a.split(item.link.text)
  const external = item.link.href.startsWith('http')
  return (
    <p>
      {before}
      <a href={item.link.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {item.link.text}
      </a>
      {after}
    </p>
  )
}

export default function FaqSection() {
  return (
    <section id="spoergsmaal" data-b="faq" className="sec q">
      <h2 className="t-h2">{FAQ.title}</h2>
      <div className="q-list">
        {FAQ.items.map((item, i) => (
          <details key={item.q} open={i === 0} className="q-item">
            <summary>
              <span>{item.q}</span>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <Answer item={item} />
          </details>
        ))}
      </div>
    </section>
  )
}
