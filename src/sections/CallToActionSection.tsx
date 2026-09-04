import { ACCENT, BORDER, FG, MUTED, display, mono } from '../styles/theme'
import { Eyebrow } from '../components/ui/SectionHeading'

export default function CallToActionSection({ onStartProject }: { onStartProject: () => void }) {
  return (
    <section id="contact" style={{ padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 80px)', borderTop: `1px solid ${BORDER}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(41,121,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
        <Eyebrow>Ready to build?</Eyebrow>
        <h2 style={{ ...display, fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.035em', color: FG, marginBottom: 24 }}>Let's build something<br /><em style={{ color: ACCENT }}>worth building.</em></h2>
        <p style={{ color: MUTED, fontSize: 17, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 44px' }}>Tell us about your business. We'll show you how technology can make it operate, grow, and scale.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={onStartProject} className="btn-primary">Start a Project →</button>
          <a href="#products" className="btn-ghost">Explore Our Products</a>
        </div>
        <p style={{ ...mono, fontSize: 11, color: MUTED, marginTop: 40, letterSpacing: '0.12em' }}>bbwmultiskillsltd@gmail.com</p>
      </div>
    </section>
  )
}
