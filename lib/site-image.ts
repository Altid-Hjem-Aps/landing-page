import { META } from '@/components/site/copy'

/** The site's link preview image (ALT-1839), for every page that sets its own `openGraph`:
 * a page's `openGraph` replaces the layout's whole, so a page without `images` is shared
 * with no picture. `?v=2` makes LinkedIn and Facebook fetch the new image. */
export const SITE_IMAGE = { url: '/opengraph-image.png?v=2', width: 1200, height: 630, alt: META.imageAlt }
