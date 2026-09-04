export type AdminTab = 'apps' | 'websites' | 'works' | 'business-arms' | 'marquee' | 'music' | 'team'

export const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: 'apps', label: 'Product Apps' },
  { id: 'websites', label: 'Product Websites' },
  { id: 'works', label: 'Client Works' },
  { id: 'business-arms', label: 'Business Arms' },
  { id: 'marquee', label: 'Scrolling Strip' },
  { id: 'music', label: 'Music' },
  { id: 'team', label: 'Team' },
]
