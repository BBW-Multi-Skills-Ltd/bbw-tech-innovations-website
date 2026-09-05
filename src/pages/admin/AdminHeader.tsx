import { Link } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, Moon, Sun } from 'lucide-react'
import type { AdminIdentity } from '../../features/auth/types'
import BrandLogo from '../../components/ui/BrandLogo'

interface Props {
  identity: AdminIdentity
  onSignOut: () => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  dark: boolean
  onToggleTheme: () => void
  onOpenAccount: () => void
}

export default function AdminHeader({ identity, onSignOut, sidebarCollapsed, onToggleSidebar, dark, onToggleTheme, onOpenAccount }: Props) {
  const initials = identity.fullName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'BB'
  return (
    <header className="admin-cms-topbar">
      <button type="button" className="admin-cms-brand" onClick={onToggleSidebar} aria-expanded={!sidebarCollapsed} aria-label={sidebarCollapsed ? 'Open navigation' : 'Close navigation'}>
        <BrandLogo /><strong>Admin</strong><span>/ secure cms</span><Menu size={16} aria-hidden="true" />
      </button>
      <div className="admin-cms-actions">
        <button type="button" className="admin-theme-button" onClick={onToggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <details className="admin-profile-menu">
          <summary aria-label="Open account menu"><span className="admin-profile-avatar">{identity.avatarUrl ? <img src={identity.avatarUrl} alt="" /> : initials}</span><span className="admin-profile-copy"><strong>{identity.fullName}</strong><small>{identity.jobTitle || identity.role}</small></span><ChevronDown size={15} aria-hidden="true" /></summary>
          <div className="admin-profile-popover">
            <button type="button" onClick={onOpenAccount}>Account settings</button>
            <Link to="/">Return to site</Link>
            <button type="button" onClick={onSignOut}><LogOut size={15} /> Sign out</button>
          </div>
        </details>
      </div>
    </header>
  )
}
