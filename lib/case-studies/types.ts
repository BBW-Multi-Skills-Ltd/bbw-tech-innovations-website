// Case study blocks (/work/[slug]), as in the portfolio. Stored in
// case_study_blocks: block_type, section_label (starts a section + pill) and
// data (jsonb, shapes below). Until a project has stored blocks, its page is
// built from its existing fields (lib/case-studies/from-project.ts).
// [Bracketed] values are placeholders: hidden on the live site.

export type Fact = { label: string; value: string }
export type LinkItem = { label: string; url: string }
export type ListItem = { title: string; text: string }
export type Group = { title: string; items: string[] }
/** imageUrl: the step's screen (phone, or laptop for websites). desktopImageUrl: the laptop version, for projects with both. */
export type FlowStep = { caption: string; text?: string; imageUrl: string; desktopImageUrl?: string }
export type StackRow = { tech: string; why: string }
export type GalleryImage = { url: string; caption: string }

export type BlockData = {
  cover: {
    label: string
    summary: string
    summaryAccent: string
    facts: Fact[]
    links: LinkItem[]
    /** Beside the title: a screenshot (or short muted loop) in the project's device frame. */
    mediaUrl: string
    /** Projects with both: the laptop screenshot shown with the phone. */
    desktopMediaUrl?: string
    /** auto = from the project type (lib/project-types.ts devicesFor). */
    mockupFrame?: 'auto' | 'phone' | 'desktop' | 'none'
    /** Under the facts: the demo (MP4/WebM upload or a YouTube link). */
    demoUrl?: string
    demoPosterUrl?: string
    demoCaption?: string
    /** BBW: a download link shown as a QR code (apps). */
    qrUrl?: string
  }
  tldr: { heading: string; problem: string; built: string; result: string }
  text: { heading: string; body: string }
  /** numbered (BBW): items show 01, 02… instead of bullets. */
  list: { heading: string; intro: string; items: ListItem[]; numbered?: boolean }
  /** style (BBW): "chips" shows every group as a tile of chips, whatever the items. */
  groups: { heading: string; intro: string; groups: Group[]; style?: 'auto' | 'chips' }
  /** A feature and its user journey: screens with text beside them, step by step. */
  flow: {
    heading: string
    number: string
    title: string
    intro?: string
    note: string
    steps: FlowStep[]
  }
  /** frame (BBW): play the video inside the project's device (auto), a phone, a laptop, or plain. */
  video: { heading: string; videoUrl: string; posterUrl: string; caption: string; frame?: 'auto' | 'phone' | 'desktop' | 'none' }
  stack_table: { heading: string; rows: StackRow[] }
  diagram: {
    heading: string
    source: string
    caption: string
    description: string
    /** Drawn in the admin on save; used only while svgSource matches source. */
    svg?: string
    svgLight?: string
    svgDark?: string
    svgSource?: string
  }
  problem: {
    heading: string
    number: string
    title: string
    problem: string
    investigation: string
    fix: string
    result: string
  }
  gallery: { heading: string; images: GalleryImage[] }
  /** BBW: a client's review of the project. */
  review: { heading: string; quote: string; clientName: string; clientRole: string }
}

export type BlockType = keyof BlockData

export type Block = {
  [K in BlockType]: { id: string; type: K; sectionLabel: string | null; data: BlockData[K] }
}[BlockType]

export const BLOCK_LABELS: Record<BlockType, string> = {
  cover: 'Cover',
  tldr: 'TL;DR',
  text: 'Text',
  list: 'List',
  groups: 'Groups',
  flow: 'Feature + journey',
  video: 'Video',
  stack_table: 'Stack table',
  diagram: 'Diagram (Mermaid)',
  problem: 'Problem card',
  gallery: 'Gallery',
  review: 'Client review',
}
