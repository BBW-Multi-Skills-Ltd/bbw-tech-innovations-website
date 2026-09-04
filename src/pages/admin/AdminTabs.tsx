import { ADMIN_TABS } from './adminTabConfig'
import type { AdminTab } from './adminTabConfig'

export default function AdminTabs({ active, onChange, isOwner, canManageEnquiries }: { active: AdminTab; onChange: (tab: AdminTab) => void; isOwner: boolean; canManageEnquiries: boolean }) {
  return (
    <nav className="admin-tabs" aria-label="Content sections">
      {ADMIN_TABS.filter(tab => (tab.id !== 'team' || isOwner) && (tab.id !== 'enquiries' || canManageEnquiries)).map(tab => <button type="button" key={tab.id} className={active === tab.id ? 'is-active' : ''} onClick={() => onChange(tab.id)}>{tab.label}</button>)}
    </nav>
  )
}
