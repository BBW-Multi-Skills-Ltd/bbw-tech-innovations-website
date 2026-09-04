interface BrandLogoProps {
  width?: number
  height?: number
}

export default function BrandLogo({ width = 42, height = 30 }: BrandLogoProps) {
  return (
    <img
      src="/logos/bbwlogo.png"
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      style={{ width, height, objectFit: 'contain', flexShrink: 0 }}
    />
  )
}
