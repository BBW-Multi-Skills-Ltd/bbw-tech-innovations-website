import { LOGO_STILL_URL } from '@/lib/bbw-logo'

/**
 * The logo as a still render of the 3D model (phones, and on desktop while
 * the live 3D loads). Its box is the SVG's viewBox, the same box the 3D scene
 * and the drag line up with; the render is 6% larger on each side, as
 * captured (app/dev/logo-still), so the bevel isn't cut off.
 *
 * `priority`: the page's largest paint on phones. Fetched first and drawn
 * with the first frame.
 */
export function StillLogo({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`relative block aspect-[1557/777] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small local WebP, sized by its box */}
      <img
        src={LOGO_STILL_URL}
        alt=""
        width={1000}
        height={499}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className="absolute top-[-6%] left-[-6%] h-[112%] w-[112%] max-w-none select-none"
        draggable={false}
      />
    </span>
  )
}
