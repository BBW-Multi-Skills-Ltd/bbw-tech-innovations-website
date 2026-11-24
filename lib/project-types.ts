// What kind of thing a project is, and everything that follows from it: which
// work tabs it appears in, its card label, and the device frames its case
// study uses. Ported from the portfolio; the database check is in
// supabase/migrations/20261124120000_add_project_types.sql.
//
// PWAs count as mobile. A website that merely works well on phones is still
// just "website".

import type { Project } from '@/lib/data/projects'

export type ProjectType = 'website' | 'mobile' | 'pwa' | 'web_mobile' | 'web_pwa'

/** For the combined types: is the website the product too, or only its marketing site? */
export type WebRole = 'product' | 'marketing'

export const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'pwa', label: 'PWA' },
  { value: 'web_mobile', label: 'Website + mobile app' },
  { value: 'web_pwa', label: 'Website + PWA' },
]

export const WEB_ROLES: { value: WebRole; label: string }[] = [
  { value: 'product', label: 'Same product as the app (same flows on the web)' },
  { value: 'marketing', label: 'Marketing site for the app' },
]

export const isProjectType = (value: unknown): value is ProjectType => PROJECT_TYPES.some(type => type.value === value)

/** Website + mobile app, or website + PWA. */
export const isCombined = (type: string) => type === 'web_mobile' || type === 'web_pwa'

/** Shown in the Websites tab. */
export const hasWebsite = (type: string) => type === 'website' || isCombined(type)

/** Shown in the Mobile apps tab (PWAs included). */
export const hasApp = (type: string) => type === 'mobile' || type === 'pwa' || isCombined(type)

/** The app side is a PWA (not an installed store app). */
export const isPwa = (type: string) => type === 'pwa' || type === 'web_pwa'

export const typeLabel = (type: ProjectType) => PROJECT_TYPES.find(item => item.value === type)?.label ?? 'Website'

/**
 * BBW: a project's type. Projects saved by the old admin (on main) have no
 * project_type: read it from kind, or the badge for client work, as the
 * migration did.
 */
export function projectTypeOf(project: Pick<Project, 'projectType' | 'type' | 'badge'>): ProjectType {
  if (project.projectType && isProjectType(project.projectType)) return project.projectType
  return project.type === 'app' || project.badge === 'mobile-app' ? 'mobile' : 'website'
}

/**
 * BBW: what the live site (main) reads, kept in step on every save: kind
 * ('app' for anything with an app or PWA) and, for client work, the badge
 * that picks its card ('mobile-app' unless the project has a website).
 */
export function legacyFields(type: ProjectType) {
  return {
    kind: hasApp(type) ? ('app' as const) : ('website' as const),
    badge: hasWebsite(type) ? ('website' as const) : ('mobile-app' as const),
  }
}

export type Devices = {
  /** The cover's device: a phone, a laptop, or both together. */
  hero: 'phone' | 'desktop' | 'both'
  /** Feature journeys: phone or laptop frames, or a Phone / Desktop toggle. */
  journeys: 'phone' | 'desktop' | 'both'
}

/**
 * The frames a case study uses. Combined projects show both devices in the
 * cover; their journeys get the toggle only when the website is the same
 * product (otherwise the app's flows, on the phone).
 */
export function devicesFor(type: string, webRole: string | null | undefined): Devices {
  if (type === 'website') return { hero: 'desktop', journeys: 'desktop' }
  if (isCombined(type)) return { hero: 'both', journeys: webRole === 'product' ? 'both' : 'phone' }
  return { hero: 'phone', journeys: 'phone' }
}

/** devicesFor, for a project. */
export const projectDevices = (project: Pick<Project, 'projectType' | 'type' | 'badge' | 'webRole'>) =>
  devicesFor(projectTypeOf(project), project.webRole)
