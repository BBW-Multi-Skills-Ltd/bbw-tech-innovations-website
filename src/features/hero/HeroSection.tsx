import { ACCENT, BORDER, FG, MUTED, display, mono } from '../../styles/theme'
import AnimatedHeroGrid from './AnimatedHeroGrid'

export default function HeroSection({ dark, onStartProject }: { dark: boolean; onStartProject: () => void }) {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(72px, 6vw, 88px) clamp(20px, 5vw, 80px) 80px', position: 'relative', overflow: 'hidden' }}>
      <AnimatedHeroGrid dark={dark} />
      <div style={{ position: 'absolute', top: '15%', left: '40%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(41,121,255,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', border: `1px solid ${BORDER}`, borderRadius: 100, marginBottom: 44, ...mono, fontSize: 11, letterSpacing: '0.14em', color: MUTED }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, display: 'inline-block', animation: 'dot-pulse 2.2s ease-in-out infinite' }} />
          A BBW Multi-Skills Ltd Company
        </div>
        <h1 style={{ ...display, fontSize: 'clamp(44px, 8vw, 96px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.035em', color: FG, marginBottom: 28 }}>
          We Build Technology<br />That Moves Businesses<br /><em style={{ color: ACCENT }}>Forward.</em>
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: MUTED, maxWidth: 560, lineHeight: 1.7, marginBottom: 44 }}>
          BBW Tech Innovations designs and develops websites, applications, SaaS products, and intelligent digital systems for businesses ready to grow.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 80 }}>
          <button type="button" onClick={onStartProject} className="btn-primary">Start a Project →</button>
          <a href="#work" className="btn-ghost">Explore Our Work</a>
        </div>
        <p style={{ ...mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED }}>Built by Will. Powered by Skills.</p>
      </div>
    </section>
  )
}
