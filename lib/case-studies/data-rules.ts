import type { Project } from '@/lib/data/projects'

/** Own products that are "coming soon" have no page (as they had no popup). Shared by the site and the admin. */
export const hasCaseStudy = (project: Project) => !(project.isOwn && project.status === 'coming-soon')
