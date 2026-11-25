// The admin case study editor's forms, for BBW's agency layout only (ported
// from the portfolio's lib/admin/blocks.ts). Field names match the block data
// in ./types.ts. No diagram, TL;DR, problem, stack table or gallery blocks.
import type { Devices } from '@/lib/project-types'
import { LAPTOP_SCREENSHOT, PHONE_SCREENSHOT } from '@/lib/screens'
import type { Block, BlockType } from './types'

export type Media = 'image' | 'video'
export type Field =
  | { name: string; label: string; kind: 'text' | 'textarea' | 'url'; help?: string; required?: boolean; placeholder?: string }
  | { name: string; label: string; kind: 'select'; options: { value: string; label: string }[]; help?: string }
  | { name: string; label: string; kind: 'checkbox'; help?: string }
  | { name: string; label: string; kind: 'lines'; help?: string }
  | { name: string; label: string; kind: 'media'; media: Media; help?: string }
  | { name: string; label: string; kind: 'repeater'; itemLabel: string; fields: Field[]; help?: string }

/** The block types the editor handles (the agency layout is built from these). */
export const EDITABLE_TYPES = ['cover', 'text', 'list', 'flow', 'video', 'groups', 'review'] as const satisfies readonly BlockType[]
export type EditableType = (typeof EDITABLE_TYPES)[number]
export const isEditable = (type: string): type is EditableType => (EDITABLE_TYPES as readonly string[]).includes(type)

const formatting = 'Blank line = new paragraph. “- ” starts a bullet. **bold**, [link](https://…). Text in [square brackets] is a placeholder: hidden on the live site.'
const heading: Field = { name: 'heading', label: 'Heading', kind: 'text' }
const phone = `Phone screenshot (${PHONE_SCREENSHOT})`
const laptop = `Laptop screenshot (${LAPTOP_SCREENSHOT})`

export const SECTION_FIELD: Field = {
  name: 'section_label',
  label: 'Section pill',
  kind: 'text',
  help: 'Starts a new section with its own pill (e.g. The brief). Leave empty to continue the section above.',
}

