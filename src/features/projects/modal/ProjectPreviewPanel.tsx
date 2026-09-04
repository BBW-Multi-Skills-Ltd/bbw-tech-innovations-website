import type { Project } from '../../../data/projects'
import { getProjectPlatformLabel } from '../../../data/projects'
import { BORDER, MUTED, SURFACE, mono } from '../../../styles/theme'
import BrowserDemo from './BrowserDemo'
import PhoneDemo from './PhoneDemo'
import QrCode from './QrCode'

export default function ProjectPreviewPanel({ project }: { project: Project }) {
  const platformLabel = getProjectPlatformLabel(project)
  return (
    <aside className="modal-preview" style={{ background: SURFACE, borderRight: `1px solid ${BORDER}`, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, position: 'sticky', top: 61, alignSelf: 'flex-start' }}>
      {project.type === 'app' ? <PhoneDemo project={project} /> : <BrowserDemo project={project} />}
      <div style={{ width: '100%', height: 1, background: BORDER }} />
      {project.type === 'app' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
          <QrCode accentColor={project.accentColor} />
          {platformLabel && <span style={{ ...mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 100, padding: '3px 10px' }}>{platformLabel}</span>}
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {project.siteUrl && project.siteUrl !== '#' && <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 20px', background: project.accentColor, borderRadius: 5, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Visit Live Site →</a>}
          <p style={{ ...mono, textAlign: 'center', fontSize: 10, letterSpacing: '0.1em', color: MUTED }}>{project.year}</p>
        </div>
      )}
    </aside>
  )
}
