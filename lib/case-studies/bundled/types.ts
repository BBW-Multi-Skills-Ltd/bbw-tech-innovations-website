import type { BlockData, BlockType } from '../types'

/** A bundled block (in code, not the database): no id; `section` starts a section and its pill. */
export type BundledBlock = {
  [K in BlockType]: { type: K; section?: string; data: BlockData[K] }
}[BlockType]
