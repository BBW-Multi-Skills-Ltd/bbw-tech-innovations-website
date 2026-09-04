import { SERVICES } from '../content/site'
import { BORDER, FG, MUTED } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'

export default function SolutionsSection() {
  return (
    <section id="solutions" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <Eyebrow>What We Build</Eyebrow>
          <SectionHeading maxWidth={580}>Technology that solves<br />real business problems.</SectionHeading>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', background: BORDER, gap: 1, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          {SERVICES.map(service => (
            <article key={service.title} className="service-card">
              <div className="service-icon"><span style={{ fontSize: 15 }}>{service.icon}</span></div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: FG, marginBottom: 10 }}>{service.title}</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
