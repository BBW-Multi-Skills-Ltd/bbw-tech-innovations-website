import type { ReactNode } from 'react'

/**
 * The site's one laptop (from the portfolio): a 13-inch laptop with a thin
 * black bezel and camera dot, and a slim base with the thumb scoop. Drawn in
 * CSS with no brand marks; every size is a percentage.
 *
 * The screen is 16 × 10: a 1440 × 900 px screenshot (or 2880 × 1800) fills it
 * exactly (lib/screens.ts). Size it with a width class.
 */
export function LaptopFrame({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      {/* Lid: the bezel is padding (a share of the width on every side). */}
      <div className="relative mx-auto w-[88%] rounded-t-[3.2%_5%] rounded-b-[0.8%] bg-[#0a0a0c] px-[2.6%] pt-[2.9%] pb-[3.4%] shadow-2xl ring-1 ring-bbw-border">
        {/* Camera */}
        <span aria-hidden className="absolute top-[1.1%] left-1/2 aspect-square w-[0.9%] -translate-x-1/2 rounded-full bg-[#1c1c20] ring-1 ring-white/10" />
        {/* Screen */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.4%] bg-bbw-surface2">{children}</div>
      </div>
      {/* Base: a slim aluminium slab, a little wider than the lid, with the thumb scoop. */}
      <div aria-hidden className="relative h-0 w-full rounded-b-[40%_100%] bg-[linear-gradient(180deg,#8e8e93,#58585e_45%,#2b2b30)] pb-[3.4%] shadow-lg ring-1 ring-bbw-border">
        <span className="absolute top-0 left-1/2 h-[42%] w-[15%] -translate-x-1/2 rounded-b-[60%] bg-[#38383d]" />
      </div>
    </div>
  )
}
