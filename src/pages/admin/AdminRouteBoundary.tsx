import AdminPanel from '../AdminPanel'

/**
 * Authentication will be enforced here when Supabase Auth is connected.
 * Keeping the boundary explicit avoids coupling CMS rendering to an auth SDK.
 */
export default function AdminRouteBoundary() {
  return <AdminPanel />
}
