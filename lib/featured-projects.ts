import type { Project } from '@/lib/data/projects'
import { projectTypeOf, typeLabel } from '@/lib/project-types'

/** How many projects the intro's "What we've built" panel shows. */
export const FEATURED_MAX = 3

/**
 * Up to three featured projects, in list order (own products first, then
 * client work). Until any are marked featured (Admin → project → "Featured
 * on homepage"), the first three published projects stand in, so the panel
 * is never empty.
 */
export function featuredProjects(apps: Project[], websites: Project[], works: Project[]) {
  const all = [...apps, ...websites, ...works]
  const featured = all.filter(project => project.isFeatured)
  return (featured.length ? featured : all).slice(0, FEATURED_MAX)
}

/** The project's type as the cards show it: "Website", "Mobile app", "PWA", "Website + mobile app"… */
export const projectTypeLabel = (project: Project) => typeLabel(projectTypeOf(project))
