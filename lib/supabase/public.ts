import { createClient } from '@supabase/supabase-js'

/** Public database reads give up after this long (the download included). */
const TIMEOUT_MS = 8000

const fetchWithLimit: typeof fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  if (!url.includes('/rest/v1/')) return fetch(input, init)
  const limit = AbortSignal.timeout(TIMEOUT_MS)
  return fetch(input, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, limit]) : limit })
}

/**
 * Read-only server client for public pages: the publishable key, no session.
 * Row Level Security only lets it read published content. Null when the env
 * vars are missing; callers then fall back to the bundled content.
 */
export function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { retry: false },
    global: { fetch: fetchWithLimit },
  })
}
