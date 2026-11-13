import { describe, expect, it } from 'vitest'
import * as COPY from '@/components/site/copy'
import { flattenCopy, formatChanges, indexCopy, matchCopy } from '@/components/site/copyEdit'

// The copy edit mode (?rediger): page texts matched back to their copy.ts keys, and the list of
// changes Thor copies out, which is applied to copy.ts by those keys.

const INDEX = indexCopy(Object.entries(COPY).flatMap(([name, value]) => (typeof value === 'object' ? flattenCopy(value, name) : [])))

describe('matching a text on the page to copy.ts', () => {
  it('finds a plain string by its key path', () => {
    expect(matchCopy(INDEX, 'Hent Altid Hjem i dag')?.keys).toContain('FINAL.title')
  })

  it('finds a string drawn as separate lines, and a list drawn as one paragraph', () => {
    const card = COPY.OKONOMI.cards[0].title
    expect(matchCopy(INDEX, card.split('\n').join(''))?.keys).toEqual(['OKONOMI.cards.0.title'])
    expect(matchCopy(INDEX, COPY.FINAL.body.join(' '))?.keys).toEqual(['FINAL.body'])
  })

  it('finds a string with a placeholder from the text it fills in, and gives back the placeholder', () => {
    const match = matchCopy(INDEX, COPY.LEAVE.proof.replace('{thousands}', '4.000'))
    expect(match).toEqual({ keys: ['LEAVE.proof'], template: COPY.LEAVE.proof })
  })

  it('finds nothing for a text that is not in copy.ts', () => {
    expect(matchCopy(INDEX, 'Hent i App Store')).toBeNull()
  })
})

describe('the list of changes', () => {
  it('names each change by its copy.ts key, with the old and the new text, line breaks as \\n', () => {
    const text = formatChanges([
      { id: 'FINAL.title', keys: ['FINAL.title'], place: 'final › h2', before: 'Hent Altid Hjem i dag', after: 'Hent Altid Hjem nu' },
      { id: 'OKONOMI.cards.0.title', keys: ['OKONOMI.cards.0.title'], place: 'features › h3', before: 'Se regningerne,\nfør de bliver trukket', after: 'Se regningerne\nfør de trækkes' },
      { id: 'final › a #1', keys: [], place: 'final › a', before: 'Hent i App Store', after: 'Hent i App Store nu' },
    ])
    expect(text).toBe(
      [
        'Tekstændringer på forsiden (3). Linjeskift er skrevet som \\n.',
        '',
        '1. copy.ts FINAL.title',
        '   Før: Hent Altid Hjem i dag',
        '   Nu:  Hent Altid Hjem nu',
        '',
        '2. copy.ts OKONOMI.cards.0.title',
        '   Før: Se regningerne,\\nfør de bliver trukket',
        '   Nu:  Se regningerne\\nfør de trækkes',
        '',
        '3. Ikke i copy.ts: final › a',
        '   Før: Hent i App Store',
        '   Nu:  Hent i App Store nu',
      ].join('\n'),
    )
  })

  it('says so when nothing changed', () => {
    expect(formatChanges([])).toBe('Ingen ændringer.')
  })
})
