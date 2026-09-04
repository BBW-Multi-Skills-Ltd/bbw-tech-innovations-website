import { BUSINESS_PROBLEMS } from '../content/site'
import { ACCENT, ACCENT_DIM, BORDER, FG, MUTED, SURFACE } from '../styles/theme'
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading'

export default function ProblemSection() {
  return (
    <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(48px, 8vw, 100px)', alignItems: 'center' }}>
        <div>
          <Eyebrow>The Problem</Eyebrow>
          <SectionHeading maxWidth={440}>Is your business<br />stuck like this?</SectionHeading>
          <p style={{ color: MUTED, lineHeight: 1.75, fontSize: 15, maxWidth: 380, marginTop: 20 }}>Most businesses across Nigeria and Africa are growing — but running on WhatsApp, paper, and spreadsheets. Their systems haven't kept up.</p>
          <p style={{ color: MUTED, lineHeight: 1.75, fontSize: 15, maxWidth: 380, marginTop: 12 }}>Technology should solve that. That's what we build.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BUSINESS_PROBLEMS.map(problem => (
            <div key={problem} style={{ padding: '13px 18px', border: `1px solid ${BORDER}`, borderRadius: 6, background: SURFACE, display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: MUTED }}>
              <span style={{ color: '#EF4444', fontSize: 13, flexShrink: 0 }}>✗</span>{problem}
            </div>
          ))}
          <div style={{ marginTop: 8, padding: '15px 18px', border: '1px solid rgba(41,121,255,0.28)', borderRadius: 6, background: ACCENT_DIM, display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: FG, fontWeight: 500 }}>
            <span style={{ color: ACCENT }}>→</span>BBW Tech builds the digital systems that fix this.
          </div>
        </div>
      </div>
    </section>
  )
}
