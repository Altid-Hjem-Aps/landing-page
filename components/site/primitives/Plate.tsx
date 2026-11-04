import Image from 'next/image'
import type { PlateData } from '@/components/site/plates'

// A cut-out plate from the Altid Mad catalog. The shadow is part of the image.
export default function Plate({
  plate,
  sizes = '(max-width: 767px) 40vw, 240px',
}: {
  plate: PlateData
  sizes?: string
}) {
  return <Image src={plate.src} alt={plate.name} width={480} height={480} sizes={sizes} />
}
