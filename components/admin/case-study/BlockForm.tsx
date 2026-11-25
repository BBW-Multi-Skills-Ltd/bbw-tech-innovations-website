'use client'

import { useState } from 'react'
import CloudinaryMediaUpload from '@/components/admin/CloudinaryMediaUpload'
import { missingRequired, type Field } from '@/lib/case-studies/editor-fields'

export type Values = Record<string, unknown>

/**
 * One block's form, shaped by its fields (lib/case-studies/editor-fields.ts).
 * Every change is passed up at once, so the page beside it updates as you
 * type; Save writes it to Supabase.
 */
export function BlockForm({
  fields,
  values,
  onChange,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  fields: Field[]
  values: Values
  onChange: (values: Values) => void
  onSave: () => Promise<void> | void
  onCancel: () => void
  onDelete?: () => void
  saving: boolean
}) {
  const [missing, setMissing] = useState<string[]>([])
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const empty = missingRequired(fields, values)
    setMissing(empty)
    if (!empty.length) void onSave()
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <FieldList fields={fields} values={values} onChange={onChange} />
      {missing.length ? <p role="alert" className="text-[12px] text-[#ef4444]">Fill in: {missing.join(', ')}.</p> : null}
      <div className="sticky bottom-0 -mx-5 flex flex-wrap gap-2 border-t border-bbw-border bg-bbw-surface px-5 py-4">
        <button type="submit" className="btn-primary px-5! py-2.5! text-[13px]!" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button>
        {onDelete ? <button type="button" className="admin-secondary-button is-danger ml-auto" onClick={onDelete}>Delete block</button> : null}
      </div>
    </form>
  )
}

function FieldList({ fields, values, onChange }: { fields: Field[]; values: Values; onChange: (values: Values) => void }) {
  return (
    <>
      {fields.map(field => (
        <FieldInput key={field.name} field={field} value={values[field.name]} onChange={value => onChange({ ...values, [field.name]: value })} />
      ))}
    </>
  )
}

const asText = (value: unknown) => (typeof value === 'string' ? value : '')

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (value: unknown) => void }) {
  const help = field.help ? <small className="mt-1.5 block text-[11px] leading-[1.5] text-bbw-muted">{field.help}</small> : null
  const label = `${field.label}${'required' in field && field.required ? ' *' : ''}`

  if (field.kind === 'checkbox') {
    return (
      <div className="admin-project-field">
        <label className="admin-featured-toggle"><input type="checkbox" checked={value === true} onChange={event => onChange(event.target.checked)} /> {field.label}</label>
        {help}
      </div>
    )
  }

  if (field.kind === 'repeater') {
    const items = Array.isArray(value) ? (value as Values[]) : []
    const set = (next: Values[]) => onChange(next)
    const blank = () => Object.fromEntries(field.fields.map(item => [item.name, item.kind === 'lines' ? [] : '']))
    return (
      <fieldset className="admin-project-field rounded-md border border-bbw-border p-3">
        <legend className="px-1 font-mono text-[9px] tracking-[0.11em] text-bbw-muted uppercase">{field.label}</legend>
        {help}
        <ol className="mt-3 flex flex-col gap-3">
          {items.map((item, i) => (
            <li key={i} className="rounded-md border border-bbw-border bg-bbw-surface2/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] tracking-[0.1em] text-bbw-accent uppercase">{field.itemLabel} {i + 1}</span>
                <span className="flex gap-1">
                  <button type="button" className="admin-secondary-button px-2! py-1!" disabled={i === 0} aria-label={`Move ${field.itemLabel} ${i + 1} up`} onClick={() => { const next = [...items]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; set(next) }}>↑</button>
                  <button type="button" className="admin-secondary-button px-2! py-1!" disabled={i === items.length - 1} aria-label={`Move ${field.itemLabel} ${i + 1} down`} onClick={() => { const next = [...items]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; set(next) }}>↓</button>
                  <button type="button" className="admin-secondary-button is-danger px-2! py-1!" aria-label={`Remove ${field.itemLabel} ${i + 1}`} onClick={() => set(items.filter((_, j) => j !== i))}>Remove</button>
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <FieldList fields={field.fields} values={item} onChange={next => set(items.map((x, j) => (j === i ? next : x)))} />
              </div>
            </li>
          ))}
        </ol>
        <button type="button" className="admin-secondary-button mt-3" onClick={() => set([...items, blank()])}>+ Add {field.itemLabel}</button>
      </fieldset>
    )
  }

  if (field.kind === 'media') {
    const url = asText(value)
    return (
      <div className="admin-project-field">
        <span>{field.label}</span>
        <input inputMode="url" value={url} onChange={event => onChange(event.target.value)} placeholder="https://…" aria-label={field.label} />
        <CloudinaryMediaUpload assetType={field.media} accept={field.media === 'image' ? 'image/png,image/jpeg,image/webp' : 'video/mp4,video/webm'} value={url} onChange={onChange} />
        {field.media === 'image' && url && !/^\[/.test(url) ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded screenshot
          <img src={url} alt="" className="mt-2 max-h-40 w-auto rounded border border-bbw-border" />
        ) : null}
        {help}
      </div>
    )
  }

  if (field.kind === 'select') {
    return (
      <label className="admin-project-field">
        <span>{field.label}</span>
        <select value={asText(value) || field.options[0].value} onChange={event => onChange(event.target.value)}>
          {field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {help}
      </label>
    )
  }

  if (field.kind === 'lines') {
    const lines = Array.isArray(value) ? (value as string[]).join('\n') : asText(value)
    return (
      <label className="admin-project-field">
        <span>{field.label}</span>
        <textarea rows={4} value={lines} onChange={event => onChange(event.target.value.split('\n'))} onBlur={event => onChange(event.target.value.split('\n').map(line => line.trim()).filter(Boolean))} />
        {help}
      </label>
    )
  }

  return (
    <label className="admin-project-field">
      <span>{label}</span>
      {field.kind === 'textarea' ? (
        <textarea rows={4} value={asText(value)} onChange={event => onChange(event.target.value)} placeholder={field.placeholder} />
      ) : (
        <input type={field.kind === 'url' ? 'url' : 'text'} inputMode={field.kind === 'url' ? 'url' : undefined} value={asText(value)} onChange={event => onChange(event.target.value)} placeholder={field.placeholder} />
      )}
      {help}
    </label>
  )
}
