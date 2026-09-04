import { productApps, productWebsites, clientWorks } from './projects'
import type { Project } from './projects'
import { defaultBusinessArms } from './company'
import type { BusinessArm } from './company'

const KEYS = {
  productApps:    'bbw_product_apps',
  productWebsites:'bbw_product_websites',
  clientWorks:    'bbw_client_works',
  musicUrl:       'bbw_music_url',
  musicEnabled:   'bbw_music_enabled',
  businessArms:   'bbw_business_arms',
  marqueeItems:   'bbw_marquee_items',
}

const DEFAULT_MARQUEE_ITEMS = [
  'Technology', 'Design', 'Innovation', 'Mobile Apps', 'SaaS Platforms',
  'AI & Automation', 'Business Systems', 'Web Applications', 'React Native', 'Full-Stack',
]

const EVENT = 'bbw-store-change'

function broadcast() {
  window.dispatchEvent(new CustomEvent(EVENT))
}

// ─── Readers ──────────────────────────────────────────────────────────────────
export function getProductApps(): Project[] {
  try {
    const s = localStorage.getItem(KEYS.productApps)
    return s ? JSON.parse(s) : productApps
  } catch { return productApps }
}

export function getProductWebsites(): Project[] {
  try {
    const s = localStorage.getItem(KEYS.productWebsites)
    return s ? JSON.parse(s) : productWebsites
  } catch { return productWebsites }
}

export function getClientWorks(): Project[] {
  try {
    const s = localStorage.getItem(KEYS.clientWorks)
    return s ? JSON.parse(s) : clientWorks
  } catch { return clientWorks }
}

export function getMusicUrl(): string {
  return localStorage.getItem(KEYS.musicUrl) ?? ''
}

export function getMusicEnabled(): boolean {
  const v = localStorage.getItem(KEYS.musicEnabled)
  return v === null ? true : v === 'true'
}

export function getBusinessArms(): BusinessArm[] {
  try {
    const stored = localStorage.getItem(KEYS.businessArms)
    return stored ? JSON.parse(stored) : defaultBusinessArms
  } catch { return defaultBusinessArms }
}

export function getMarqueeItems(): string[] {
  try {
    const stored = localStorage.getItem(KEYS.marqueeItems)
    return stored ? JSON.parse(stored) : DEFAULT_MARQUEE_ITEMS
  } catch { return DEFAULT_MARQUEE_ITEMS }
}

// ─── Writers ──────────────────────────────────────────────────────────────────
export function saveProductApps(data: Project[]) {
  localStorage.setItem(KEYS.productApps, JSON.stringify(data))
  broadcast()
}

export function saveProductWebsites(data: Project[]) {
  localStorage.setItem(KEYS.productWebsites, JSON.stringify(data))
  broadcast()
}

export function saveClientWorks(data: Project[]) {
  localStorage.setItem(KEYS.clientWorks, JSON.stringify(data))
  broadcast()
}

export function saveMusicUrl(url: string) {
  localStorage.setItem(KEYS.musicUrl, url)
  broadcast()
}

export function saveMusicEnabled(enabled: boolean) {
  localStorage.setItem(KEYS.musicEnabled, String(enabled))
  broadcast()
}

export function saveBusinessArms(data: BusinessArm[]) {
  localStorage.setItem(KEYS.businessArms, JSON.stringify(data))
  broadcast()
}

export function saveMarqueeItems(data: string[]) {
  localStorage.setItem(KEYS.marqueeItems, JSON.stringify(data))
  broadcast()
}

// ─── Helpers for Admin CRUD ───────────────────────────────────────────────────
export function upsertProductApp(project: Project) {
  const list = [...getProductApps()]
  const idx = list.findIndex(p => p.id === project.id)
  if (idx >= 0) list[idx] = project
  else list.unshift(project)
  saveProductApps(list)
}

export function deleteProductApp(id: string) {
  saveProductApps(getProductApps().filter(p => p.id !== id))
}

export function upsertProductWebsite(project: Project) {
  const list = [...getProductWebsites()]
  const idx = list.findIndex(p => p.id === project.id)
  if (idx >= 0) list[idx] = project
  else list.unshift(project)
  saveProductWebsites(list)
}

export function deleteProductWebsite(id: string) {
  saveProductWebsites(getProductWebsites().filter(p => p.id !== id))
}

export function upsertClientWork(project: Project) {
  const list = [...getClientWorks()]
  const idx = list.findIndex(p => p.id === project.id)
  if (idx >= 0) list[idx] = project
  else list.unshift(project)
  saveClientWorks(list)
}

export function deleteClientWork(id: string) {
  saveClientWorks(getClientWorks().filter(p => p.id !== id))
}

export const STORE_EVENT = EVENT
