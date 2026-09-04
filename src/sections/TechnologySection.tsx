import { TECHNOLOGIES } from '../content/site'
import { BORDER, BORDER_HI, FG, MUTED, mono } from '../styles/theme'

export default function TechnologySection() {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ ...mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, marginBottom: 28 }}>Technologies We Work With</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {TECHNOLOGIES.map(technology => (
            <span key={technology} style={{ ...mono, padding: '5px 14px', border: `1px solid ${BORDER}`, borderRadius: 100, fontSize: 11, color: MUTED, cursor: 'default', transition: 'border-color 0.2s, color 0.2s' }} onMouseEnter={event => { event.currentTarget.style.borderColor = BORDER_HI; event.currentTarget.style.color = FG }} onMouseLeave={event => { event.currentTarget.style.borderColor = BORDER; event.currentTarget.style.color = MUTED }}>
              {technology}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
