import type { ReactNode } from 'react'
import type { IntakeOption } from '@/lib/bbwflow/options'

/** The "Start a project" form's fields, in the contact form's look (labels in mono caps, underlined inputs). */
const labelClass = 'mb-0.5 block font-mono text-[10px] tracking-[0.15em] text-bbw-muted uppercase'
const inputClass = 'w-full border-0 border-b bg-transparent py-3.5 font-sans text-[15px] text-bbw-fg outline-none transition-colors focus:border-bbw-accent'
const lineClass = (error?: string) => (error ? 'border-[#ef4444]' : 'border-bbw-border-hi')

export function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="mt-1.5 text-[12px] text-[#ef4444]">{message}</p> : null
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}

type InputProps = {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
}

export function TextField({ name, label, value, onChange, error, type = 'text', ...input }: InputProps) {
  const errorId = `${name}-error`
  return (
    <Field label={label}>
      <input
        {...input}
        name={name}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${lineClass(error)}`}
      />
      <FieldError id={errorId} message={error} />
    </Field>
  )
}

export function SelectField({ name, label, value, onChange, options, error }: { name: string; label: string; value: string; onChange: (value: string) => void; options: IntakeOption[]; error?: string }) {
  const errorId = `${name}-error`
  return (
    <Field label={label}>
      <select
        name={name}
        required
        value={value}
        onChange={event => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${lineClass(error)} cursor-pointer ${value ? '' : 'text-bbw-muted'}`}
      >
        <option value="" disabled className="bg-bbw-surface text-bbw-muted">Choose one</option>
        {options.map(option => <option key={option.value} value={option.value} className="bg-bbw-surface text-bbw-fg">{option.label}</option>)}
      </select>
      <FieldError id={errorId} message={error} />
    </Field>
  )
}

export function ProjectMessageField({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
  const errorId = 'message-error'
  return (
    <label className="block">
      <span className={`${labelClass} mb-2`}>Tell us about your project</span>
      <textarea
        name="message"
        required
        minLength={10}
        maxLength={5000}
        rows={5}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Tell us about your business, the problem you're solving, and what you need built…"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full resize-y rounded-md border bg-bbw-surface p-3.5 font-sans text-sm leading-[1.6] text-bbw-fg outline-none transition-colors focus:border-bbw-accent ${error ? 'border-[#ef4444]' : 'border-bbw-border-hi'}`}
      />
      <FieldError id={errorId} message={error} />
    </label>
  )
}
