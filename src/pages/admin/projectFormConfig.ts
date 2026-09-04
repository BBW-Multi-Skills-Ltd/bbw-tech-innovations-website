import type { PlatformAvailability, Project, ProjectStatus, ProjectType, ReviewSource } from '../../data/projects'

export const PROJECT_STATUSES: ProjectStatus[] = ['in-dev', 'coming-soon', 'testing', 'beta', 'live', 'completed']
export const REVIEW_SOURCES: ReviewSource[] = ['email', 'whatsapp', 'other']
export const PLATFORM_OPTIONS: { value: PlatformAvailability; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'coming-soon', label: 'Coming Soon' },
  { value: 'not-supported', label: 'Not Supported' },
]

export type ProjectUpdater = <Key extends keyof Project>(field: Key, value: Project[Key]) => void

export function platformAvailability(project: Project, platform: 'android' | 'ios'): PlatformAvailability {
  const explicit = platform === 'android' ? project.androidAvailability : project.iosAvailability
  if (explicit) return explicit
  return project.platform?.toLowerCase().includes(platform) ? 'available' : 'not-supported'
}

export function createEmptyProject(type: ProjectType, isWork: boolean): Project {
  return {
    id: `project-${Date.now()}`,
    type,
    name: '', tagline: '', shortDesc: '', about: '', category: '', status: 'in-dev',
    platform: type === 'app' ? 'Android & iOS' : undefined,
    androidAvailability: type === 'app' ? 'available' : undefined,
    iosAvailability: type === 'app' ? 'available' : undefined,
    siteUrl: type === 'website' ? '' : undefined,
    accentColor: '#2979FF', mockBg: '#0A0F1E', isOwn: !isWork,
    screens: [
      { label: 'Main', colorA: '#2979FF', colorB: '#1E3A8A', colorC: '#1D4ED8' },
      { label: 'Detail', colorA: '#1D4ED8', colorB: '#1E40AF', colorC: '#2563EB' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'UI/UX Design, Wireframes, Prototype', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React / React Native, UI Implementation', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'API, Database, Authentication', icon: '⊟' },
    ],
    features: [{ name: 'Core Feature', desc: 'Primary functionality of the product.' }],
    tech: ['React', 'TypeScript', 'Node.js'],
    year: new Date().getFullYear().toString(), demoVideoUrl: '', badge: isWork ? 'website' : undefined,
  }
}
