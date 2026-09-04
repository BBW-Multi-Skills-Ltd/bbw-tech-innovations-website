import type { InquiryMode } from './types'
import { ACCENT, FG, MUTED, display, mono } from '../../styles/theme'

export default function ContactSuccess({ mode }: { mode: InquiryMode }) {
  return (
    <div aria-live="polite" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(41,121,255,0.12)', border: '1px solid rgba(41,121,255,0.3)', display: 'grid', placeItems: 'center', margin: '0 auto 24px', color: ACCENT }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h3 style={{ ...display, fontSize: 24, fontWeight: 700, color: FG, marginBottom: 12 }}>Enquiry received</h3>
      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>Thank you. The BBW Tech team will review your enquiry and reply soon.</p>
      {mode === 'video' && <p style={{ color: MUTED, fontSize: 13, marginBottom: 28 }}>Your video has been uploaded privately and securely.</p>}
      <p style={{ ...mono, fontSize: 11, color: ACCENT, letterSpacing: '0.1em' }}>BBW TECH INNOVATIONS</p>
    </div>
  )
}
