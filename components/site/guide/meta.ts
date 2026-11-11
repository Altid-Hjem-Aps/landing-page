import type { Metadata } from 'next'
import { serializeForScript } from '@/components/site/jsonLd'
import { plain } from './rich'
import type { Guide } from './types'

const SITE = 'https://www.altidhjem.dk'
const IMAGE = { url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Altid Hjem' }

export function guideUrl(guide: Guide): string {
  return `${SITE}/${guide.slug}`
}

// Full Open Graph and Twitter here: nested objects replace the layout's, they do not merge.
export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.meta.title,
    description: guide.meta.description,
    alternates: { canonical: guideUrl(guide) },
    authors: [{ name: guide.author.name }],
    openGraph: {
      title: guide.h1,
      description: guide.lead,
      url: guideUrl(guide),
      siteName: 'Altid Hjem',
      locale: 'da_DK',
      type: 'article',
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: [guide.author.name],
      images: [IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.h1,
      description: guide.lead,
      images: [IMAGE],
    },
  }
}

// Article, BreadcrumbList and FAQPage in one graph, all from the data the page shows.
export function guideJsonLd(guide: Guide) {
  const url = guideUrl(guide)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.h1,
        description: guide.meta.description,
        inLanguage: 'da',
        datePublished: guide.published,
        dateModified: guide.updated,
        mainEntityOfPage: url,
        image: `${SITE}${IMAGE.url}`,
        author: { '@type': 'Person', name: guide.author.name, jobTitle: guide.author.role, worksFor: { '@id': `${SITE}/#organization` } },
        publisher: { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Altid Hjem ApS', url: SITE, logo: `${SITE}/icon.svg` },
        citation: guide.sources.map((source) => ({ '@type': 'WebPage', name: source.title, url: source.href, publisher: { '@type': 'Organization', name: source.publisher } })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Altid Hjem', item: SITE },
          { '@type': 'ListItem', position: 2, name: guide.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: guide.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a.map(plain).join(' ') },
        })),
      },
    ],
  }
}

export function guideJsonLdScript(guide: Guide): string {
  return serializeForScript(guideJsonLd(guide))
}

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']

/** "2026-11-11" as "11. november 2026". */
export function danishDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day}. ${MONTHS[month - 1]} ${year}`
}
