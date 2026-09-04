import type { Project } from '../data/projects'
import { ACCENT, BORDER, FG, MUTED, display, mono } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'
import ProjectCard from '../features/projects/ProjectCard'

function ShowcaseHeading({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
      <div>
        <p style={{ ...mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6 }}>{label}</p>
        <h3 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, ...display, color: FG, letterSpacing: '-0.02em' }}>{title}</h3>
      </div>
      <p style={{ color: MUTED, fontSize: 13, maxWidth: 260, lineHeight: 1.7 }}>{description}</p>
    </div>
  )
}

export default function ProductsSection({ apps, websites, onOpen }: { apps: Project[]; websites: Project[]; onOpen: (project: Project) => void }) {
  return (
    <section id="products" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <Eyebrow>Our Products</Eyebrow>
          <SectionHeading maxWidth={700}>We don't just build for businesses.<br /><em style={{ color: ACCENT }}>We build businesses through technology.</em></SectionHeading>
          <p style={{ color: MUTED, fontSize: 15, marginTop: 18, lineHeight: 1.7 }}>We've built across <span style={{ color: FG }}>mobile apps</span> and <span style={{ color: FG }}>websites</span> — shipping real products that solve real problems.</p>
        </div>
        <div style={{ marginBottom: 80 }}>
          <ShowcaseHeading label="App Showcase" title="Mobile apps we've shipped." description="Built mobile-first, designed for real users, engineered to scale." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {apps.map(project => <ProjectCard key={project.id} project={project} variant="app" onOpen={onOpen} />)}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 80 }} />
        <ShowcaseHeading label="Website Showcase" title="Websites and web platforms." description="From simple business sites to real-time platforms — each project solves a real problem." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {websites.map(project => <ProjectCard key={project.id} project={project} variant="website" onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  )
}
