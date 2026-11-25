import { cacheLife, cacheTag } from 'next/cache'
import { BUNDLED_INTAKE_OPTIONS, parseIntakeOptions, type IntakeOptions } from './options'

/**
 * BBWFlow's website intake. Server only: the key is read from server env vars
 * (never NEXT_PUBLIC_), never sent to the browser and never logged. Contract:
 * BBWFlow server/routes/website-intake.ts and scripts/verify-website-intake.ts.
 */
const TIME_LIMIT_MS = 8000

function config() {
  const url = process.env.BBWFLOW_API_URL?.trim().replace(/\/+$/, '')
  const key = process.env.BBWFLOW_INTAKE_KEY?.trim()
  return url && key ? { url, key } : null
}

/** Project types and budgets from BBWFlow, cached for about an hour; the bundled copy when it can't be reached. */
export async function getIntakeOptions(): Promise<IntakeOptions> {
  'use cache'
  cacheTag('bbwflow-options')
  cacheLife('hours')
  const settings = config()
  if (!settings) return BUNDLED_INTAKE_OPTIONS
  try {
    const response = await fetch(`${settings.url}/api/public/website-intake/options`, {
      headers: { Authorization: `Bearer ${settings.key}` },
      signal: AbortSignal.timeout(TIME_LIMIT_MS),
    })
    if (!response.ok) {
      console.error('BBWFlow intake options failed', { status: response.status })
      return BUNDLED_INTAKE_OPTIONS
    }
    return parseIntakeOptions(await response.json()) ?? BUNDLED_INTAKE_OPTIONS
  } catch (error) {
    console.error('BBWFlow intake options unreachable', { reason: error instanceof Error ? error.name : 'unknown' })
    return BUNDLED_INTAKE_OPTIONS
  }
}

export type IntakeSubmission = {
  name: string
  businessName: string | null
  email: string | null
  phone: string | null
  projectType: string
  budget: string
  message: string
  pageUrl: string | null
}

export type IntakeResult =
  | { kind: 'created'; briefUrl: string }
  | { kind: 'invalid'; fieldErrors: Record<string, string[]>; formErrors: string[] }
  | { kind: 'unavailable' }

/** Posts one submission. The same idempotencyKey on a retry returns the first result, never a second lead. */
export async function submitIntake(body: IntakeSubmission, idempotencyKey: string): Promise<IntakeResult> {
  const settings = config()
  if (!settings) return { kind: 'unavailable' }
  let response: Response
  try {
    response = await fetch(`${settings.url}/api/public/website-intake`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${settings.key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIME_LIMIT_MS),
      cache: 'no-store',
    })
  } catch (error) {
    console.error('BBWFlow intake unreachable', { reason: error instanceof Error ? error.name : 'unknown' })
    return { kind: 'unavailable' }
  }
  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null
  if ((response.status === 200 || response.status === 201) && typeof data?.briefUrl === 'string') {
    return { kind: 'created', briefUrl: data.briefUrl }
  }
  if (response.status === 400) {
    const details = (data?.details ?? {}) as { fieldErrors?: Record<string, string[]>; formErrors?: string[] }
    return { kind: 'invalid', fieldErrors: details.fieldErrors ?? {}, formErrors: details.formErrors ?? [] }
  }
  if (response.status === 401 || response.status === 503) console.error('BBWFlow intake is misconfigured', { status: response.status })
  else if (response.status === 409) console.error('BBWFlow intake: Idempotency-Key reused with a different body (website bug)', { status: 409 })
  else console.error('BBWFlow intake failed', { status: response.status })
  return { kind: 'unavailable' }
}
