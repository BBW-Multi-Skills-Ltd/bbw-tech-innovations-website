import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { LaptopFrame } from '@/components/LaptopFrame'
import { PhoneFrame } from '@/components/PhoneFrame'
import { DrawnScreen } from '@/components/projects/DrawnScreen'
import StatusBadge from '@/components/ui/StatusBadge'
import { hasCaseStudy } from '@/lib/case-studies/data'
import { isPhoneProject } from '@/lib/case-studies/devices'
import { liveSiteUrl } from '@/lib/case-studies/from-project'
import type { Project } from '@/lib/data/projects'
import { getProjectPlatformLabel } from '@/lib/data/projects'
import { projectTypeLabel } from '@/lib/featured-projects'

/** The card image (or the drawn preview) on a phone or laptop screen. */
function Screen({ project, phone }: { project: Project; phone: boolean }) {
  return project.cardImageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded (Cloudinary or any URL)
    <img src={project.cardImageUrl} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-top" />
  ) : (
    <DrawnScreen project={project} kind={phone ? 'phone' : 'desktop'} />
  )
}

/**
 * A project in the work section: its screen in a phone (apps) or laptop
 * (websites), then the details. "View Details" opens its case study page;
 * coming-soon products have none (as they had no popup).
 */
export function WorkCard({ project }: { project: Project }) {
  const phone = isPhoneProject(project)
  const hasPage = hasCaseStudy(project)
  const live = hasPage ? liveSiteUrl(project) : null
  const meta = phone ? getProjectPlatformLabel(project) || project.category : project.category

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-bbw-border bg-bbw-surface transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-bbw-border-hi">
      <div className="flex justify-center border-b border-bbw-border bg-bbw-surface2 px-6 pt-7 pb-6">
        {phone ? (
          <PhoneFrame className="w-[150px]">
            <Screen project={project} phone />
          </PhoneFrame>
        ) : (
          <LaptopFrame className="w-full max-w-[420px]">
            <Screen project={project} phone={false} />
          </LaptopFrame>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.12em] text-bbw-accent uppercase">{projectTypeLabel(project)}</span>
          <StatusBadge status={project.status} />
        </div>
        <h3 className="mt-3 text-[19px] font-semibold tracking-[-0.02em] text-bbw-fg">{project.name}</h3>
        {meta ? <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-bbw-muted uppercase">{meta}</p> : null}
        <p className="mt-3 flex-1 text-[13px] leading-[1.7] text-bbw-muted">{project.shortDesc}</p>

        {!project.isOwn && project.review?.quote ? (
          <figure className="work-review-preview mt-5">
            <blockquote>“{project.review.quote}”</blockquote>
            <figcaption>
              <strong>{project.review.clientName || 'Client'}</strong>
              {project.review.clientRole ? <span>{project.review.clientRole}</span> : null}
            </figcaption>
          </figure>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {hasPage ? (
            <Link href={`/work/${project.id}`} className="btn-primary min-w-[130px] flex-1 justify-center gap-2 px-4! py-2.5! text-[13px]!">
              View Details
              <ArrowRight size={15} aria-hidden="true" />
              <span className="sr-only">: {project.name}</span>
            </Link>
          ) : (
            <span aria-disabled="true" className="btn-ghost min-w-[130px] flex-1 cursor-default justify-center px-4! py-2.5! text-[13px]! text-bbw-muted!">
              Coming Soon
            </span>
          )}
          {live ? (
            <a href={live} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center gap-1.5 px-4! py-2.5! text-[13px]!">
              Visit Site
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
