import { ArrowUpRight, Building2, Mail, PanelsTopLeft, Smartphone } from 'lucide-react'
import type { AdminTab } from './adminTabConfig'
import type { AdminIdentity } from '../../features/auth/types'

interface Props {
  identity: AdminIdentity
  apps: number
  websites: number
  works: number
  onNavigate: (tab: AdminTab) => void
}

export default function AdminDashboardHome({ identity, apps, websites, works, onNavigate }: Props) {
  const date = new Intl.DateTimeFormat('en-NG', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  const cards: { label: string; value: number; tab: AdminTab; Icon: typeof Smartphone }[] = [
    { label: 'Product apps', value: apps, tab: 'apps', Icon: Smartphone },
    { label: 'Product websites', value: websites, tab: 'websites', Icon: PanelsTopLeft },
    { label: 'Client work', value: works, tab: 'works', Icon: Building2 },
  ]
  return <section className="admin-dashboard-home">
    <p className="eyebrow">Dashboard · {date}</p>
    <h1>Welcome back, {identity.fullName.split(' ')[0] || 'there'}.</h1>
    <p className="admin-dashboard-intro">Manage the BBW Tech marketplace, inbound enquiries, and your team from one organised workspace.</p>
    <div className="admin-dashboard-stats">
      {cards.map(({ label, value, tab, Icon }) => <button type="button" key={tab} onClick={() => onNavigate(tab)}>
        <Icon size={19} aria-hidden="true" /><span>{label}</span><strong>{value}</strong><ArrowUpRight size={17} aria-hidden="true" />
      </button>)}
    </div>
    <div className="admin-dashboard-actions">
      <article><div><p className="eyebrow">Marketplace</p><h2>Keep your public content current.</h2><span>Update product cards, business arms, the scrolling strip, process, technologies, and legal content.</span></div><button type="button" className="btn-primary" onClick={() => onNavigate('apps')}>Manage content</button></article>
      <article><div><p className="eyebrow">Inbox</p><h2>Review project enquiries.</h2><span>Read messages and securely view recorded video enquiries as they arrive.</span></div><button type="button" className="admin-secondary-button" onClick={() => onNavigate('enquiries')}><Mail size={15} /> Open enquiries</button></article>
    </div>
  </section>
}
