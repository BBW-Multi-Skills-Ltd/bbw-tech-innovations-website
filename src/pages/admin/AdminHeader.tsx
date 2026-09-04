import { Link } from 'react-router-dom'
import type { AdminIdentity } from '../../features/auth/types'

interface Props {
  identity: AdminIdentity
  onSignOut: () => void
}

export default function AdminHeader({ identity, onSignOut }: Props) {
  return (
    <header className="admin-cms-topbar">
      <div className="admin-cms-brand"><img src="/logos/bbwlogo.png" alt="" aria-hidden="true" /><strong>Admin</strong><span>/ secure cms</span></div>
      <div className="admin-cms-actions">
        <span className="admin-local-badge">{identity.role}</span>
        <span className="admin-user-name">{identity.fullName}</span>
        <Link to="/">Return to site</Link>
        <button type="button" className="admin-signout-button" onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  )
}
