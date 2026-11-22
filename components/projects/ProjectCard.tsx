import type { Project } from '@/lib/data/projects'
import { getProjectPlatformLabel } from '@/lib/data/projects'
import StatusBadge from '@/components/ui/StatusBadge'
import { BrowserPreview, PhonePreview } from '@/components/projects/ProjectPreview'
import ProjectDetailsButton from '@/components/projects/ProjectDetailsButton'
import { externalUrl } from '@/lib/urls'

type CardVariant = 'app' | 'website' | 'work'

function ExternalLink({ project, label }: { project: Project; label: string }) {
  if (!project.siteUrl || project.siteUrl === '#') return null
  return (
    <a href={externalUrl(project.siteUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-[5px] rounded-[5px] border border-bbw-border bg-transparent px-3.5 py-2.5 text-[13px] whitespace-nowrap text-bbw-muted no-underline">
      {label}<span aria-hidden="true">↗</span>
    </a>
  )
}

export default function ProjectCard({ project, variant }: { project: Project; variant: CardVariant }) {
  const isPhone = variant === 'app' || project.badge === 'mobile-app'
  const isComingSoonProduct = project.isOwn && project.status === 'coming-soon'
  const meta = variant === 'app' ? getProjectPlatformLabel(project) : project.category

  return (
    <article className={`project-card project-card--${isPhone ? 'app' : 'website'} flex flex-col overflow-hidden rounded-[10px] border border-bbw-border bg-bbw-surface transition-[border-color,transform] duration-[200ms,250ms] hover:-translate-y-1 hover:border-bbw-border-hi`}>
      {isPhone ? <PhonePreview {...project} /> : <BrowserPreview {...project} />}
      <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-[17px] font-semibold tracking-[-0.02em] text-bbw-fg">{project.name}</h3>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <StatusBadge status={project.status} />
          </div>
        </div>
        {meta && <p className="mb-2.5 font-mono text-[10px] tracking-[0.1em] text-bbw-muted uppercase">{meta}</p>}
        <p className="mb-5 flex-1 text-[13px] leading-[1.7] text-bbw-muted">{project.shortDesc}</p>
        {variant === 'work' && project.review?.quote && (
          <figure className="work-review-preview">
            <blockquote>“{project.review.quote}”</blockquote>
            <figcaption><strong>{project.review.clientName || 'Client'}</strong>{project.review.clientRole && <span>{project.review.clientRole}</span>}</figcaption>
          </figure>
        )}
        <div className="flex flex-wrap gap-2">
          <ProjectDetailsButton project={project} disabled={isComingSoonProduct} />
          {variant !== 'app' && !isComingSoonProduct && <ExternalLink project={project} label={variant === 'work' ? 'Visit Site' : 'View Site'} />}
        </div>
      </div>
    </article>
  )
}
