/** True when the browser can draw WebGL. Kept apart from the 3D code so checking doesn't load three.js. */
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Phones and small touch screens get a still render of the 3D logo
 * (public/logos/bbw-logo-3d.webp) instead of the live scene: three.js is
 * about 1 MB of script, too heavy for a phone's first visit.
 * Keep in sync with the media query in styles/hero.css.
 */
export const STILL_LOGO_QUERY = '(max-width: 767px), (pointer: coarse) and (max-width: 1023px)'

/** Load the live 3D logo? (WebGL works, and this isn't a phone-sized screen.) */
export function wantsLive3D() {
  return hasWebGL() && !window.matchMedia(STILL_LOGO_QUERY).matches
}
