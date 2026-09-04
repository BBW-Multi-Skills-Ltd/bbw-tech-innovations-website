import { ACCENT, BORDER, MUTED, mono } from '../../styles/theme'

export default function ScrollingStrip({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '14px 0', overflow: 'hidden' }}>
      <div className="marquee-track">
        {[...items, ...items].map((label, index) => (
          <span key={`${index}-${label}`} style={{ ...mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, whiteSpace: 'nowrap', marginRight: 48, display: 'inline-flex', alignItems: 'center', gap: 48 }}>
            {label}<span style={{ color: ACCENT, opacity: 0.4, fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
