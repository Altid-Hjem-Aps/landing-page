import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import LegalPageLayout, { LegalAddress, LEGAL_H2, LEGAL_LABEL, LEGAL_LINK, LEGAL_LIST } from '@/components/LegalPageLayout'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import { COOKIE_SETTINGS_URL, parseInline, privacyPolicy, type PolicyBlock } from '@/lib/privacyPolicy'

export const metadata: Metadata = {
  title: 'Privatlivspolitik – Altid Hjem',
  description: 'Læs om hvordan Altid Hjem ApS behandler dine personoplysninger.',
}

// Anchors other pages link to (the cookie banner links to #cookies).
const SECTION_ANCHORS: Record<string, string> = { '11. Cookies': 'cookies' }

function formatUpdated(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((segment, i) => {
        if (!('url' in segment)) return segment.text
        if (segment.url === COOKIE_SETTINGS_URL) return <CookieSettingsLink key={i} className={LEGAL_LINK} />
        if (segment.url.startsWith('mailto:')) return <a key={i} href={segment.url} className={LEGAL_LINK}>{segment.text}</a>
        if (segment.url.startsWith('https://')) {
          return <a key={i} href={segment.url} target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>{segment.text}</a>
        }
        throw new Error(`Unsupported privacy policy link: ${segment.url}`)
      })}
    </>
  )
}

function Block({ block, afterLabel }: { block: Exclude<PolicyBlock, { type: 'label' }>; afterLabel: boolean }) {
  switch (block.type) {
    case 'paragraph':
      return <p><Inline text={block.text} /></p>
    case 'list':
      return (
        <ul className={afterLabel ? `${LEGAL_LIST} mt-2` : LEGAL_LIST}>
          {block.items.map((item, i) => (
            <li key={i}>
              {item.label && <><span className={LEGAL_LABEL}>{item.label}:</span>{' '}</>}
              <Inline text={item.text} />
            </li>
          ))}
        </ul>
      )
    case 'address': {
      const [name, ...lines] = block.lines
      return (
        <LegalAddress name={name}>
          {lines.map((line, i) => <p key={i}><Inline text={line} /></p>)}
        </LegalAddress>
      )
    }
  }
}

/** A label sticks to the block right after it; every other block stands alone. */
function renderBlocks(blocks: PolicyBlock[]): ReactNode[] {
  const out: ReactNode[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.type !== 'label') {
      out.push(<Block key={i} block={block} afterLabel={false} />)
      continue
    }
    const next = blocks[i + 1]
    if (!next || next.type === 'label') throw new Error(`Privacy policy label without content: ${block.text}`)
    out.push(
      <div key={i}>
        <p className={LEGAL_LABEL}>{block.text}</p>
        <Block block={next} afterLabel />
      </div>,
    )
    i++
  }
  return out
}

export default function Privatlivspolitik() {
  return (
    <LegalPageLayout title="Privatlivspolitik" meta="Altid Hjem ApS · CVR 45637476" updated={formatUpdated(privacyPolicy.updated)}>
      {privacyPolicy.sections.map((section) => {
        const anchor = SECTION_ANCHORS[section.title]
        return (
          <section key={section.title} id={anchor} className={anchor ? 'space-y-4 scroll-mt-24' : 'space-y-4'}>
            <h2 className={LEGAL_H2}>{section.title}</h2>
            {renderBlocks(section.blocks)}
          </section>
        )
      })}
    </LegalPageLayout>
  )
}
