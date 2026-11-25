import { ArrowRight } from 'lucide-react'
import { ACCENT, FG, MUTED, display, mono } from '@/lib/theme'

/**
 * Thank-you screen. With BBWFlow's brief link (used exactly as returned): the
 * "Continue to the full brief" button, and a note that it was also emailed
 * when the visitor gave an email. Without it (the fallback): the usual thanks.
 */
export default function ContactSuccess({ briefUrl, emailed }: { briefUrl: string | null; emailed: boolean }) {
  return (
    <div aria-live="polite" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(41,121,255,0.12)', border: '1px solid rgba(41,121,255,0.3)', display: 'grid', placeItems: 'center', margin: '0 auto 24px', color: ACCENT }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h3 style={{ ...display, fontSize: 24, fontWeight: 700, color: FG, marginBottom: 12 }}>Enquiry received</h3>
      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, marginBottom: briefUrl ? 28 : 8 }}>Thank you. The BBW Tech team will review your enquiry and reply soon.</p>
      {briefUrl ? (
        <>
          <a href={briefUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center gap-2 px-6 py-3 text-[15px]">
            Continue to the full brief <ArrowRight size={16} aria-hidden="true" />
          </a>
          {emailed ? <p style={{ color: MUTED, fontSize: 13, marginTop: 14 }}>We&apos;ve also emailed this link to you.</p> : null}
          <div style={{ height: 28 }} />
        </>
      ) : null}
      <p style={{ ...mono, fontSize: 11, color: ACCENT, letterSpacing: '0.1em' }}>BBW TECH INNOVATIONS</p>
    </div>
  )
}
