import type { Project } from '@/lib/data/projects'
import type { Block } from '../types'
import { prezpaBlocks } from './prezpa'
import type { BundledBlock } from './types'

/** Case studies written in code, by project id: used when the database has no blocks for them. */
const bundled: Record<string, BundledBlock[]> = {
  prezpa: prezpaBlocks,
}

/**
 * A project's bundled case study as page blocks, or null. The cover takes the
 * project's card image when it has none of its own.
 */
export function bundledBlocks(project: Project): Block[] | null {
  const blocks = bundled[project.id]
  if (!blocks) return null
  return blocks.map((block, i) => {
    const data = block.type === 'cover' && !block.data.mediaUrl ? { ...block.data, mediaUrl: project.cardImageUrl ?? '' } : block.data
    return { id: `bundled-${project.id}-${i}`, type: block.type, sectionLabel: block.section ?? null, data } as Block
  })
}
