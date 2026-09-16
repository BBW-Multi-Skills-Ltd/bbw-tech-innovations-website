import { ArrowUpRight, Sparkles } from 'lucide-react'
import { ACCENT, BORDER, FG, MUTED, SURFACE2, mono } from '../../styles/theme'

interface AgencyEmptyStateProps {
  title: string
  description: string
  actionLabel?: string
}

export default function AgencyEmptyState({ title, description, actionLabel = 'Start a project' }: AgencyEmptyStateProps) {
  return (
    <div className="agency-empty-state" style={{ minHeight: 210, display: 'grid', placeItems: 'center', padding: '32px 24px', border: `1px dashed ${BORDER}`, borderRadius: 10, background: SURFACE2, textAlign: 'center' }}>
      <div style={{ maxWidth: 440 }}>
        <Sparkles size={19} color={ACCENT} strokeWidth={1.7} aria-hidden="true" />
        <h4 style={{ color: FG, fontSize: 18, fontWeight: 600, margin: '13px 0 8px' }}>{title}</h4>
        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, margin: '0 auto 18px' }}>{description}</p>
        <a href="#contact" style={{ ...mono, display: 'inline-flex', alignItems: 'center', gap: 6, color: ACCENT, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>{actionLabel}<ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  )
}
