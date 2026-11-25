import { useCallback, useEffect, useRef, useState } from 'react'
import { startProject, type StartProjectField } from '@/app/actions/start-project'
import ContactHeader from '@/components/contact/ContactHeader'
import ContactSuccess from '@/components/contact/ContactSuccess'
import { ProjectMessageField, SelectField, TextField } from '@/components/contact/StartProjectFields'
import type { IntakeOptions } from '@/lib/bbwflow/options'

interface ContactFormProps { open: boolean; onClose: () => void; options: IntakeOptions }

type Values = Record<StartProjectField, string>
type Errors = Partial<Record<StartProjectField, string>>
type Sent = { briefUrl: string | null; emailed: boolean }

const empty: Values = { name: '', businessName: '', email: '', whatsapp: '', projectType: '', budget: '', message: '' }
const CONTACT_MISSING = 'Add an email address or a WhatsApp number.'
const SEND_FAILED = 'We could not send your enquiry. Please try again.'
const LIMITED = 'Too many enquiries from this device. Please try again in a few minutes.'

/**
 * "Start a project": a short form that goes to BBWFlow (the server action
 * falls back to our enquiries inbox). One idempotency key per submission,
 * kept while the visitor retries the same answers and replaced as soon as
 * they change anything, so a retry never creates a second lead.
 */
export default function ContactForm({ open, onClose, options }: ContactFormProps) {
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [sent, setSent] = useState<Sent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trap, setTrap] = useState('')
  const submissionKey = useRef<string | null>(null)

  const handleClose = useCallback(() => {
    setValues(empty); setErrors({}); setFormError(''); setSent(null); submissionKey.current = null
    onClose()
  }, [onClose])

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

  const update = (field: StartProjectField) => (value: string) => {
    setValues(current => ({ ...current, [field]: value }))
    // Changed answers are a new submission.
    submissionKey.current = null
    setErrors(current => {
      if (!current[field] && !((field === 'email' || field === 'whatsapp') && current.email === CONTACT_MISSING)) return current
      const next = { ...current, [field]: undefined }
      if ((field === 'email' || field === 'whatsapp') && current.email === CONTACT_MISSING) { next.email = undefined; next.whatsapp = undefined }
      return next
    })
    setFormError('')
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    if (!values.email.trim() && !values.whatsapp.trim()) {
      setErrors(current => ({ ...current, email: CONTACT_MISSING, whatsapp: CONTACT_MISSING }))
      return
    }
    submissionKey.current ??= crypto.randomUUID()
    setIsSubmitting(true); setFormError('')
    try {
      const result = await startProject({ ...values, website: trap, idempotencyKey: submissionKey.current, pageUrl: window.location.href })
      if (result.status === 'sent') setSent({ briefUrl: result.briefUrl, emailed: result.emailed })
      else if (result.status === 'invalid') {
        setErrors(result.contactMissing ? { ...result.fieldErrors, email: CONTACT_MISSING, whatsapp: CONTACT_MISSING } : result.fieldErrors)
      } else setFormError(result.status === 'limited' ? LIMITED : SEND_FAILED)
    } catch {
      setFormError(SEND_FAILED)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="contact-title" style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'color-mix(in srgb, var(--bbw-bg) 96%, transparent)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(41,121,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(41,121,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <ContactHeader onClose={handleClose} />
        {sent ? <ContactSuccess briefUrl={sent.briefUrl} emailed={sent.emailed} /> : (
          <form onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <TextField name="name" label="Full Name" value={values.name} onChange={update('name')} error={errors.name} placeholder="Your full name" autoComplete="name" required minLength={2} maxLength={120} />
              <TextField name="businessName" label="Business Name (optional)" value={values.businessName} onChange={update('businessName')} error={errors.businessName} autoComplete="organization" maxLength={160} />
              <TextField name="email" label="Email Address" type="email" value={values.email} onChange={update('email')} error={errors.email} placeholder="your@email.com" autoComplete="email" maxLength={320} />
              <TextField name="whatsapp" label="WhatsApp Number" type="tel" value={values.whatsapp} onChange={update('whatsapp')} error={errors.whatsapp} placeholder="+234 800 000 0000" autoComplete="tel" maxLength={40} pattern="\+?[0-9][0-9 ()\-]{5,38}" />
              <p className="mt-1 font-mono text-[11px] tracking-[0.04em] text-bbw-muted">Give us an email address or a WhatsApp number (at least one).</p>
            </div>
            <div className="mt-8 mb-8 grid gap-6 min-[520px]:grid-cols-2">
              <SelectField name="projectType" label="Project Type" value={values.projectType} onChange={update('projectType')} options={options.projectTypes} error={errors.projectType} />
              <SelectField name="budget" label="Budget" value={values.budget} onChange={update('budget')} options={options.budgets} error={errors.budget} />
            </div>
            <ProjectMessageField value={values.message} onChange={update('message')} error={errors.message} />
            {/* Spam trap: hidden from people and screen readers; bots fill it in. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={event => setTrap(event.target.value)} /></label>
            </div>
            {formError && <p role="alert" className="mt-6 text-center text-[12px] text-[#ef4444]">{formError}</p>}
            <p className="mt-6 mb-6 text-center font-mono text-[11px] tracking-[0.08em] text-bbw-muted">Your enquiry is sent securely. We’ll reply by email or phone.</p>
            <button type="submit" disabled={isSubmitting} className="w-full cursor-pointer rounded-md border-0 bg-bbw-accent p-[15px] text-[15px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? 'Sending…' : 'Send Enquiry →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
