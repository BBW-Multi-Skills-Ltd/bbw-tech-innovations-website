import AdminAccessDenied from '../../features/auth/AdminAccessDenied'
import AdminSetupRequired from '../../features/auth/AdminSetupRequired'
import AdminSignIn from '../../features/auth/AdminSignIn'
import useAdminAuth from '../../features/auth/useAdminAuth'
import { supabase } from '../../lib/supabase'
import AdminPanel from '../AdminPanel'

export default function AdminRouteBoundary() {
  const { state } = useAdminAuth()

  if (state.status === 'configuration-required') return <AdminSetupRequired />
  if (state.status === 'loading') return <div className="route-loader">Loading secure admin…</div>
  if (state.status === 'signed-out') return <AdminSignIn />
  if (state.status === 'unauthorized') return <AdminAccessDenied email={state.email} />
  if (state.status === 'authorized') return <AdminPanel identity={state.identity} onSignOut={() => void supabase?.auth.signOut()} />
  return null
}
