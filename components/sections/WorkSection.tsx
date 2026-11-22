import type { Project } from '@/lib/data/projects'
import SectionHeading, { Eyebrow } from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/projects/ProjectCard'
import AgencyEmptyState from '@/components/ui/AgencyEmptyState'

function WorkGroup({ label, title, projects }: { label: string; title: string; projects: Project[] }) {
  return (
    <div className="client-work-group">
      <div className="client-work-group-heading">
        <p>{label}</p>
        <h3>{title}</h3>
      </div>
      <div className="client-work-grid">
        {projects.length ? projects.map(project => <ProjectCard key={project.id} project={project} variant="work" />) : <AgencyEmptyState title="Your project could be the next story we tell." description="We partner with ambitious businesses to turn complex problems into practical digital products." />}
      </div>
    </div>
  )
}

export default function WorkSection({ works }: { works: Project[] }) {
  const appWorks = works.filter(project => project.badge === 'mobile-app')
  const websiteWorks = works.filter(project => project.badge !== 'mobile-app')

  return (
    <section id="work" className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 flex flex-wrap items-start justify-between gap-6">
          <div><Eyebrow>Our Works</Eyebrow><SectionHeading className="max-w-[520px]">Projects we&apos;ve built<br />for our clients.</SectionHeading></div>
          <p className="max-w-[300px] pt-2 text-sm leading-[1.7] text-bbw-muted">Real businesses, real problems, real digital solutions — delivered by BBW Tech.</p>
        </div>
        <WorkGroup label="Mobile App Projects" title="Apps built for our clients." projects={appWorks} />
        <WorkGroup label="Website & Web Platform Projects" title="Web experiences built for our clients." projects={websiteWorks} />
      </div>
    </section>
  )
}
