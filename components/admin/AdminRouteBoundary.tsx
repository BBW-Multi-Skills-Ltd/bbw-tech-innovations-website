'use client'

import AdminAccessDenied from '@/components/auth/AdminAccessDenied'
import AdminSetupRequired from '@/components/auth/AdminSetupRequired'
import AdminSignIn from '@/components/auth/AdminSignIn'
import useAdminAuth from '@/components/auth/useAdminAuth'
import { supabase } from '@/lib/supabase/browser'
import AdminPanel from '@/components/admin/AdminPanel'
import AccountSettings from '@/components/auth/AccountSettings'
import { usePathname } from 'next/navigation'

export default function AdminRouteBoundary() {
  const { state } = useAdminAuth()
  const pathname = usePathname()

  if (state.status === 'configuration-required') return <AdminSetupRequired />
  if (state.status === 'loading') return <div className="route-loader">Loading secure admin…</div>
  if (state.status === 'signed-out') return <AdminSignIn />
  if (state.status === 'unauthorized') return <AdminAccessDenied email={state.email} />
  if (state.status === 'authorized' && pathname === '/admin/account') return <AccountSettings identity={state.identity} />
  if (state.status === 'authorized') return <AdminPanel identity={state.identity} onSignOut={() => void supabase?.auth.signOut()} />
  return null
}
