import { ACCENT, FG, MUTED, display, mono } from '../../styles/theme'

export default function ContactHeader({ onClose }: { onClose: () => void }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
      <div>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>Start a Project</p>
        <h2 id="contact-title" style={{ ...display, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: FG, lineHeight: 1.1 }}>Let's build something<br /><em style={{ color: ACCENT }}>worth building.</em></h2>
      </div>
      <button type="button" aria-label="Close project enquiry" onClick={onClose} style={{ background: 'none', border: '1px solid var(--bbw-border)', borderRadius: '50%', width: 36, height: 36, display: 'grid', placeItems: 'center', cursor: 'pointer', color: MUTED, flexShrink: 0, marginTop: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </header>
  )
}
