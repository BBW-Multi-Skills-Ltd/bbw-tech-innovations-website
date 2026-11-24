/**
 * The background behind a project logo on card covers: a soft gradient of the
 * project's accent colour. A very light or very dark accent is moved toward the
 * middle first (the background changes, never the logo), so the gradient stays
 * visible and the cover doesn't vanish into the page in either theme.
 */
type Rgb = [number, number, number]

function parseHex(color: string): Rgb | null {
  const hex = color.trim().replace(/^#/, '')
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)) as Rgb
}

const mix = (a: Rgb, b: Rgb, amount: number): Rgb => a.map((v, i) => Math.round(v + (b[i] - v) * amount)) as Rgb
const css = ([r, g, b]: Rgb) => `rgb(${r} ${g} ${b})`
const WHITE: Rgb = [255, 255, 255]
const BLACK: Rgb = [0, 0, 0]

/** WCAG relative luminance, 0 (black) to 1 (white). */
function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const FALLBACK: Rgb = [41, 121, 255] // BBW accent #2979FF

export function logoCoverBackground(accent: string | undefined) {
  let base = (accent && parseHex(accent)) || FALLBACK
  const lum = luminance(base)
  if (lum > 0.6) base = mix(base, BLACK, Math.min(0.45, (lum - 0.6) * 1.2 + 0.15))
  else if (lum < 0.06) base = mix(base, WHITE, 0.14)
  return `radial-gradient(120% 120% at 25% 15%, ${css(mix(base, WHITE, 0.2))} 0%, ${css(base)} 45%, ${css(mix(base, BLACK, 0.35))} 100%)`
}
