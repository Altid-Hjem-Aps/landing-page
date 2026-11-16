import { render, screen, within } from '@testing-library/react'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { POSTS } from '@/components/sections/blogPosts'
import Guide, { type GuidePage, type GuideSources } from '@/components/site/Guide'

// The guide recipe's parts (docs/guide-recipe.md, ALT-1714): dates, breadcrumb, "Læs også",
// Kilder, and the Article and BreadcrumbList data for Google. Optional, so the 21 guides from
// before keep rendering as they did; a wrong date or link throws instead of reaching Google.
vi.mock('@/components/site/SiteNav', () => ({ default: () => null }))
vi.mock('@/components/site/SiteFooter', () => ({ default: () => null }))
vi.mock('@/components/site/Reveal', () => ({ default: () => null }))
vi.mock('@/components/site/GuideOfferPopup', () => ({ default: () => null }))

const PAGE: GuidePage = {
  path: '/hvad-koster-en-husforsikring',
  description: 'En husforsikring koster typisk ... </script>',
  published: '2026-11-01',
  updated: '2026-11-16',
}
const SOURCES: GuideSources = {
  checked: '2026-11-16',
  items: [
    { publisher: 'Tænk', title: 'Bedste og billigste husforsikringer', href: 'https://taenk.dk/test/husforsikringer', note: 'Test fra oktober 2026' },
    { publisher: 'Danmarks Statistik', title: 'PRIS01', href: 'https://www.statistikbanken.dk/PRIS01' },
  ],
}
const RELATED = ['/hvad-koster-forsikring', '/skift-forsikringsselskab', '/hvad-koster-indboforsikring']

function renderGuide(extra: Partial<Parameters<typeof Guide>[0]> = {}) {
  return render(
    <Guide
      title="Hvad koster en husforsikring?"
      lead={<p>Kort svar.</p>}
      meta="Kilde: Tænk"
      answer={{ label: 'Typisk pris', value: '4.000', unit: 'kr. om året' }}
      faq={[{ q: 'Hvad koster en husforsikring?', a: ['Det afhænger af huset.'] }]}
      cta={{ eyebrow: 'Hent appen', heading: 'Se dine forsikringer', subtitle: 'Gratis.' }}
      {...extra}
    >
      <section>
        <h2>Hvad afgør prisen?</h2>
        <p>Tekst.</p>
      </section>
    </Guide>,
  )
}

function jsonLd(container: HTMLElement) {
  return [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent ?? ''))
}

describe('a guide with the recipe parts', () => {
  it('shows the dates in Danish, as machine-readable times', () => {
    const { container } = renderGuide({ page: PAGE, sources: SOURCES })
    const dates = container.querySelector('.gd-dates') as HTMLElement
    expect(dates.textContent).toBe('Udgivet 1. november 2026 · Opdateret 16. november 2026')
    expect([...dates.querySelectorAll('time')].map((t) => t.getAttribute('datetime'))).toEqual(['2026-11-01', '2026-11-16'])
  })

  it('shows the breadcrumb: the front page, then this page', () => {
    renderGuide({ page: PAGE })
    const crumbs = screen.getByRole('navigation', { name: 'Du er her' })
    expect(within(crumbs).getByRole('link', { name: 'Forside' })).toHaveAttribute('href', '/')
    expect(crumbs.querySelector('[aria-current="page"]')?.textContent).toBe('Hvad koster en husforsikring?')
  })

  it('lists Kilder before the questions, sources opening in a new tab', () => {
    const { container } = renderGuide({ page: PAGE, sources: SOURCES, related: RELATED })
    const headings = [...container.querySelectorAll('.gd-body > section > h2')].map((h) => h.textContent)
    expect(headings).toEqual(['Hvad afgør prisen?', 'Kilder', 'Ofte stillede spørgsmål'])
    const sources = screen.getByRole('region', { name: 'Kilder' })
    expect(sources.querySelector('.gd-checked')?.textContent).toBe('Senest tjekket 16. november 2026')
    const links = within(sources).getAllByRole('link')
    expect(links.map((a) => a.textContent)).toEqual(['Tænk: Bedste og billigste husforsikringer', 'Danmarks Statistik: PRIS01'])
    for (const a of links) {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', 'noopener noreferrer')
    }
    expect(sources.textContent).toContain('Test fra oktober 2026')
  })

  it('shows "Læs også" as the 3 guides\' own blog cards, after the questions and before the download panel', () => {
    const { container } = renderGuide({ page: PAGE, related: RELATED })
    const related = screen.getByRole('region', { name: 'Læs også' })
    expect(within(related).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(RELATED)
    for (const href of RELATED) {
      const post = POSTS.find((p) => p.href === href)!
      expect(within(related).getByRole('heading', { name: post.title })).toBeInTheDocument()
    }
    const order = [...container.querySelectorAll('.gd-body, .gd-related, .gd-cta')].map((el) => el.className.split(' ')[0])
    expect(order).toEqual(['gd-body', 'gd-related', 'gd-cta'])
  })

  it('gives Google the FAQ, the Article with its sources as citations, and the breadcrumb', () => {
    const { container } = renderGuide({ page: PAGE, sources: SOURCES })
    const data = jsonLd(container)
    expect(data.map((d) => d['@type'])).toEqual(['FAQPage', 'Article', 'BreadcrumbList'])
    const article = data[1]
    expect(article).toMatchObject({
      headline: 'Hvad koster en husforsikring?',
      url: 'https://www.altidhjem.dk/hvad-koster-en-husforsikring',
      inLanguage: 'da-DK',
      image: 'https://www.altidhjem.dk/opengraph-image.png?v=2',
      datePublished: '2026-11-01',
      dateModified: '2026-11-16',
      author: { '@type': 'Organization', name: 'Altid Hjem ApS' },
      publisher: { '@type': 'Organization', name: 'Altid Hjem ApS' },
    })
    expect(article.citation).toEqual([
      { '@type': 'CreativeWork', name: 'Tænk: Bedste og billigste husforsikringer', url: 'https://taenk.dk/test/husforsikringer' },
      { '@type': 'CreativeWork', name: 'Danmarks Statistik: PRIS01', url: 'https://www.statistikbanken.dk/PRIS01' },
    ])
    expect(data[2].itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://www.altidhjem.dk/' },
      { '@type': 'ListItem', position: 2, name: 'Hvad koster en husforsikring?', item: 'https://www.altidhjem.dk/hvad-koster-en-husforsikring' },
    ])
  })

  it('escapes < in the data, so no text can close the script tag', () => {
    const { container } = renderGuide({ page: PAGE })
    for (const script of container.querySelectorAll('script[type="application/ld+json"]')) {
      expect(script.innerHTML).not.toContain('</script')
    }
    expect(jsonLd(container)[1].description).toBe(PAGE.description)
  })
})

