import { createClient } from '@supabase/supabase-js'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(projectUrl && publishableKey)

/** Browser client with the signed-in session (admin, contact form). Null on the server. */
export const supabase = isSupabaseConfigured && projectUrl && publishableKey && typeof window !== 'undefined'
  ? createClient(projectUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      experimental: { passkey: true },
    },
  })
  : null
