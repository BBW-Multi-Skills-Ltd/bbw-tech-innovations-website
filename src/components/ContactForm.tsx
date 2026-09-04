import { useCallback, useEffect, useState } from 'react'
import ContactFields from '../features/contact/ContactFields'
import ContactHeader from '../features/contact/ContactHeader'
import ContactSuccess from '../features/contact/ContactSuccess'
import { submitMessageEnquiry, submitVideoEnquiry } from '../features/contact/enquirySubmission'
import InquiryModeSelector from '../features/contact/InquiryModeSelector'
import MessageField from '../features/contact/MessageField'
import type { ContactDetails, InquiryMode } from '../features/contact/types'
import useVideoRecorder from '../features/contact/useVideoRecorder'
import VideoRecorder from '../features/contact/VideoRecorder'
import { ACCENT, MUTED, mono } from '../styles/theme'

interface ContactFormProps { open: boolean; onClose: () => void }

const emptyDetails: ContactDetails = { name: '', phone: '', email: '' }

export default function ContactForm({ open, onClose }: ContactFormProps) {
  const [details, setDetails] = useState<ContactDetails>(emptyDetails)
  const [mode, setMode] = useState<InquiryMode>('idle')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const video = useVideoRecorder()

  const handleClose = useCallback(() => {
    video.reset()
    setMode('idle'); setMessage(''); setSubmitted(false); setSubmitError('')
    onClose()
  }, [onClose, video])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape' && open) handleClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [handleClose, open])

  if (!open) return null
  const canSubmit = Boolean(details.name.trim() && details.phone.trim() && details.email.trim() && ((mode === 'text' && message.trim()) || (mode === 'video' && video.videoBlob)))

  const selectMode = (nextMode: Exclude<InquiryMode, 'idle'>) => {
    setMode(nextMode)
    if (nextMode === 'video') window.setTimeout(video.prepareCamera)
    else video.reset()
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true); setSubmitError('')
    try {
      if (mode === 'text') await submitMessageEnquiry({ ...details, message })
      if (mode === 'video') await submitVideoEnquiry({ ...details, videoBlob: video.videoBlob })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not send your enquiry. Please try again.')
    } finally { setIsSubmitting(false) }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="contact-title" style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(41,121,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(41,121,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <ContactHeader onClose={handleClose} />
        {submitted ? <ContactSuccess mode={mode} /> : (
          <form onSubmit={submit}>
            <ContactFields details={details} onChange={(field, value) => setDetails(current => ({ ...current, [field]: value }))} />
            <InquiryModeSelector mode={mode} onSelect={selectMode} />
            {mode === 'text' && <MessageField value={message} onChange={setMessage} />}
            {mode === 'video' && <VideoRecorder videoRef={video.videoRef} recording={video.recording} elapsed={video.elapsed} videoUrl={video.videoUrl} cameraError={video.cameraError} onStart={video.startRecording} onStop={video.stopRecording} onReset={video.prepareCamera} />}
            {submitError && <p role="alert" style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>{submitError}</p>}
            <p style={{ ...mono, fontSize: 11, color: MUTED, letterSpacing: '0.08em', textAlign: 'center', marginBottom: 24 }}>Your enquiry is sent securely. We’ll reply by email or phone.</p>
            <button type="submit" disabled={!canSubmit || isSubmitting} style={{ width: '100%', padding: 15, background: canSubmit && !isSubmitting ? ACCENT : 'rgba(41,121,255,0.2)', border: 'none', borderRadius: 6, color: canSubmit && !isSubmitting ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 600, cursor: canSubmit && !isSubmitting ? 'pointer' : 'not-allowed' }}>{isSubmitting ? 'Sending…' : 'Send Enquiry →'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
