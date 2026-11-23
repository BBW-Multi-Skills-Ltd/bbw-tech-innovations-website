import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { CompanyDetails } from '@/lib/data/siteContent'

interface Props { value: CompanyDetails; setValue: Dispatch<SetStateAction<CompanyDetails>>; onSave: (value: CompanyDetails) => Promise<void>; onSaved: (message: string) => void }

export default function CompanyDetailsManager({ value, setValue, onSave, onSaved }: Props) {
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try { await onSave({ email: value.email.trim(), location: value.location.trim(), whatsapp: value.whatsapp?.trim() || undefined }); onSaved('Company details saved to Supabase.') } catch { onSaved('Could not save company details. Please try again.') }
  }
  return <form className="admin-company-manager" onSubmit={submit}>
    <div className="admin-section-heading"><p className="eyebrow">Settings</p><h2>Company details</h2><span>One place for public contact details used across the website.</span></div>
    <label className="admin-project-field"><span>Company email</span><input type="email" required value={value.email} onChange={event => setValue(current => ({ ...current, email: event.target.value }))} /></label>
    <label className="admin-project-field"><span>Location</span><input required value={value.location} onChange={event => setValue(current => ({ ...current, location: event.target.value }))} /></label>
    <label className="admin-project-field"><span>WhatsApp number (optional)</span><input type="tel" inputMode="tel" value={value.whatsapp ?? ''} onChange={event => setValue(current => ({ ...current, whatsapp: event.target.value }))} placeholder="+234 …" /><small>International format. Shown on the homepage as a WhatsApp link only when filled in.</small></label>
    <p>New website enquiry notifications use this email after the accompanying Edge Function update is deployed.</p>
    <button className="btn-primary" type="submit">Save company details</button>
  </form>
}
