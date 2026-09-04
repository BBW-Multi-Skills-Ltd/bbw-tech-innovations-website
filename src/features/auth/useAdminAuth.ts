import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { cmsRoles, type AdminAuthState, type CmsRole } from './types'

const isCmsRole = (role: string): role is CmsRole => cmsRoles.includes(role as CmsRole)

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
    const [profileResult, roleResult] = await Promise.all([
      supabase.from('profiles').select('full_name, job_title').eq('user_id', user.id).maybeSingle(),
      supabase.from('cms_user_roles').select('role').eq('user_id', user.id).maybeSingle(),
    ])
    const role = roleResult.data?.role
    if (profileResult.error || !role || !isCmsRole(role)) {
      setState({ status: 'unauthorized', email: user.email ?? '' })
      return
    }
    setState({
      status: 'authorized',
      identity: {
        user,
        role,
        fullName: profileResult.data?.full_name || user.user_metadata.full_name || user.email || 'Team member',
        jobTitle: profileResult.data?.job_title || user.user_metadata.job_title || '',
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
