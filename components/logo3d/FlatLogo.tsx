import { LOGO_URL } from '@/lib/bbw-logo'

/**
 * The flat BBW logo (the official SVG) in brand blue, top to bottom like the
 * 3D one. Drawn as a mask so the SVG file is the only copy of the shapes.
 * Its box is the SVG's viewBox.
 */
export function FlatLogo({ className = '' }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="BBW"
      className={`block aspect-[1557/777] ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #22c4ff 0%, #167aff 30%, #0b5aff 60%, #0640d4 85%, #031f8c 100%)',
        mask: `url(${LOGO_URL}) center / contain no-repeat`,
        WebkitMask: `url(${LOGO_URL}) center / contain no-repeat`,
      }}
    />
  )
}
