'use client'

import Image from 'next/image'
import { useGuide } from '@/components/StoreBadges'
import { GUIDE_QR_SOURCES, guideQrImage, qrImage, type GuideQrSource, type QrSource } from '@/lib/store-links'
import { QR } from './copy'

// A place's QR code (qrImage): on a guide, the guide's own code for the places that have one
// (GUIDE_QR_SOURCES), so a scan reaches the store with the guide's campaign (ALT-1713).
export default function QrImage({ source, size }: { source: QrSource; size: number }) {
  const guide = useGuide()
  const own = guide && (GUIDE_QR_SOURCES as readonly QrSource[]).includes(source)
  return <Image src={own ? guideQrImage(guide, source as GuideQrSource) : qrImage(source)} alt={QR.alt} width={size} height={size} />
}
