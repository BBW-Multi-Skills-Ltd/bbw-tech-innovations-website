import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const allowedRoles = ['admin', 'editor', 'viewer']

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const url = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const authHeader = request.headers.get('Authorization')
  if (!url || !anonKey || !serviceKey || !authHeader) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const caller = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
  const { data: userData } = await caller.auth.getUser()
  const { data: identity } = await caller.rpc('get_current_cms_identity').maybeSingle()
  if (!userData.user || identity?.role !== 'owner') return new Response('Forbidden', { status: 403, headers: corsHeaders })

  const { email, fullName, jobTitle, role } = await request.json()
  if (typeof email !== 'string' || typeof fullName !== 'string' || typeof jobTitle !== 'string' || !allowedRoles.includes(role)) {
    return new Response('Invalid invitation details', { status: 400, headers: corsHeaders })
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email.trim(), {
    data: { full_name: fullName.trim(), job_title: jobTitle.trim() },
  })
  if (error || !data.user) return new Response(error?.message || 'Could not send invitation', { status: 400, headers: corsHeaders })

  await admin.from('profiles').upsert({ user_id: data.user.id, full_name: fullName.trim(), job_title: jobTitle.trim() })
  const { error: roleError } = await admin.from('cms_user_roles').upsert({ user_id: data.user.id, role })
  if (roleError) return new Response('Invitation was created but role setup failed.', { status: 500, headers: corsHeaders })
  return Response.json({ ok: true }, { headers: corsHeaders })
})
