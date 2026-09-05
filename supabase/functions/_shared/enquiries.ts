import { createClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

export const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: corsHeaders })

export function adminClient() {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  let key = serviceKey
  if (!key) {
    try {
      const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}') as Record<string, string>
      key = keys.default
    } catch { /* Older projects do not provide SUPABASE_SECRET_KEYS. */ }
  }
  if (!key) throw new Error('Supabase server credentials are unavailable.')
  return createClient(Deno.env.get('SUPABASE_URL') ?? '', key ?? '', { auth: { autoRefreshToken: false, persistSession: false } })
}

export const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''

export async function notifyEnquiry(input: { name: string; phone: string; email: string; message?: string; video: boolean }) {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) throw new Error('Email service is unavailable.')
  const subject = `New BBW Tech enquiry from ${input.name}`
  const body = input.video ? 'A video enquiry was submitted. Open BBW Tech Admin → Enquiries to view it securely.' : input.message ?? ''
  const html = `<div style="font-family:Arial,sans-serif;color:#171717"><h2>New website enquiry</h2><p><strong>Name:</strong> ${escape(input.name)}</p><p><strong>Email:</strong> ${escape(input.email)}</p><p><strong>Phone:</strong> ${escape(input.phone)}</p><hr><p>${escape(body)}</p></div>`
  const configured = await adminClient().from('site_settings').select('value').eq('setting_key', 'company_details').maybeSingle()
  const companyEmail = configured.data?.value && typeof configured.data.value === 'object' && typeof (configured.data.value as { email?: unknown }).email === 'string' ? (configured.data.value as { email: string }).email.trim() : ''
  const recipient = companyEmail || Deno.env.get('ENQUIRY_RECIPIENT') || 'bbwmultiskillsltd@gmail.com'
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'BBW Tech Website <enquiries@bbwtechinnovation.com>', to: [recipient], reply_to: input.email, subject, html }) })
  if (!response.ok) throw new Error('Email notification failed.')
}

function escape(value: string) { return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!) }
