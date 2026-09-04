import { adminClient, corsHeaders, notifyEnquiry, reply } from '../_shared/enquiries.ts'

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const { id } = await request.json().catch(() => ({}))
  if (request.method !== 'POST' || typeof id !== 'string') return reply({ error: 'Invalid request.' }, 400)
  const db = adminClient()
  const { data, error } = await db.from('enquiries').select('name, email, phone, kind').eq('id', id).maybeSingle()
  if (error || !data || data.kind !== 'video') return reply({ error: 'Enquiry not found.' }, 404)
  try { await notifyEnquiry({ name: data.name, email: data.email, phone: data.phone, video: true }) } catch { /* Enquiry is available in the private CMS. */ }
  return reply({ ok: true })
})
