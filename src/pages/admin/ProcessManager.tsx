import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { ProcessStep } from '../../content/process'

interface Props { steps: ProcessStep[]; setSteps: Dispatch<SetStateAction<ProcessStep[]>>; onSave: (steps: ProcessStep[]) => Promise<void>; onSaved: (message: string) => void }

export default function ProcessManager({ steps, setSteps, onSave, onSaved }: Props) {
  const update = <K extends keyof ProcessStep>(index: number, key: K, value: ProcessStep[K]) => setSteps(current => current.map((step, stepIndex) => stepIndex === index ? { ...step, [key]: value } : step))
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const cleaned = steps.map((step, index) => ({ ...step, num: String(index + 1).padStart(2, '0'), title: step.title.trim(), desc: step.desc.trim(), details: step.details.map(detail => detail.trim()).filter(Boolean), output: step.output.trim(), note: step.note?.trim() || undefined }))
    try { await onSave(cleaned); onSaved('Process steps saved to Supabase.') } catch { onSaved('Could not save process steps. Please try again.') }
  }
  return <form onSubmit={submit}>
    <div className="admin-section-heading"><p className="eyebrow">Marketplace</p><h2>How we work</h2><span>Edit the public delivery process. The order shown here is the public order.</span></div>
    <div className="admin-process-list">{steps.map((step, index) => <details className="admin-process-editor" key={`${step.num}-${index}`} open={index === 0}><summary><span>{step.num}</span><strong>{step.title || 'Untitled step'}</strong><small>{step.desc || 'Add a short explanation'}</small></summary><div className="admin-project-form-grid"><label className="admin-project-field"><span>Stage title</span><input required value={step.title} onChange={event => update(index, 'title', event.target.value)} /></label><label className="admin-project-field"><span>Short description</span><input required value={step.desc} onChange={event => update(index, 'desc', event.target.value)} /></label><label className="admin-project-field admin-project-field-full"><span>Details — one per line</span><textarea rows={7} value={step.details.join('\n')} onChange={event => update(index, 'details', event.target.value.split('\n'))} /></label><label className="admin-project-field admin-project-field-full"><span>Output</span><input required value={step.output} onChange={event => update(index, 'output', event.target.value)} /></label><label className="admin-project-field admin-project-field-full"><span>Optional note</span><textarea rows={2} value={step.note ?? ''} onChange={event => update(index, 'note', event.target.value)} /></label></div></details>)}</div>
    <div className="admin-inline-save"><button type="submit" className="btn-primary">Save process</button></div>
  </form>
}
