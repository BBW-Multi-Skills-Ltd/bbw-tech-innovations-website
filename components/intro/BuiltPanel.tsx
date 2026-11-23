import { ArrowRight } from 'lucide-react'
import { BrowserPreview, PhonePreview } from '@/components/projects/ProjectPreview'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Project } from '@/lib/data/projects'
import { projectTypeLabel } from '@/lib/featured-projects'
import { IntroPanel } from './IntroSlider'
import { OpenProjectButton } from './OpenProjectButton'

/**
 * Panel 2: What we've built. Up to three featured projects (own products and
 * client work), each opening its project popup (case study pages come later),
 * plus "See all work".
 */
export function BuiltPanel({ projects }: { projects: Project[] }) {
  const count = projects.length
  return (
    <IntroPanel label="2 of 3: What we’ve built">
      <p className="font-mono text-[11px] tracking-[0.16em] text-bbw-accent uppercase">
        What we’ve built{count > 1 ? <span className="text-bbw-muted"> · Top {count}</span> : null}
      </p>
      <h2 className="mt-4 max-w-[900px] font-display text-[clamp(34px,5vw,44px)] leading-[1.04] font-bold tracking-[-0.03em] text-bbw-fg stick:mt-3 stick:text-[clamp(26px,4dvh,36px)] min-[960px]:text-[clamp(40px,6.4svh,64px)]">
        Real businesses, real problems, <em className="text-bbw-accent">real digital solutions.</em>
      </h2>

      <ul className="mt-10 grid gap-4 short:mt-6 stick:mt-5 stick:gap-2.5 min-[768px]:grid-cols-3 min-[960px]:gap-6">
        {projects.map(project => {
          const isPhone = project.type === 'app' || project.badge === 'mobile-app'
          const comingSoon = project.isOwn && project.status === 'coming-soon'
          return (
            <li key={project.id}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-bbw-border bg-bbw-surface transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-bbw-border-hi">
                {/* Card image (or the project’s drawn preview); hidden on phone-sized slides to fit */}
                <div className="relative h-[clamp(120px,19svh,180px)] overflow-hidden stick:max-[767px]:hidden">
                  {project.cardImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image (Cloudinary or any URL)
                    <img src={project.cardImageUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 [&>div]:h-full">
                      {isPhone ? <PhonePreview {...project} /> : <BrowserPreview {...project} />}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 stick:px-4 stick:py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] tracking-[0.12em] text-bbw-accent uppercase">
                      {project.isOwn ? 'Our product' : 'Client work'} · {projectTypeLabel(project)}
                    </span>
                    <StatusBadge status={project.status} />
                  </div>
                  <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-bbw-fg stick:mt-1.5 stick:text-[16px]">
                    <OpenProjectButton project={project} disabled={comingSoon} />
                  </h3>
                  <p className="intro-line mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-bbw-muted stick:mt-1 stick:line-clamp-1">{project.tagline}</p>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      <a href="#work" className="mt-6 short:mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-bbw-accent uppercase no-underline stick:mt-3">
        See all work <ArrowRight size={14} aria-hidden="true" />
      </a>
    </IntroPanel>
  )
}
