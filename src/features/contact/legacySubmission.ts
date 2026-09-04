import type { ContactDetails, InquiryMode } from './types'

interface LegacySubmission extends ContactDetails {
  mode: InquiryMode
  message: string
  videoUrl: string | null
}

// Replaced by the backend enquiry service in the Supabase phase.
export function prepareEmailInquiry({ name, phone, email, mode, message, videoUrl }: LegacySubmission) {
  if (mode === 'video' && videoUrl) {
    const download = document.createElement('a')
    download.href = videoUrl
    download.download = `bbwtech-project-${name.replace(/\s+/g, '-')}.webm`
    download.click()
  }
  const body = mode === 'text'
    ? `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`
    : `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n[Video attached — see downloaded file]`
  window.location.href = `mailto:bbwmultiskillsltd@gmail.com?subject=New Project Enquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`
}
