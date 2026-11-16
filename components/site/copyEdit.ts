// The copy edit mode's plain logic (CopyEditor uses it; test/copy-edit.test.ts checks it):
// every string in copy.ts by its key path, how a text on the page is matched back to one, and
// the list of changes Thor copies out.

export type CopyEntry = { path: string; text: string }
export type Change = { id: string; keys: string[]; place: string; before: string; after: string }

/** Every string in a copy object, by its key path (FINAL.title, FAQ.items.3.a). A list of
 * strings is also there as a whole, its parts on their own lines (FINAL.body). */
export function flattenCopy(value: unknown, path: string, out: CopyEntry[] = []): CopyEntry[] {
  if (typeof value === 'string') {
    out.push({ path, text: value })
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => flattenCopy(item, `${path}.${i}`, out))
    if (value.length > 1 && value.every((item) => typeof item === 'string')) out.push({ path, text: value.join('\n') })
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) flattenCopy(item, path ? `${path}.${key}` : key, out)
  }
  return out
}

/** A text as compared: no white space at all, so line breaks drawn as separate blocks match. */
export const squash = (text: string) => text.replace(/\s+/g, '')

const PLACEHOLDER = /\{[a-z]+\}/gi

export type CopyIndex = { exact: Map<string, string[]>; templates: { path: string; text: string; pattern: RegExp }[] }

/** The strings by their squashed text, and the ones with {placeholders} as patterns. */
export function indexCopy(entries: CopyEntry[]): CopyIndex {
  const exact = new Map<string, string[]>()
  const templates: CopyIndex['templates'] = []
  for (const { path, text } of entries) {
    if (!squash(text)) continue
    if (PLACEHOLDER.test(text)) {
      PLACEHOLDER.lastIndex = 0
      const parts = squash(text).split(PLACEHOLDER)
      const pattern = new RegExp(`^${parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+?')}$`)
      templates.push({ path, text, pattern })
      continue
    }
    const key = squash(text)
    exact.set(key, [...(exact.get(key) ?? []), path])
  }
  return { exact, templates }
}

/** Which copy.ts strings a text on the page is: the exact ones, or else a template it fills in. */
export function matchCopy(index: CopyIndex, shown: string): { keys: string[]; template?: string } | null {
  const key = squash(shown)
  if (!key) return null
  const exact = index.exact.get(key)
  if (exact) return { keys: exact }
  const template = index.templates.find((t) => t.pattern.test(key))
  return template ? { keys: [template.path], template: template.text } : null
}

const show = (text: string) => text.replace(/\n/g, '\\n')

/** The changes as plain text, in page order: for each the copy.ts key (or where it is, when the
 * text is not in copy.ts), the old text and the new, line breaks written as \n. */
export function formatChanges(changes: Change[]): string {
  if (changes.length === 0) return 'Ingen ændringer.'
  const lines = [`Tekstændringer på forsiden (${changes.length}). Linjeskift er skrevet som \\n.`, '']
  changes.forEach((change, i) => {
    const where = change.keys.length === 0 ? `Ikke i copy.ts: ${change.place}` : change.keys.length === 1 ? `copy.ts ${change.keys[0]}` : `copy.ts ${change.keys.join(' eller ')} (samme tekst flere steder; denne står i ${change.place})`
    lines.push(`${i + 1}. ${where}`, `   Før: ${show(change.before)}`, `   Nu:  ${show(change.after)}`, '')
  })
  return lines.join('\n').trimEnd()
}
