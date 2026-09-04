import type { BusinessArm } from '../data/company'
import { COMPANY_PILLARS } from '../content/site'
import { ACCENT, BORDER, MUTED, SURFACE, SURFACE2, mono } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'
import BusinessArms from './BusinessArms'

export default function AboutSection({ businessArms }: { businessArms: BusinessArm[] }) {
  return (
    <section id="about" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(48px, 8vw, 100px)', alignItems: 'start' }}>
        <div>
          <Eyebrow>About BBW Tech</Eyebrow>
          <SectionHeading maxWidth={460}>Young company.<br />Serious execution.<br /><em style={{ color: ACCENT }}>Long-term vision.</em></SectionHeading>
          <p style={{ color: MUTED, lineHeight: 1.75, fontSize: 15, marginTop: 24, maxWidth: 400 }}>BBW Tech Innovations is the technology arm of BBW Multi-Skills Ltd — a Nigerian business ecosystem spanning technology, construction, infrastructure, maintenance, and lifestyle.</p>
          <p style={{ color: MUTED, lineHeight: 1.75, fontSize: 15, marginTop: 14, maxWidth: 400 }}>We are a startup. We don't pretend otherwise. But we build seriously, we ship real products, and our long-term goal is clear: to become Africa's leading hub for SaaS innovation.</p>
          <div style={{ marginTop: 40 }}>
            <p style={{ ...mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 16 }}>BBW Multi-Skills Ltd — Business Arms</p>
            <BusinessArms arms={businessArms} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {COMPANY_PILLARS.map(({ label, text }) => (
            <article key={label} style={{ padding: '22px 24px', border: `1px solid ${BORDER}`, borderRadius: 6, background: SURFACE2 }}>
              <p style={{ ...mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>{label}</p>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7 }}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
