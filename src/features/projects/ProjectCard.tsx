import { useState } from 'react'
import type { Project } from '../../data/projects'
import { getProjectPlatformLabel } from '../../data/projects'
import { ACCENT, BORDER, BORDER_HI, FG, MUTED, SURFACE, mono } from '../../styles/theme'
import StatusBadge from '../../components/ui/StatusBadge'
import { BrowserPreview, PhonePreview } from './ProjectPreview'

type CardVariant = 'app' | 'website' | 'work'

function ExternalLink({ project, label }: { project: Project; label: string }) {
  if (!project.siteUrl || project.siteUrl === '#') return null
  return (
    <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 5, color: MUTED, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
      {label}<span aria-hidden="true">↗</span>
    </a>
  )
}

export default function ProjectCard({ project, variant, onOpen }: { project: Project; variant: CardVariant; onOpen: (project: Project) => void }) {
  const [hovered, setHovered] = useState(false)
  const isPhone = variant === 'app' || project.badge === 'mobile-app'
  const meta = variant === 'app' ? getProjectPlatformLabel(project) : project.category
  const badgeLabel = project.badge === 'mobile-app' ? 'Mobile App' : 'Website'

  return (
    <article onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ border: `1px solid ${hovered ? BORDER_HI : BORDER}`, borderRadius: 10, overflow: 'hidden', background: SURFACE, transition: 'border-color 0.2s, transform 0.25s', transform: hovered ? 'translateY(-4px)' : 'none', display: 'flex', flexDirection: 'column' }}>
      {isPhone ? <PhonePreview {...project} /> : <BrowserPreview {...project} />}
      <div style={{ padding: '20px 20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: FG }}>{project.name}</h3>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {variant === 'work' && <span style={{ ...mono, fontSize: 9, color: ACCENT, border: `1px solid ${ACCENT}38`, padding: '2px 7px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{badgeLabel}</span>}
            <StatusBadge status={project.status} />
          </div>
        </div>
        {meta && <p style={{ ...mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>{meta}</p>}
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{project.shortDesc}</p>
        {variant === 'work' && project.review?.quote && (
          <figure className="work-review-preview">
            <blockquote>“{project.review.quote}”</blockquote>
            <figcaption><strong>{project.review.clientName || 'Client'}</strong>{project.review.clientRole && <span>{project.review.clientRole}</span>}</figcaption>
          </figure>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => onOpen(project)} style={{ flex: 1, minWidth: 120, padding: '10px 14px', background: project.accentColor, border: 'none', borderRadius: 5, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View Details</button>
          {variant !== 'app' && <ExternalLink project={project} label={variant === 'work' ? 'Visit Site' : 'View Site'} />}
        </div>
      </div>
    </article>
  )
}
