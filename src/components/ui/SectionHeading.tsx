import type { ReactNode } from 'react'
import { ACCENT, FG, display, mono } from '../../styles/theme'

export function Eyebrow({ children, color = ACCENT }: { children: ReactNode; color?: string }) {
  return <p style={{ ...mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color, marginBottom: 18 }}>{children}</p>
}

export default function SectionHeading({ children, maxWidth = 620 }: { children: ReactNode; maxWidth?: number }) {
  return (
    <h2 style={{ ...display, fontSize: 'clamp(32px, 4.5vw, 54px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em', color: FG, maxWidth }}>
      {children}
    </h2>
  )
}
