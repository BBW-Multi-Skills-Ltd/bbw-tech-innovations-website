import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { BusinessArm, BusinessArmStatus } from '../../data/company'
import { BUSINESS_ARM_STATUS_COLORS, BUSINESS_ARM_STATUS_LABELS } from '../../data/company'
import { saveBusinessArms } from '../../data/store'
import { externalUrl } from '../../utils/urls'

const statuses: BusinessArmStatus[] = ['active', 'in-development', 'coming-soon']

export default function BusinessArmsManager({ arms, setArms, onSaved }: { arms: BusinessArm[]; setArms: Dispatch<SetStateAction<BusinessArm[]>>; onSaved: (message: string) => void }) {
  const update = <K extends keyof BusinessArm>(id: string, field: K, value: BusinessArm[K]) => setArms(current => current.map(arm => arm.id === id ? { ...arm, [field]: value } : arm))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const cleaned = arms.map(arm => ({ ...arm, name: arm.name.trim(), role: arm.role.trim(), websiteUrl: arm.websiteUrl?.trim() || undefined }))
    saveBusinessArms(cleaned); setArms(cleaned); onSaved('Business arms saved.')
  }
  return (
    <form onSubmit={submit}>
      <div className="admin-section-heading"><p className="eyebrow">About section</p><h2>Business arms</h2><span>Edit each company’s public name, description, status, and optional website link.</span></div>
      <div className="admin-arm-list">
        {arms.map(arm => {
          const color = BUSINESS_ARM_STATUS_COLORS[arm.status]
          return (
            <fieldset key={arm.id} className="admin-arm-editor">
              <legend><span className="business-arm-dot" style={{ background: color }} />{arm.name || 'Untitled business arm'}</legend>
              <div className="admin-form-grid">
                <label><span>Company name</span><input required value={arm.name} onChange={event => update(arm.id, 'name', event.target.value)} /></label>
                <label><span>Description</span><input required value={arm.role} onChange={event => update(arm.id, 'role', event.target.value)} /></label>
                <label><span>Status</span><select value={arm.status} onChange={event => update(arm.id, 'status', event.target.value as BusinessArmStatus)}>{statuses.map(status => <option key={status} value={status}>{BUSINESS_ARM_STATUS_LABELS[status]}</option>)}</select></label>
                <label><span>Website URL <small>Optional</small></span><input inputMode="url" value={arm.websiteUrl ?? ''} onChange={event => update(arm.id, 'websiteUrl', event.target.value)} /></label>
              </div>
              <div className="admin-arm-preview">
                <span className="business-arm-status" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>{BUSINESS_ARM_STATUS_LABELS[arm.status]}</span>
                {arm.websiteUrl?.trim() && <a href={externalUrl(arm.websiteUrl.trim())} target="_blank" rel="noopener noreferrer">Visit website ↗</a>}
              </div>
            </fieldset>
          )
        })}
      </div>
      <div className="admin-inline-save"><button type="submit" className="btn-primary">Save business arms</button></div>
    </form>
  )
}
