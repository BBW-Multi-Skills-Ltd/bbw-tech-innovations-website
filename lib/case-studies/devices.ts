import type { Project } from '@/lib/data/projects'

/** Which device frames a project's case study uses: the cover, and the feature journeys. */
export type Devices = { hero: 'phone' | 'desktop' | 'both'; journeys: 'phone' | 'desktop' | 'both' }

/** App projects (and client work badged "Mobile App") use the phone; websites the laptop. */
export const isPhoneProject = (project: Pick<Project, 'type' | 'badge'>) =>
  project.type === 'app' || project.badge === 'mobile-app'

export function devicesFor(project: Pick<Project, 'type' | 'badge'>): Devices {
  return isPhoneProject(project) ? { hero: 'phone', journeys: 'phone' } : { hero: 'desktop', journeys: 'desktop' }
}
