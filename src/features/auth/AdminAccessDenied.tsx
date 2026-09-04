import { supabase } from '../../lib/supabase'

interface Props { email: string }

export default function AdminAccessDenied({ email }: Props) {
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <img src="/logos/bbwlogo.png" alt="BBW" className="admin-auth-logo" />
        <p className="eyebrow">Access restricted</p>
        <h1>Admin access has not been assigned.</h1>
        <p className="admin-auth-copy">{email || 'This account'} is signed in, but it has no BBW CMS role. Ask the Owner to send an invitation or assign access.</p>
        <button type="button" className="admin-auth-submit" onClick={() => void supabase?.auth.signOut()}>Sign out</button>
      </section>
    </main>
  )
}
