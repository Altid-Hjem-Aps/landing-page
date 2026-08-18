import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/preview/', '/r/'],
    },
    sitemap: 'https://altidhjem.dk/sitemap.xml',
  }
}
