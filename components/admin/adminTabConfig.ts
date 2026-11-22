export type AdminTab = 'home' | 'apps' | 'websites' | 'works' | 'marquee' | 'process' | 'technology' | 'business-arms' | 'privacy' | 'enquiries' | 'team' | 'account' | 'social' | 'company' | 'music'

export interface AdminNavItem {
  id: AdminTab
  label: string
  ownerOnly?: boolean
  enquiriesOnly?: boolean
}

export const ADMIN_NAVIGATION: { label?: string; items: AdminNavItem[] }[] = [
  { items: [{ id: 'home', label: 'Home' }] },
  { label: 'Content', items: [
    { id: 'apps', label: 'Product apps' },
    { id: 'websites', label: 'Product websites' },
    { id: 'works', label: 'Client work' },
  ] },
  { label: 'Marketplace', items: [
    { id: 'marquee', label: 'Scrolling strip' },
    { id: 'process', label: 'How we work' },
    { id: 'technology', label: 'Technologies' },
    { id: 'business-arms', label: 'Business arms' },
    { id: 'privacy', label: 'Privacy policy' },
    { id: 'music', label: 'Music' },
  ] },
  { items: [{ id: 'enquiries', label: 'Enquiries', enquiriesOnly: true }] },
  { label: 'Organisation', items: [{ id: 'team', label: 'Team', ownerOnly: true }] },
  { label: 'Settings', items: [
    { id: 'account', label: 'Account' },
    { id: 'company', label: 'Company details' },
    { id: 'social', label: 'Social links' },
  ] },
]
