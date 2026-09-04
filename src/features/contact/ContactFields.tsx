import type { ContactDetails } from './types'
import { ACCENT, MUTED, mono } from '../../styles/theme'

export default function ContactFields({ details, onChange }: { details: ContactDetails; onChange: (field: keyof ContactDetails, value: string) => void }) {
  const fields = [
    { field: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Your full name', autoComplete: 'name' },
    { field: 'phone' as const, label: 'Phone Number', type: 'tel', placeholder: '+234 800 000 0000', autoComplete: 'tel' },
    { field: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'your@email.com', autoComplete: 'email' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
      {fields.map(({ field, label, ...input }) => (
        <label key={field}>
          <span style={{ ...mono, display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 2 }}>{label}</span>
          <input {...input} required value={details[field]} onChange={event => onChange(field, event.target.value)} style={{ width: '100%', padding: '14px 0', fontSize: 15, color: 'var(--bbw-fg)', background: 'transparent', border: 'none', borderBottom: '1px solid var(--bbw-border-hi)', outline: 'none', fontFamily: "'Outfit', sans-serif" }} onFocus={event => { event.currentTarget.style.borderBottomColor = ACCENT }} onBlur={event => { event.currentTarget.style.borderBottomColor = 'var(--bbw-border-hi)' }} />
        </label>
      ))}
    </div>
  )
}
