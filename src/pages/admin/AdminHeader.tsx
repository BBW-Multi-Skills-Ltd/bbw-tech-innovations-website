import { Link } from 'react-router-dom'

export default function AdminHeader() {
  return (
    <header className="admin-cms-topbar">
      <div className="admin-cms-brand"><img src="/logos/bbwlogo.png" alt="" aria-hidden="true" /><strong>Admin</strong><span>/ cms</span></div>
      <div className="admin-cms-actions"><span className="admin-local-badge">Local CMS</span><Link to="/">← Return to site</Link></div>
    </header>
  )
}
