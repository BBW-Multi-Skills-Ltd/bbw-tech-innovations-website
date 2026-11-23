'use client'

import { useSiteActions } from '@/components/home/SiteActions'
import type { Project } from '@/lib/data/projects'

/**
 * The project's name on an intro card, as a button that opens its popup. Its
 * hit area covers the whole card. Coming-soon products have no popup (as on
 * their cards in Our Products), so the name is plain text.
 */
export function OpenProjectButton({ project, disabled }: { project: Project; disabled: boolean }) {
  const { openProject } = useSiteActions()
  if (disabled) return <>{project.name}</>
  return (
    <button
      type="button"
      onClick={() => openProject(project)}
      className="cursor-pointer border-none bg-transparent p-0 text-left text-inherit transition-colors duration-200 group-hover:text-bbw-accent after:absolute after:inset-0 after:content-['']"
    >
      {project.name}
    </button>
  )
}
