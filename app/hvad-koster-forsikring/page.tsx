import GuidePage from '@/components/site/guide/GuidePage'
import { guideMetadata } from '@/components/site/guide/meta'
import { GUIDE } from '@/content/guides/hvad-koster-forsikring'

export const metadata = guideMetadata(GUIDE)

export default function HvadKosterForsikring() {
  return <GuidePage guide={GUIDE} />
}
