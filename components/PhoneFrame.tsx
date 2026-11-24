import type { ReactNode } from 'react'

// Bezel = 3% of the width on every side. Screen 0.94w × (0.94w × 19/9) ⇒ frame w × 2.044w.
const FRAME_ASPECT = 'aspect-[1/2.044]'

/**
 * The site's one phone (from the portfolio): a Galaxy S10-style handset (thin
 * bezels, rounded corners, the camera hole top right, side buttons), drawn in
 * CSS with no brand marks. Every size is a percentage, so it looks the same
 * from a small thumbnail to the case study cover.
 *
 * The screen is 9 × 19: a 1080 × 2280 px screenshot fills it exactly
 * (lib/screens.ts). Size it with a width or a height class.
 */
export function PhoneFrame({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`relative shrink-0 ${FRAME_ASPECT} ${className}`}>
      {/* Side buttons: volume and side key on the left, power on the right. */}
      <span aria-hidden className="absolute top-[15%] -left-[1.6%] h-[11%] w-[1.6%] rounded-l-full bg-[#26262b]" />
      <span aria-hidden className="absolute top-[29%] -left-[1.6%] h-[6%] w-[1.6%] rounded-l-full bg-[#26262b]" />
      <span aria-hidden className="absolute top-[22%] -right-[1.6%] h-[7%] w-[1.6%] rounded-r-full bg-[#26262b]" />

      {/* Body: near-black with lighter, curved-looking edges. */}
      <div className="absolute inset-0 rounded-[11%/5.4%] bg-[linear-gradient(90deg,#222227,#0a0a0c_6%,#0a0a0c_94%,#222227)] shadow-2xl ring-1 ring-bbw-border">
        {/* Screen */}
        <div className="absolute top-[1.47%] right-[3%] bottom-[1.47%] left-[3%] overflow-hidden rounded-[8.5%/4%] bg-bbw-surface2">
          {children}
          {/* The camera hole, top right. */}
          <span aria-hidden className="absolute top-[1.6%] right-[7%] aspect-square w-[5.5%] rounded-full bg-[#050505] ring-1 ring-white/10" />
        </div>
      </div>
    </div>
  )
}