describe('a guide from before the recipe', () => {
  it('renders as before: only the FAQ data, no breadcrumb, dates, Læs også or Kilder', () => {
    const { container } = renderGuide()
    expect(jsonLd(container).map((d) => d['@type'])).toEqual(['FAQPage'])
    expect(container.querySelector('.gd-crumbs, .gd-dates, .gd-related, .gd-sources')).toBeNull()
  })
})

describe('wrong input stops the page instead of reaching Google', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['a date that does not exist', { page: { ...PAGE, published: '2026-02-30' } }, 'page.published'],
    ['a date in another format', { page: { ...PAGE, updated: '16-11-2026' } }, 'page.updated'],
    ['updated before published', { page: { ...PAGE, published: '2026-11-16', updated: '2026-11-01' } }, 'before'],
    ['a path without a slash', { page: { ...PAGE, path: 'hvad-koster' } }, 'page.path'],
    ['a path to another site', { page: { ...PAGE, path: '//example.com' } }, 'page.path'],
    ['a source without a full address', { page: PAGE, sources: { ...SOURCES, items: [{ publisher: 'X', title: 'Y', href: '/kilde' }] } }, 'full address'],
    ['an empty source list', { page: PAGE, sources: { checked: '2026-11-16', items: [] } }, 'at least one'],
    ['sources without the page', { sources: SOURCES }, 'need page'],
    ['a "Læs også" guide without a blog card', { related: [...RELATED.slice(0, 2), '//example.com'] }, 'no card'],
    ['fewer than 3 "Læs også" guides', { related: RELATED.slice(0, 2) }, 'exactly 3'],
    ['more than 3 "Læs også" guides', { related: [...RELATED, '/madbudget'] }, 'exactly 3'],
    ['the same "Læs også" guide twice', { related: [RELATED[0], RELATED[1], RELATED[0]] }, 'twice'],
    ['the page itself in "Læs også"', { page: { ...PAGE, path: '/hvad-koster-forsikring' }, related: RELATED }, 'page itself'],
  ])('%s', (_name, extra, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderGuide(extra as Partial<Parameters<typeof Guide>[0]>)).toThrow(message)
  })
})

// A guide copied from another keeps the old page.path; the Article data and the breadcrumb would
// then point at the other page. Every guide that passes `page` must name its own folder and take
// its description from its own metadata, and its canonical must be the same address.
describe('every guide that uses the recipe parts', () => {
  const app = join(process.cwd(), 'app')
  const guides = readdirSync(app, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ slug: d.name, file: join(app, d.name, 'page.tsx') }))
    .filter(({ file }) => existsSync(file) && readFileSync(file, 'utf8').includes("from '@/components/site/Guide'"))

  it.each(guides.map((g) => [g.slug, g.file]))('%s: page.path, canonical and description agree', (slug, file) => {
    const source = readFileSync(file, 'utf8')
    if (!/\spage=\{/.test(source)) return
    expect(source).toMatch(new RegExp(`path:\\s*'/${slug}'`))
    expect(source).toContain(`https://www.altidhjem.dk/${slug}`)
    expect(source).toMatch(/description:\s*metadata\.description/)
  })
})
