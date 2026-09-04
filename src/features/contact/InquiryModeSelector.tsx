import type { InquiryMode } from './types'
import { ACCENT, BORDER, MUTED, mono } from '../../styles/theme'

const modes = [
  { id: 'text' as const, label: 'Type a Message', icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
  { id: 'video' as const, label: 'Record a Video', icon: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></> },
]

export default function InquiryModeSelector({ mode, onSelect }: { mode: InquiryMode; onSelect: (mode: Exclude<InquiryMode, 'idle'>) => void }) {
  return (
    <fieldset style={{ border: 0, margin: '0 0 28px', padding: 0 }}>
      <legend style={{ ...mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>How would you like to tell us about your project?</legend>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {modes.map(option => (
          <button type="button" aria-pressed={mode === option.id} key={option.id} onClick={() => onSelect(option.id)} style={{ padding: '18px 16px', border: `1px solid ${mode === option.id ? 'rgba(41,121,255,0.5)' : BORDER}`, borderRadius: 8, background: mode === option.id ? 'rgba(41,121,255,0.08)' : 'transparent', color: mode === option.id ? ACCENT : MUTED, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{option.icon}</svg>
            {option.label}
            {option.id === 'video' && <span style={{ ...mono, fontSize: 9, letterSpacing: '0.12em', opacity: 0.6 }}>MAX 30 MIN</span>}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
