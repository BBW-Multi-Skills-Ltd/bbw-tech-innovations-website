import { BriefcaseBusiness, Building2, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Gauge, Layers3, ListTree, Mail, Music2, PanelsTopLeft, Settings2, ShieldCheck, Smartphone, Users, Waypoints } from 'lucide-react'
import { ADMIN_NAVIGATION, type AdminNavItem, type AdminTab } from './adminTabConfig'
import type { CmsRole } from '../../features/auth/types'

const icons: Record<AdminTab, typeof Gauge> = {
  home: Gauge, apps: Smartphone, websites: PanelsTopLeft, works: BriefcaseBusiness,
  marquee: Waypoints, process: ListTree, technology: Layers3, 'business-arms': Building2,
  privacy: ShieldCheck, enquiries: Mail, team: Users, account: Settings2, social: CircleHelp,
  company: ClipboardList, music: Music2,
}

function canSee(item: AdminNavItem, role: CmsRole) {
  return (!item.ownerOnly || role === 'owner') && (!item.enquiriesOnly || role !== 'viewer')
}

interface Props {
  active: AdminTab
  collapsed: boolean
  role: CmsRole
  onChange: (tab: AdminTab) => void
  onToggle: () => void
}

export default function AdminSidebar({ active, collapsed, role, onChange, onToggle }: Props) {
  return (
    <aside className={`admin-sidebar${collapsed ? ' is-collapsed' : ''}`} aria-label="Admin navigation">
      <div className="admin-sidebar-scroll">
        {ADMIN_NAVIGATION.map((group, groupIndex) => {
          const items = group.items.filter(item => canSee(item, role))
          if (!items.length) return null
          return <section className="admin-sidebar-group" key={group.label ?? groupIndex}>
            {group.label && <p>{group.label}</p>}
            {items.map(item => {
              const Icon = icons[item.id]
              return <button type="button" key={item.id} className={active === item.id ? 'is-active' : ''} onClick={() => onChange(item.id)} title={collapsed ? item.label : undefined}>
                <Icon size={17} aria-hidden="true" /><span>{item.label}</span>
              </button>
            })}
          </section>
        })}
      </div>
      <button type="button" className="admin-sidebar-collapse" onClick={onToggle} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
        {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span>Collapse sidebar</span></>}
      </button>
    </aside>
  )
}
