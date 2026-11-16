import { GUIDES } from '@/lib/guides'
import { GUIDE_PATHS } from '@/lib/site-counts'

// The site's guides as JSON (ALT-1715): every path in GUIDE_PATHS with the guide's title (its H1)
// and its published and updated dates, from lib/guides.ts, which the pages render too. The admin's
// guide table and Homebase's SEO-kørsel read the list from here, so it never drifts from the site.
// Built once at build time: the list only changes with a deploy. Not a page for search engines.
export const dynamic = 'force-static'

export function GET() {
  const guides = GUIDE_PATHS.map((path) => ({ path, ...GUIDES[path] }))
  return Response.json({ guides }, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Robots-Tag': 'noindex' } })
}
