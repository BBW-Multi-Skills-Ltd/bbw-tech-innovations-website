import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { cmsRoles, type AdminAuthState, type CmsRole } from './types'

const isCmsRole = (role: string): role is CmsRole => cmsRoles.includes(role as CmsRole)
type CmsIdentityResult = { role: string; full_name: string; job_title: string }

export default function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>(
    isSupabaseConfigured ? { status: 'loading' } : { status: 'configuration-required' },
  )

  const refresh = useCallback(async () => {
    if (!supabase) return
    setState({ status: 'loading' })
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData.user
    if (userError || !user) return setState({ status: 'signed-out' })
    const { data: identityResult, error: identityError } = await supabase
      .rpc('get_current_cms_identity')
      .maybeSingle()
    const identity = identityResult as CmsIdentityResult | null
    const role = identity?.role
    if (identityError || !role || !isCmsRole(role)) {
      setState({ status: 'unauthorized', email: user.email ?? '' })
      return
    }
    setState({
      status: 'authorized',
      identity: {
        user,
        role,
        fullName: identity?.full_name || user.user_metadata.full_name || user.email || 'Team member',
        jobTitle: identity?.job_title || user.user_metadata.job_title || '',
      },
    })
  }, [])

  useEffect(() => {
    if (!supabase) return
    const initialRefresh = window.setTimeout(() => void refresh(), 0)
    const { data: listener } = supabase.auth.onAuthStateChange(() => void refresh())
    return () => {
      window.clearTimeout(initialRefresh)
      listener.subscription.unsubscribe()
    }
  }, [refresh])

  return { state, refresh }
}