const FIELDS: Record<EditableType, Field[]> = {
  cover: [
    { name: 'label', label: 'Small label', kind: 'text', placeholder: 'Our product / Client work' },
    { name: 'summary', label: 'Summary', kind: 'textarea', required: true },
    { name: 'summaryAccent', label: 'Summary ending (blue italic)', kind: 'text' },
    { name: 'facts', label: 'Facts', kind: 'repeater', itemLabel: 'fact', help: 'Status, Timeline, Platforms, What we did…', fields: [
      { name: 'label', label: 'Label', kind: 'text', required: true },
      { name: 'value', label: 'Value', kind: 'textarea', required: true },
    ] },
    { name: 'links', label: 'Links', kind: 'repeater', itemLabel: 'link', help: 'The first link is the blue button.', fields: [
      { name: 'label', label: 'Label', kind: 'text', required: true },
      { name: 'url', label: 'URL', kind: 'url', required: true },
    ] },
    { name: 'mediaUrl', label: 'Cover screenshot', kind: 'media', media: 'image', help: 'The plain screen: the site draws the device around it. A short silent MP4 loop works too (paste its URL).' },
    { name: 'desktopMediaUrl', label: laptop, kind: 'media', media: 'image', help: 'Shown on the laptop, with the phone in front of it.' },
    { name: 'mockupFrame', label: 'Device frame', kind: 'select', options: [
      { value: 'auto', label: 'Automatic (from the project type)' },
      { value: 'phone', label: `Phone (${PHONE_SCREENSHOT})` },
      { value: 'desktop', label: `Laptop (${LAPTOP_SCREENSHOT})` },
      { value: 'none', label: 'None (my image already includes a device)' },
    ] },
    { name: 'qrUrl', label: 'Download link for the QR code (apps)', kind: 'url' },
  ],
  text: [heading, { name: 'body', label: 'Text', kind: 'textarea', required: true, help: formatting }],
  list: [
    heading,
    { name: 'intro', label: 'Intro', kind: 'textarea' },
    { name: 'items', label: 'Items', kind: 'repeater', itemLabel: 'item', help: 'With titles: a grid of tiles. Without titles: a bullet list.', fields: [
      { name: 'title', label: 'Bold lead', kind: 'text' },
      { name: 'text', label: 'Text', kind: 'textarea' },
    ] },
    { name: 'numbered', label: 'Numbered (01, 02…)', kind: 'checkbox' },
    { name: 'showPlaceholders', label: 'Show [placeholders] on the live site', kind: 'checkbox', help: 'For The result: numbers we don’t have yet stay visible as [placeholders].' },
  ],
  flow: [
    { name: 'heading', label: 'Heading', kind: 'text', help: 'Usually empty (the section pill names the section).' },
    { name: 'number', label: 'Number', kind: 'text', required: true },
    { name: 'title', label: 'Outcome headline', kind: 'text', required: true, help: 'What the end customer can now do, e.g. “A business owner sets up one professional home for their business.”' },
    { name: 'intro', label: 'What it does', kind: 'textarea' },
    { name: 'steps', label: 'Steps (one screen each)', kind: 'repeater', itemLabel: 'step', fields: [
      { name: 'caption', label: 'Step', kind: 'text', required: true },
      { name: 'text', label: 'More detail (optional)', kind: 'textarea' },
      { name: 'imageUrl', label: 'Screenshot', kind: 'media', media: 'image' },
      { name: 'desktopImageUrl', label: laptop, kind: 'media', media: 'image' },
    ] },
    { name: 'note', label: 'Note after the journey', kind: 'textarea' },
    { name: 'business', label: 'What this meant for the business', kind: 'textarea', help: 'A real result, or a visible [placeholder] until there is one, e.g. [Result to add, e.g. bookings per week].' },
  ],
  video: [
    heading,
    { name: 'videoUrl', label: 'Demo video (MP4/WebM upload, or a YouTube link)', kind: 'media', media: 'video' },
    { name: 'posterUrl', label: 'Poster image', kind: 'media', media: 'image' },
    { name: 'caption', label: 'Caption', kind: 'textarea' },
    { name: 'frame', label: 'Played inside', kind: 'select', options: [
      { value: 'auto', label: 'The project’s device (automatic)' },
      { value: 'phone', label: 'A phone' },
      { value: 'desktop', label: 'A laptop' },
      { value: 'none', label: 'No frame' },
    ] },
  ],
  groups: [
    heading,
    { name: 'intro', label: 'Intro', kind: 'textarea', help: formatting },
    { name: 'groups', label: 'Groups', kind: 'repeater', itemLabel: 'group', fields: [
      { name: 'title', label: 'Group title (e.g. a role)', kind: 'text' },
      { name: 'items', label: 'Points (one per line)', kind: 'lines' },
    ] },
    { name: 'style', label: 'Style', kind: 'select', options: [
      { value: 'auto', label: 'Automatic' },
      { value: 'chips', label: 'Chips (team, built with)' },
    ] },
  ],
  review: [
    heading,
    { name: 'quote', label: 'Quote', kind: 'textarea', required: true, help: 'The client’s own words only.' },
    { name: 'clientName', label: 'Client name', kind: 'text', required: true },
    { name: 'clientRole', label: 'Client role', kind: 'text' },
  ],
}

/**
 * A block's form for this project: the screenshot fields follow its devices
 * (phone 1080 × 2280, laptop 1440 × 900, both for combined types), each
 * labelled with the exact size. Saving keeps every other value already stored.
 */
export function blockFields(type: EditableType, devices: Devices): Field[] {
  const sized = (kind: 'phone' | 'desktop' | 'both') => (kind === 'desktop' ? laptop : phone)
  return FIELDS[type]
    .filter(field => !(type === 'cover' && field.name === 'desktopMediaUrl' && devices.hero !== 'both'))
    .filter(field => !(type === 'cover' && field.name === 'qrUrl' && devices.hero === 'desktop'))
    .map(field => {
      if (type === 'cover' && field.name === 'mediaUrl') return { ...field, label: devices.hero === 'both' ? phone : `Cover screenshot: ${sized(devices.hero).toLowerCase()}` }
      if (type === 'flow' && field.kind === 'repeater') {
        return {
          ...field,
          fields: field.fields
            .filter(item => item.name !== 'desktopImageUrl' || devices.journeys === 'both')
            .map(item => (item.name === 'imageUrl' ? { ...item, label: sized(devices.journeys) } : item)),
        }
      }
      return field
    })
}

