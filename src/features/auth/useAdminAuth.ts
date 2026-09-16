import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { cmsRoles, type AdminAuthState, type CmsRole } from './types'

const isCmsRole = (role: string): role is CmsRole => cmsRoles.includes(role as CmsRole)
type CmsIdentityResult = { role: string; full_name: string; job_title: string }
type ProfileResult = { full_name: string; job_title: string; avatar_url: string | null }

export default function useAdminAuth() {
  const initialState: AdminAuthState = isSupabaseConfigured ? { status: 'loading' } : { status: 'configuration-required' }
  const [state, setState] = useState<AdminAuthState>(initialState)
  const stateRef = useRef<AdminAuthState>(initialState)

  const updateState = useCallback((nextState: AdminAuthState) => {
    stateRef.current = nextState
    setState(nextState)
  }, [])

  const refresh = useCallback(async (showLoader = stateRef.current.status === 'loading') => {
    if (!supabase) return
    if (showLoader) updateState({ status: 'loading' })
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData.user
    if (userError || !user) return updateState({ status: 'signed-out' })
    const { data: identityResult, error: identityError } = await supabase
      .rpc('get_current_cms_identity')
      .maybeSingle()
    const identity = identityResult as CmsIdentityResult | null
    const role = identity?.role
    if (identityError || !role || !isCmsRole(role)) {
      updateState({ status: 'unauthorized', email: user.email ?? '' })
      return
    }
    const { data: profileResult } = await supabase.from('profiles').select('full_name, job_title, avatar_url').eq('user_id', user.id).maybeSingle()
    const profile = profileResult as ProfileResult | null
    updateState({
      status: 'authorized',
      identity: {
        user,
        role,
        fullName: profile?.full_name || identity?.full_name || user.user_metadata.full_name || user.email || 'Team member',
        jobTitle: profile?.job_title || identity?.job_title || user.user_metadata.job_title || '',
        avatarUrl: profile?.avatar_url || undefined,
      },
    })
  }, [updateState])

  useEffect(() => {
    if (!supabase) return
    const initialRefresh = window.setTimeout(() => void refresh(true), 0)
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        updateState({ status: 'signed-out' })
        return
      }
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') void refresh(false)
    })
    return () => {
      window.clearTimeout(initialRefresh)
      listener.subscription.unsubscribe()
    }
  }, [refresh, updateState])

  return { state, refresh }
}
