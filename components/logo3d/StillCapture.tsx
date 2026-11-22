'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { LogoPose } from './HeroLogoScene'

const HeroLogoScene = dynamic(() => import('./HeroLogoScene'), { ssr: false })

/** Size of public/logos/bbw-logo-3d.webp. Keep its aspect = the viewBox's. */
export const STILL_W = 1000
export const STILL_H = 499

/**
 * Renders the 3D logo facing front, framed exactly as StillLogo shows it
 * (its box plus 6% on each side), and offers it as a WebP:
 * window.captureLogoStill() returns a data URL.
 */
export default function StillCapture() {
  const box = { w: STILL_W / 1.12, h: STILL_H / 1.12 }
  const pose = useRef<LogoPose>({ x: STILL_W / 2, floor: box.h * 1.06, height: box.h, yaw: 0, lean: 0, tilt: 0, hop: 0 })
  const [ready, setReady] = useState(false)
  const holder = useRef<HTMLDivElement>(null)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!ready) return
    const w = window as unknown as { captureLogoStill?: () => string }
    w.captureLogoStill = () => holder.current?.querySelector('canvas')?.toDataURL('image/webp', 0.92) ?? ''
  }, [ready])

  return (
    <div style={{ padding: 24, background: 'repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0 / 20px 20px' }}>
      <div ref={holder} id="capture" data-ready={ready ? 'yes' : 'no'} style={{ position: 'relative', width: STILL_W, height: STILL_H }}>
        <HeroLogoScene pose={pose} frameloop="always" onReady={onReady} preserveDrawingBuffer />
      </div>
    </div>
  )
}