/** The agency layout's blocks, as the "+ Add block" choices (each with its usual section and heading). */
export type Preset = { key: string; label: string; type: EditableType; sectionLabel: string | null; data: Record<string, unknown> }
export const PRESETS: Preset[] = [
  { key: 'brief', label: 'The brief', type: 'text', sectionLabel: 'The brief', data: { heading: 'The brief', body: '' } },
  { key: 'feature', label: 'What we built: a feature journey', type: 'flow', sectionLabel: null, data: { heading: '', number: '', title: '', intro: '', note: '', steps: [], business: '[Result to add]' } },
  { key: 'demo', label: 'See it in action', type: 'video', sectionLabel: 'See it in action', data: { heading: 'See it in action', videoUrl: '', posterUrl: '', caption: '', frame: 'auto' } },
  { key: 'result', label: 'The result', type: 'list', sectionLabel: 'The result', data: { heading: 'The result', intro: '', items: [], showPlaceholders: true } },
  { key: 'team', label: 'The team', type: 'groups', sectionLabel: 'Team', data: { heading: 'The team', intro: '', groups: [], style: 'chips' } },
  { key: 'built', label: 'Built with', type: 'groups', sectionLabel: 'Built with', data: { heading: 'Built with', intro: '', groups: [{ title: '', items: [] }], style: 'chips' } },
  { key: 'review', label: 'Client review', type: 'review', sectionLabel: 'Review', data: { heading: 'Client review', quote: '', clientName: '', clientRole: '' } },
]
export const COVER_PRESET: Preset = { key: 'cover', label: 'Cover', type: 'cover', sectionLabel: null, data: { label: '', summary: '', summaryAccent: '', facts: [], links: [], mediaUrl: '', mockupFrame: 'auto' } }

/** What the editor calls a block, in the agency layout's words. */
export function blockLabel(block: Pick<Block, 'type' | 'data'>) {
  const data = block.data as Record<string, unknown>
  switch (block.type) {
    case 'cover': return 'Cover'
    case 'flow': return 'Feature journey'
    case 'video': return 'See it in action'
    case 'review': return 'Client review'
    case 'list': return data.showPlaceholders ? 'The result' : 'List'
    case 'groups': return /built with/i.test(String(data.heading ?? '')) ? 'Built with' : /team/i.test(String(data.heading ?? '')) ? 'The team' : 'Groups'
    case 'text': return 'Text'
    default: return block.type
  }
}

/** A short line describing a block (list view). */
export function blockSummary(data: Record<string, unknown>) {
  const pick = (key: string) => (typeof data[key] === 'string' ? (data[key] as string) : '')
  const title = pick('title') ? `${pick('number') ? `${pick('number')}. ` : ''}${pick('title')}` : ''
  return title || pick('heading') || pick('summary') || pick('quote') || pick('caption') || ''
}

/** Required fields left empty (top level and inside repeaters), as messages. */
export function missingRequired(fields: Field[], values: Record<string, unknown>): string[] {
  const missing: string[] = []
  for (const field of fields) {
    if ((field.kind === 'text' || field.kind === 'textarea' || field.kind === 'url') && field.required && !String(values[field.name] ?? '').trim()) missing.push(field.label)
    if (field.kind === 'repeater') {
      const items = Array.isArray(values[field.name]) ? (values[field.name] as Record<string, unknown>[]) : []
      items.forEach((item, i) => missingRequired(field.fields, item).forEach(label => missing.push(`${field.itemLabel} ${i + 1}: ${label}`)))
    }
  }
  return missing
}

const DEFAULT_DATA: Record<EditableType, Record<string, unknown>> = {
  cover: COVER_PRESET.data,
  text: { heading: '', body: '' },
  list: { heading: '', intro: '', items: [] },
  flow: { heading: '', number: '', title: '', intro: '', note: '', steps: [] },
  video: { heading: '', videoUrl: '', posterUrl: '', caption: '', frame: 'auto' },
  groups: { heading: '', intro: '', groups: [] },
  review: { heading: '', quote: '', clientName: '', clientRole: '' },
}

/** A block's data with every field the page expects (a half-filled draft still draws). */
export const withDefaults = (type: string, data: Record<string, unknown>) => (isEditable(type) ? { ...DEFAULT_DATA[type], ...data } : data)

/** Before saving: trims text and drops empty lines from line lists. */
export function cleanData(value: unknown): unknown {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map(cleanData).filter(item => item !== '')
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanData(item)]))
  return value
}
