import type { Metadata } from 'next'

// Preview routes are internal — keep them out of search indexes. robots.txt
// only blocks crawling; this blocks indexing of externally-linked URLs.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children
}
