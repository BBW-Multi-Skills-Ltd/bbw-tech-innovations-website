import type { ReactNode } from 'react'
import { LaptopFrame } from '@/components/LaptopFrame'
import { PhoneFrame } from '@/components/PhoneFrame'
import { HeroLoop } from './HeroLoop'
import { ScreenImage } from './ScreenImage'

export type FrameKind = 'phone' | 'desktop' | 'none'

const isVideo = (src: string) => /\.(mp4|webm)(\?|$)/i.test(src)

function Screen({ src, alt, fallback }: { src: string | null; alt: string; fallback?: ReactNode }) {
  if (!src) return <>{fallback}</>
  return isVideo(src) ? (
    <HeroLoop src={src} label={alt} className="absolute inset-0 size-full object-cover object-top" />
  ) : (
    <ScreenImage src={src} alt={alt} priority />
  )
}

/**
 * A screenshot inside a drawn device (from the portfolio): a phone (sized by
 * height, so pass a height class) or a laptop (sized by width). "none" shows
 * the image as it is. Without a screenshot, `fallback` fills the screen
 * (BBW: the project's drawn preview).
 */
export function DeviceFrame({
  kind,
  src,
  alt,
  className = '',
  fallback,
}: {
  kind: FrameKind
  src: string | null
  alt: string
  className?: string
  fallback?: ReactNode
}) {
  if (kind === 'phone') {
    return (
      <PhoneFrame className={className}>
        <Screen src={src} alt={alt} fallback={fallback} />
      </PhoneFrame>
    )
  }
  if (kind === 'desktop') {
    return (
      <LaptopFrame className={className}>
        <Screen src={src} alt={alt} fallback={fallback} />
      </LaptopFrame>
    )
  }
  if (!src) return null
  return isVideo(src) ? (
    <HeroLoop src={src} label={alt} className={`object-contain ${className}`} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded mockup, size unknown
    <img src={src} alt={alt} fetchPriority="high" className={`object-contain ${className}`} />
  )
}
