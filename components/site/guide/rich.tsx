import type { ReactNode } from 'react'

// The two marks a guide's text may carry: **fed** and [link](/sti). Everything else is text.
const MARK = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

export function rich(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(MARK)) {
    const at = match.index
    if (at > last) out.push(text.slice(last, at))
    if (match[1] !== undefined) {
      out.push(<strong key={at}>{match[1]}</strong>)
    } else {
      const href = match[3]
      const external = /^https?:/.test(href)
      out.push(
        <a key={at} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {match[2]}
        </a>,
      )
    }
    last = at + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** The same text with the marks removed, for JSON-LD. */
export function plain(text: string): string {
  return text.replace(MARK, (_, bold, label) => bold ?? label)
}
