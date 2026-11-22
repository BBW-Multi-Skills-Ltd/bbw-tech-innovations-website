import Image from 'next/image'

export default function BrandLogo({ width = 42, height = 30 }: { width?: number; height?: number }) {
  return <Image src="/logos/bbwlogo.png" alt="" aria-hidden="true" width={width} height={height} className="shrink-0 object-contain" style={{ width, height }} priority />
}
