import type { Project } from '../data/projects'
import { BORDER, MUTED } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'
import ProjectCard from '../features/projects/ProjectCard'

function WorkGroup({ label, title, projects, onOpen }: { label: string; title: string; projects: Project[]; onOpen: (project: Project) => void }) {
  if (!projects.length) return null

  return (
    <div className="client-work-group">
      <div className="client-work-group-heading">
        <p>{label}</p>
        <h3>{title}</h3>
      </div>
      <div className="client-work-grid">
        {projects.map(project => <ProjectCard key={project.id} project={project} variant="work" onOpen={onOpen} />)}
      </div>
    </div>
  )
}

export default function WorkSection({ works, onOpen }: { works: Project[]; onOpen: (project: Project) => void }) {
  const appWorks = works.filter(project => project.badge === 'mobile-app')
  const websiteWorks = works.filter(project => project.badge !== 'mobile-app')

  return (
    <section id="work" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
          <div><Eyebrow>Our Works</Eyebrow><SectionHeading maxWidth={520}>Projects we've built<br />for our clients.</SectionHeading></div>
          <p style={{ color: MUTED, fontSize: 14, maxWidth: 300, lineHeight: 1.7, paddingTop: 8 }}>Real businesses, real problems, real digital solutions — delivered by BBW Tech.</p>
        </div>
        <WorkGroup label="Mobile App Projects" title="Apps built for our clients." projects={appWorks} onOpen={onOpen} />
        <WorkGroup label="Website & Web Platform Projects" title="Web experiences built for our clients." projects={websiteWorks} onOpen={onOpen} />
      </div>
    </section>
  )
}
