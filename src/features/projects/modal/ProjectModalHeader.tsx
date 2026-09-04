import type { Project } from '../../../data/projects'
import { BORDER, FG, MUTED, SURFACE, display, mono } from '../../../styles/theme'
import StatusBadge from '../../../components/ui/StatusBadge'

export default function ProjectModalHeader({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, background: SURFACE, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: project.accentColor, display: 'grid', placeItems: 'center', ...display, fontWeight: 700, fontSize: 13, color: '#fff' }}>{project.name[0]}</div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, color: FG, lineHeight: 1.2 }}>{project.name}</p>
          <p style={{ ...mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>{project.category}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge status={project.status} />
        <button type="button" aria-label="Close project details" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${BORDER}`, background: 'transparent', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1, display: 'grid', placeItems: 'center' }}>✕</button>
      </div>
    </header>
  )
}
