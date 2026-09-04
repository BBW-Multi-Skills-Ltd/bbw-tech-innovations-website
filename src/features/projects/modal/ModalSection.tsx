import type { ReactNode } from 'react'
import { BORDER, MUTED, mono } from '../../../styles/theme'

export default function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h3 style={{ ...mono, fontSize: 10, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED }}>{title}</h3>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>
      {children}
    </section>
  )
}
