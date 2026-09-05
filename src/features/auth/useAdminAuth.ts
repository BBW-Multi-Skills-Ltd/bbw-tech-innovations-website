import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { cmsRoles, type AdminAuthState, type CmsRole } from './types'

const isCmsRole = (role: string): role is CmsRole => cmsRoles.includes(role as CmsRole)
type CmsIdentityResult = { role: string; full_name: string; job_title: string }
type ProfileResult = { full_name: string; job_title: string; avatar_url: string | null }

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
    const { data: profileResult } = await supabase.from('profiles').select('full_name, job_title, avatar_url').eq('user_id', user.id).maybeSingle()
    const profile = profileResult as ProfileResult | null
    setState({
      status: 'authorized',
      identity: {
        user,
        role,
        fullName: profile?.full_name || identity?.full_name || user.user_metadata.full_name || user.email || 'Team member',
        jobTitle: profile?.job_title || identity?.job_title || user.user_metadata.job_title || '',
        avatarUrl: profile?.avatar_url || undefined,
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
