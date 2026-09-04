import { ACCENT, FG, MUTED, SURFACE, mono } from '../../styles/theme'

export default function MessageField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label style={{ display: 'block', marginBottom: 28 }}>
      <span style={{ ...mono, display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Your Message</span>
      <textarea aria-label="Project details" value={value} onChange={event => onChange(event.target.value)} placeholder="Tell us about your business, the problem you're solving, and what you need built…" rows={5} style={{ width: '100%', padding: 14, fontSize: 14, color: FG, background: SURFACE, border: '1px solid var(--bbw-border-hi)', borderRadius: 6, outline: 'none', fontFamily: "'Outfit', sans-serif", resize: 'vertical', lineHeight: 1.6 }} onFocus={event => { event.currentTarget.style.borderColor = ACCENT }} onBlur={event => { event.currentTarget.style.borderColor = 'var(--bbw-border-hi)' }} />
    </label>
  )
}
