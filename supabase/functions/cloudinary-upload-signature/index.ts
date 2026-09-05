import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const allowedRoles = ['owner', 'admin', 'editor']

async function sha1(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-1', bytes)
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders })
  const url = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const authHeader = request.headers.get('Authorization')
  const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
  const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
  const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
  if (!url || !anonKey || !authHeader || !apiKey || !apiSecret || !cloudName) return Response.json({ error: 'Upload service is not configured.' }, { status: 500, headers: corsHeaders })

  const caller = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
  const [{ data: user }, { data: identity }] = await Promise.all([caller.auth.getUser(), caller.rpc('get_current_cms_identity').maybeSingle()])
  if (!user.user || !allowedRoles.includes(identity?.role)) return Response.json({ error: 'You do not have permission to upload demo videos.' }, { status: 403, headers: corsHeaders })

  const body = await request.json().catch(() => ({}))
  const assetType = body?.assetType === 'image' || body?.assetType === 'video' || body?.assetType === 'audio' ? body.assetType : null
  if (!assetType) return Response.json({ error: 'Invalid upload type.' }, { status: 400, headers: corsHeaders })
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = assetType === 'image' ? 'bbw-tech/card-images' : assetType === 'audio' ? 'bbw-tech/ambient-audio' : 'bbw-tech/demos'
  const signature = await sha1(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
  const resourceType = assetType === 'image' ? 'image' : 'video'
  return Response.json({ cloudName, apiKey, timestamp, folder, signature, assetType, resourceType }, { headers: corsHeaders })
})
