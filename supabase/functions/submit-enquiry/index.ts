import { adminClient, clean, corsHeaders, notifyEnquiry, reply } from '../_shared/enquiries.ts'

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return reply({ error: 'Method not allowed' }, 405)
  const body = await request.json().catch(() => null)
  const name = clean(body?.name, 100), email = clean(body?.email, 254), phone = clean(body?.phone, 40), message = clean(body?.message, 5000)
  if (body?.website || !name || !email.includes('@') || !phone) return reply({ error: 'Invalid enquiry.' }, 400)
  const db = adminClient()
  if (body?.kind === 'message') {
    if (!message) return reply({ error: 'Message is required.' }, 400)
    const { error } = await db.from('enquiries').insert({ kind: 'message', name, email, phone, message })
    if (error) return reply({ error: 'Could not save enquiry.' }, 500)
    try { await notifyEnquiry({ name, email, phone, message, video: false }) } catch { /* Enquiry remains safely stored for the CMS. */ }
    return reply({ ok: true })
  }
  if (body?.kind !== 'video' || !Number.isFinite(body?.videoSize) || body.videoSize <= 0 || body.videoSize > 104857600) return reply({ error: 'Video must be under 100 MB.' }, 400)
  const id = crypto.randomUUID(), path = `${new Date().toISOString().slice(0, 10)}/${id}.webm`
  const { error } = await db.from('enquiries').insert({ id, kind: 'video', name, email, phone, video_path: path })
  if (error) return reply({ error: 'Could not prepare video upload.' }, 500)
  const { data, error: uploadError } = await db.storage.from('enquiry-videos').createSignedUploadUrl(path)
  if (uploadError || !data) return reply({ error: 'Could not prepare secure upload.' }, 500)
  return reply({ id, path, token: data.token })
})
