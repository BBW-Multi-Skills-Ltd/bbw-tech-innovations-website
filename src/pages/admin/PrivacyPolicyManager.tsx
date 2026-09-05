import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { PrivacyPolicyContent } from '../../data/siteContent'

interface Props { value: PrivacyPolicyContent; setValue: Dispatch<SetStateAction<PrivacyPolicyContent>>; onSave: (value: PrivacyPolicyContent) => Promise<void>; onSaved: (message: string) => void }

export default function PrivacyPolicyManager({ value, setValue, onSave, onSaved }: Props) {
  const updateSection = (index: number, field: 'heading' | 'body', value: string) => setValue(current => ({ ...current, sections: current.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, [field]: value } : section) }))
  const move = (index: number, direction: -1 | 1) => setValue(current => {
    const target = index + direction
    if (target < 0 || target >= current.sections.length) return current
    const sections = [...current.sections]; [sections[index], sections[target]] = [sections[target], sections[index]]
    return { ...current, sections }
  })
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const cleaned = { ...value, introduction: value.introduction.trim(), lastUpdated: value.lastUpdated.trim(), sections: value.sections.map(section => ({ heading: section.heading.trim(), body: section.body.trim() })).filter(section => section.heading && section.body) }
    try { await onSave(cleaned); onSaved('Privacy policy saved to Supabase.') } catch { onSaved('Could not save privacy policy. Please try again.') }
  }
  return <form onSubmit={submit}>
    <div className="admin-section-heading"><p className="eyebrow">Legal</p><h2>Privacy policy</h2><span>Edit the public policy without changing code. Have formal legal copy reviewed before relying on it for regulated use.</span></div>
    <div className="admin-project-form admin-privacy-form"><label className="admin-project-field"><span>Policy introduction</span><textarea rows={4} required value={value.introduction} onChange={event => setValue(current => ({ ...current, introduction: event.target.value }))} /></label><label className="admin-project-field"><span>Last updated</span><input required value={value.lastUpdated} onChange={event => setValue(current => ({ ...current, lastUpdated: event.target.value }))} /></label></div>
    <div className="admin-privacy-sections">{value.sections.map((section, index) => <article key={`${section.heading}-${index}`}><div className="admin-privacy-section-toolbar"><span>{String(index + 1).padStart(2, '0')}</span><div><button type="button" disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" disabled={index === value.sections.length - 1} onClick={() => move(index, 1)}>↓</button><button type="button" className="is-danger" onClick={() => setValue(current => ({ ...current, sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index) }))}>Remove</button></div></div><label className="admin-project-field"><span>Section heading</span><input required value={section.heading} onChange={event => updateSection(index, 'heading', event.target.value)} /></label><label className="admin-project-field"><span>Section copy</span><textarea rows={4} required value={section.body} onChange={event => updateSection(index, 'body', event.target.value)} /></label></article>)}</div>
    <div className="admin-inline-save"><button type="button" className="admin-secondary-button" onClick={() => setValue(current => ({ ...current, sections: [...current.sections, { heading: 'New section', body: '' }] }))}>+ Add section</button><button className="btn-primary" type="submit">Save privacy policy</button></div>
  </form>
}
