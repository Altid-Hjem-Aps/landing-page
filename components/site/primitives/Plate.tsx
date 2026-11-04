import Image from 'next/image'
import type { PlateData } from '@/components/site/plates'

// A cut-out plate from the Altid Mad catalog. The shadow is part of the image.
// large uses the 800 px file, which only some plates have.
export default function Plate({
  plate,
  large = false,
  sizes = '(max-width: 767px) 40vw, 240px',
  className,
  style,
}: {
  plate: PlateData
  large?: boolean
  sizes?: string
  className?: string
  style?: React.CSSProperties
}) {
  if (large && !plate.src800) throw new Error(`no 800 px file for plate ${plate.slug}`)
  const size = large ? 800 : 480
  return (
    <Image
      src={large ? (plate.src800 as string) : plate.src}
      alt={plate.name}
      width={size}
      height={size}
      sizes={sizes}
      className={className}
      style={style}
    />
  )
}
