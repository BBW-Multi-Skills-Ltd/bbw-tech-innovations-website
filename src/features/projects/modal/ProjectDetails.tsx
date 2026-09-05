import type { Project } from '../../../data/projects'
import { BORDER, FG, MUTED, SURFACE2, display, mono } from '../../../styles/theme'
import ModalSection from './ModalSection'

export default function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="modal-details" style={{ padding: 'clamp(24px, 4vw, 40px)', overflowY: 'auto' }}>
      <header style={{ marginBottom: 40 }}>
        <h2 id="project-modal-title" style={{ ...display, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em', color: FG, marginBottom: 10 }}>{project.name}</h2>
        <p style={{ color: project.accentColor, fontWeight: 600, fontSize: 15 }}>{project.tagline}</p>
      </header>
      <ModalSection title="About the Project"><p style={{ color: MUTED, fontSize: 15, lineHeight: 1.8 }}>{project.about}</p></ModalSection>
      {project.review?.quote && (
        <ModalSection title="Client Review">
          <figure style={{ padding: '22px 24px', border: `1px solid ${project.accentColor}35`, borderRadius: 7, background: `${project.accentColor}0D` }}>
            <blockquote style={{ ...display, color: FG, fontSize: 19, fontStyle: 'italic', lineHeight: 1.65 }}>“{project.review.quote}”</blockquote>
            <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 18 }}><strong style={{ color: FG, fontSize: 13 }}>{project.review.clientName || 'Client'}</strong>{project.review.clientRole && <span style={{ color: MUTED, fontSize: 12 }}>{project.review.clientRole}</span>}</figcaption>
          </figure>
        </ModalSection>
      )}
      <ModalSection title="Roles & Team">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {project.roles.map(role => (
            <article key={`${role.title}-${role.desc}`} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px', border: `1px solid ${BORDER}`, borderRadius: 6, background: SURFACE2 }}>
              <div aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0, background: `${project.accentColor}18`, border: `1px solid ${project.accentColor}28`, display: 'grid', placeItems: 'center', color: project.accentColor, fontSize: 13 }}>{role.icon}</div>
              <div><h4 style={{ fontWeight: 600, fontSize: 14, color: FG, marginBottom: 3 }}>{role.title}</h4><p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{role.desc}</p></div>
            </article>
          ))}
        </div>
      </ModalSection>
      <ModalSection title="Features">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {project.features.map((feature, index) => (
            <article key={`${feature.name}-${index}`} style={{ display: 'flex', gap: 14 }}>
              <div aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, background: project.accentColor, display: 'grid', placeItems: 'center', ...mono, fontSize: 9, fontWeight: 700, color: '#fff', marginTop: 2 }}>{String(index + 1).padStart(2, '0')}</div>
              <div><h4 style={{ fontWeight: 600, fontSize: 14, color: FG, marginBottom: 4 }}>{feature.name}</h4><p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{feature.desc}</p></div>
            </article>
          ))}
        </div>
      </ModalSection>
      <ModalSection title="Tech Stack"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{project.tech.map(technology => <span key={technology} style={{ ...mono, padding: '5px 14px', border: `1px solid ${BORDER}`, borderRadius: 100, fontSize: 12, color: MUTED, background: SURFACE2 }}>{technology}</span>)}</div></ModalSection>
      <div style={{ marginTop: 8, padding: 24, border: `1px solid ${project.accentColor}28`, borderRadius: 8, background: `${project.accentColor}08`, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ ...display, fontSize: 18, fontWeight: 600, color: FG }}>Interested in building something like this?</p>
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>BBW Tech Innovations can design and build a custom version for your business — or help you launch your own product.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="#contact" onClick={onClose} style={{ padding: '10px 20px', background: project.accentColor, color: '#fff', borderRadius: 5, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Start a Project →</a>
          {project.type === 'website' && project.siteUrl && project.siteUrl !== '#' && <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', border: `1px solid ${BORDER}`, color: FG, borderRadius: 5, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>View Live Site</a>}
        </div>
      </div>
    </div>
  )
}
