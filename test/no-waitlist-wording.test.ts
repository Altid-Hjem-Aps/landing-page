import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

// ALT-894: no waitlist form or wording on the site. Scans the source of what can
// render, so a new page or a pasted-in sentence fails here instead of going live.
// The rendered-HTML grep in the PR proves the state once; this keeps it there.

const WORDING = /venteliste|ventelist|waitlist|skriv dig op|skriv dig på|skrevet op|snart|når vi åbner|åbner dørene/i

// Each entry: why it may keep the words.
const ALLOWED = new Set([
  // Legal text about the people still on the list, Alex's to change.
  'lib/privacyPolicy.ts',
  // The endpoint and the crons stay; nothing here renders.
  'app/api/waitlist/route.ts',
  'app/api/cron/slack-waitlist/route.ts',
  'app/api/test/sms/route.ts',
  // Server-side senders and adapters for mail already out, in comments and ids.
  'lib/send-email.ts',
  'lib/send-sms.ts',
  'lib/resend.ts',
  'lib/db.ts',
  'lib/mail-links.ts',
  'lib/signup-source.ts',
  // A sales deck for a partner, a number about history.
  'app/norlys/deck.html',
  // Thor's mail sentence "få snart nye tilbud" is about offers, not a waitlist.
  'components/site/AltidForsikring.tsx',
])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|html)$/.test(name) ? [path] : []
  })
}

// Thor's rule: no em or en dashes in copy. Reads strings and JSX text through the
// TypeScript parser, so code comments stay free and a dash in a page, a title, an
// aria-label or a JSON-LD answer fails here.
const DASH = /[–—]|&[nm]dash;|&#821[12];|&#x201[34];/i

// Out of scope for the rule: legal text.
const DASH_OUT_OF_SCOPE = /^(app\/privatlivspolitik\/|lib\/privacyPolicy\.ts$)/

// Each entry: why it may keep a dash. None of these reach a visitor.
const DASH_ALLOWED: Record<string, string> = {
  'app/api/bekraeft/route.ts': 'a server log line',
  'app/api/waitlist/route.ts': 'a server log line',
  'app/api/cron/slack-waitlist/route.ts': 'the internal Slack message, not on the site',
  'app/preview/alt-87/page.tsx': 'an internal preview, not linked from anywhere',
  // Inside a phone mockup, which changes in its own PR.
  'components/iphone/HomeScreen.tsx': 'phone mockup',
}

function dashedCopy(source: string): string[] {
  const file = ts.createSourceFile('source.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const hits: string[] = []
  const visit = (node: ts.Node) => {
    const text = ts.isJsxText(node)
      ? node.getText()
      : ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)
        ? node.text
        : null
    if (text !== null && DASH.test(text)) hits.push(text.trim())
    ts.forEachChild(node, visit)
  }
  visit(file)
  return hits
}

describe('waitlist wording guard', () => {
  it('no source file outside the allowlist has the words', () => {
    const hits = ['app', 'components', 'lib']
      .flatMap(sourceFiles)
      .filter((path) => !ALLOWED.has(path))
      // The newsletter form posts to this URL. The address is not wording.
      .filter((path) => WORDING.test(readFileSync(path, 'utf8').replaceAll('/api/waitlist', '')))
    expect(hits).toEqual([])
  })

  it('every allowlist entry still earns its place', () => {
    const stale = [...ALLOWED].filter((path) => !WORDING.test(readFileSync(path, 'utf8')))
    expect(stale).toEqual([])
  })
})

const dashFiles = ['app', 'components', 'lib']
  .flatMap(sourceFiles)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
  .filter((file) => !DASH_OUT_OF_SCOPE.test(file))
const readSource = (file: string) => readFileSync(file, 'utf8')

describe('dash guard', () => {
  it('reads strings and JSX text, not comments', () => {
    const source = `
      // en kommentar — fri
      const a = 'med – streg'
      const b = <p aria-label="x — y">tekst — her</p>
      const c = <p>&ndash;</p>
      const d = 'ren, med-bindestreg'
    `
    expect(dashedCopy(source)).toEqual(['med – streg', 'x — y', 'tekst — her', '&ndash;'])
  })

  it('finds none outside the allowlist', () => {
    const hits = dashFiles
      .filter((file) => !(file in DASH_ALLOWED))
      .flatMap((file) => dashedCopy(readSource(file)).map((text) => `${file}: ${text.slice(0, 80)}`))
    expect(hits).toEqual([])
  })

  it('keeps no stale entry in its allowlist', () => {
    const stale = Object.keys(DASH_ALLOWED).filter((file) => dashedCopy(readSource(file)).length === 0)
    expect(stale).toEqual([])
  })
})
