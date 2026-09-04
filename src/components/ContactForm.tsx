import { useCallback, useEffect, useState } from 'react'
import ContactFields from '../features/contact/ContactFields'
import ContactHeader from '../features/contact/ContactHeader'
import ContactSuccess from '../features/contact/ContactSuccess'
import InquiryModeSelector from '../features/contact/InquiryModeSelector'
import MessageField from '../features/contact/MessageField'
import VideoRecorder from '../features/contact/VideoRecorder'
import { prepareEmailInquiry } from '../features/contact/legacySubmission'
import type { ContactDetails, InquiryMode } from '../features/contact/types'
import useVideoRecorder from '../features/contact/useVideoRecorder'
import { ACCENT, MUTED, mono } from '../styles/theme'

interface ContactFormProps {
  open: boolean
  onClose: () => void
}

const emptyDetails: ContactDetails = { name: '', phone: '', email: '' }

export default function ContactForm({ open, onClose }: ContactFormProps) {
  const [details, setDetails] = useState<ContactDetails>(emptyDetails)
  const [mode, setMode] = useState<InquiryMode>('idle')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const video = useVideoRecorder()
  const resetVideo = video.reset

  const handleClose = useCallback(() => {
    resetVideo()
    setMode('idle')
    setMessage('')
    setSubmitted(false)
    onClose()
  }, [onClose, resetVideo])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && open) handleClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, open])

  if (!open) return null
  const canSubmit = Boolean(details.name.trim() && details.phone.trim() && details.email.trim() && ((mode === 'text' && message.trim()) || (mode === 'video' && video.videoUrl)))

  const selectMode = (nextMode: Exclude<InquiryMode, 'idle'>) => {
    setMode(nextMode)
    if (nextMode === 'video') window.setTimeout(video.prepareCamera)
    else video.reset()
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    prepareEmailInquiry({ ...details, mode, message, videoUrl: video.videoUrl })
    setSubmitted(true)
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="contact-title" style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(41,121,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(41,121,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(41,121,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <ContactHeader onClose={handleClose} />
        {submitted ? <ContactSuccess mode={mode} /> : (
          <form onSubmit={submit}>
            <ContactFields details={details} onChange={(field, value) => setDetails(current => ({ ...current, [field]: value }))} />
            <InquiryModeSelector mode={mode} onSelect={selectMode} />
            {mode === 'text' && <MessageField value={message} onChange={setMessage} />}
            {mode === 'video' && <VideoRecorder name={details.name} videoRef={video.videoRef} recording={video.recording} elapsed={video.elapsed} videoUrl={video.videoUrl} cameraError={video.cameraError} onStart={video.startRecording} onStop={video.stopRecording} onReset={video.prepareCamera} />}
            <p style={{ ...mono, fontSize: 11, color: MUTED, letterSpacing: '0.08em', textAlign: 'center', marginBottom: 24 }}>Your email application will open with the enquiry ready to send.</p>
            <button type="submit" disabled={!canSubmit} style={{ width: '100%', padding: 15, background: canSubmit ? ACCENT : 'rgba(41,121,255,0.2)', border: 'none', borderRadius: 6, color: canSubmit ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>Send Enquiry →</button>
          </form>
        )}
      </div>
    </div>
  )
}
