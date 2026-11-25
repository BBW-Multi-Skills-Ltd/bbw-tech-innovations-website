'use server'

import { headers } from 'next/headers'
import { getIntakeOptions, submitIntake } from '@/lib/bbwflow/intake'
import { optionLabel } from '@/lib/bbwflow/options'
import { allowEnquiry } from '@/lib/rate-limit'

/**
 * "Start a project": sends the enquiry to BBWFlow (a lead with its project
 * brief link). If BBWFlow fails, times out or isn't configured, the enquiry is
 * saved in Supabase enquiries and emailed as before (the submit-enquiry edge
 * function), so nothing is lost. The visitor sees an error only when both fail.
 */
export type StartProjectField = 'name' | 'businessName' | 'email' | 'whatsapp' | 'projectType' | 'budget' | 'message'

export type StartProjectInput = Record<StartProjectField, string> & {
  /** Spam trap: a hidden field people never fill in. */
  website: string
  /** One UUID per submission, reused on every retry of that same submission. */
  idempotencyKey: string
  pageUrl: string
}

export type StartProjectResult =
  | { status: 'sent'; briefUrl: string | null; emailed: boolean }
  | { status: 'invalid'; fieldErrors: Partial<Record<StartProjectField, string>>; contactMissing: boolean }
  | { status: 'limited' }
  | { status: 'failed' }

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** BBWFlow's field names → ours (its "phone" is our WhatsApp number). */
const FIELD_MAP: Record<string, StartProjectField> = { name: 'name', businessName: 'businessName', email: 'email', phone: 'whatsapp', projectType: 'projectType', budget: 'budget', message: 'message' }

async function visitorIp() {
  const list = await headers()
  return list.get('x-forwarded-for')?.split(',')[0]?.trim() || list.get('x-real-ip') || 'unknown'
}

/** The fallback: Supabase enquiries + the usual email, through the existing edge function. */
async function saveFallback(input: { name: string; email: string; phone: string; message: string }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return false
  try {
    const response = await fetch(`${url}/functions/v1/submit-enquiry`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'message', ...input, website: '' }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!response.ok) console.error('Fallback enquiry failed', { status: response.status })
    return response.ok
  } catch (error) {
    console.error('Fallback enquiry unreachable', { reason: error instanceof Error ? error.name : 'unknown' })
    return false
  }
}

export async function startProject(raw: StartProjectInput): Promise<StartProjectResult> {
  const input = {
    name: text(raw?.name, 120),
    businessName: text(raw?.businessName, 160),
    email: text(raw?.email, 320),
    whatsapp: text(raw?.whatsapp, 40),
    projectType: text(raw?.projectType, 80),
    budget: text(raw?.budget, 80),
    message: text(raw?.message, 5000),
    pageUrl: text(raw?.pageUrl, 500),
  }
  const idempotencyKey = text(raw?.idempotencyKey, 36)
  // Spam trap filled in, or a request the form can't make: quietly accept and drop it.
  if (raw?.website) return { status: 'sent', briefUrl: null, emailed: false }
  if (!UUID.test(idempotencyKey) || !input.name || !input.projectType || !input.budget || !input.message) return { status: 'failed' }
  if (!input.email && !input.whatsapp) return { status: 'invalid', fieldErrors: {}, contactMissing: true }

  if (!allowEnquiry(await visitorIp(), idempotencyKey)) return { status: 'limited' }

  const result = await submitIntake({
    name: input.name,
    businessName: input.businessName || null,
    email: input.email || null,
    phone: input.whatsapp || null,
    projectType: input.projectType,
    budget: input.budget,
    message: input.message,
    pageUrl: /^https?:\/\//i.test(input.pageUrl) ? input.pageUrl : null,
  }, idempotencyKey)

  if (result.kind === 'created') return { status: 'sent', briefUrl: result.briefUrl, emailed: Boolean(input.email) }

  if (result.kind === 'invalid') {
    const fieldErrors: Partial<Record<StartProjectField, string>> = {}
    for (const [field, messages] of Object.entries(result.fieldErrors)) {
      const ours = FIELD_MAP[field]
      if (ours && messages?.[0]) fieldErrors[ours] = messages[0]
    }
    // Project type or budget refused: our options are out of step with BBWFlow's, not
    // something the visitor can fix (and its message is technical). Same for errors
    // on fields the form doesn't show (page URL, Idempotency-Key). Log and fall back.
    const ourProblem = Boolean(fieldErrors.projectType || fieldErrors.budget) || !Object.keys(fieldErrors).length
    const contactMissing = !input.email && !input.whatsapp
    if (!ourProblem) return { status: 'invalid', fieldErrors, contactMissing }
    console.error('BBWFlow intake rejected fields the visitor cannot fix', { fields: Object.keys(result.fieldErrors), formErrors: result.formErrors.length })
  }

  // Fallback: everything the visitor gave, in the enquiry's message.
  const options = await getIntakeOptions()
  const message = [
    input.businessName ? `Business: ${input.businessName}` : null,
    `Project type: ${optionLabel(options.projectTypes, input.projectType)}`,
    `Budget: ${optionLabel(options.budgets, input.budget)}`,
    input.whatsapp ? `WhatsApp: ${input.whatsapp}` : null,
    input.pageUrl ? `Page: ${input.pageUrl}` : null,
    '',
    input.message,
  ].filter(line => line !== null).join('\n')
  const saved = await saveFallback({ name: input.name, email: input.email, phone: input.whatsapp, message })
  return saved ? { status: 'sent', briefUrl: null, emailed: false } : { status: 'failed' }
}
