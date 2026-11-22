import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StillCapture from '@/components/logo3d/StillCapture'

export const metadata: Metadata = { title: 'Logo still', robots: { index: false, follow: false } }

/**
 * Development only: renders the 3D logo for public/logos/bbw-logo-3d.webp.
 * Re-make the still after changing the 3D look: run `npm run dev`, open
 * /dev/logo-still, wait for the logo, then in the browser console run
 * `captureLogoStill()` and save the returned data URL (a WebP) as
 * public/logos/bbw-logo-3d.webp.
 */
export default function LogoStillPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <StillCapture />
}
