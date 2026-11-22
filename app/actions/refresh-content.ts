'use server'

import { createClient } from '@supabase/supabase-js'
import { updateTag } from 'next/cache'
import { CONTENT_TAG } from '@/lib/site-content'

/**
 * Called by the admin after each save so the public pages show the change at
 * once. Only a signed-in CMS user (checked with their own access token) can
 * trigger it.
 */
export async function refreshPublicContent(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key || !accessToken) return false
  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
  const { data: userData } = await db.auth.getUser(accessToken)
  if (!userData.user) return false
  const { data: identity } = await db.rpc('get_current_cms_identity').maybeSingle()
  if (!(identity as { role?: string } | null)?.role) return false
  updateTag(CONTENT_TAG)
  return true
}
