// Where the hero logo stands and how big it is. Used by the walk
// (useLogoWalk) and, as a string, by the inline script that places the still
// logo before the first paint: keep the two in sync.
//
// Sizes are for the logo's box, the SVG viewBox (1557 × 777): the logo fills
// it almost edge to edge and its lowest point (the swoosh) is its bottom.

import { LOGO_ASPECT } from '@/lib/bbw-logo'

/**
 * Logo box size and resting margin for a hero `w` × `h` with the floor line
 * at `floor` (px from the hero's top). The logo is twice as wide as tall, so
 * width is usually the limit.
 */
export function logoSize(w: number, h: number, floor: number) {
  const desktop = w >= 960
  const byHeight = h * (desktop ? 0.36 : 0.3)
  const byWidth = (w * (desktop ? 0.42 : 0.7)) / LOGO_ASPECT
  const logoH = Math.max(60, Math.min(byHeight, byWidth, floor - 100))
  return { logoH, logoW: logoH * LOGO_ASPECT, margin: desktop ? 72 : 16 }
}

/**
 * The same sums as `logoSize()`, as an inline script: puts the still logo at
 * its resting place (the right-hand side) before React loads. It is the
 * page's largest paint on phones.
 */
export const placeLogoScript = `(function(){var s=document.currentScript.parentNode,f=s.querySelector("[data-gh-flat]"),l=s.querySelector("[data-gh-floor]");if(!f||!l)return;var b=s.getBoundingClientRect(),w=s.clientWidth,h=s.clientHeight,fl=l.getBoundingClientRect().top-b.top,d=w>=960,A=${LOGO_ASPECT},H=Math.max(60,Math.min(h*(d?.36:.3),w*(d?.42:.7)/A,fl-100)),W=H*A,x=w-(W/2+(d?72:16));f.style.width=W+"px";f.style.transform="translate("+(x-W/2)+"px,"+(fl-H)+"px)"})()`
