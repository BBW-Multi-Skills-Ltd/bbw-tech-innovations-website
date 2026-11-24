import type { Project } from '@/lib/data/projects'
import { getProjectPlatformLabel, STATUS_LABELS } from '@/lib/data/projects'
import { hasApp, projectTypeOf, typeLabel } from '@/lib/project-types'
import { externalUrl } from '@/lib/urls'
import { shownText } from './text'
import type { Block, BlockData, Fact } from './types'

/** The project's live site, if it has a real one. */
export function liveSiteUrl(project: Project): string | null {
  // A doubled scheme ("https://https://…", as one stored URL has) collapses to one.
  const url = project.siteUrl?.trim().replace(/^(https?:\/\/)+(https?:\/\/)/i, '$2')
  return url && url !== '#' && !/^https?:\/\/$/i.test(url) ? externalUrl(url) : null
}

/**
 * A case study built from the project's existing fields, for projects with no
 * stored blocks yet. Everything the old project popup showed has a place;
 * nothing is added, and empty fields are left out:
 *   cover    ← name, tagline, our product / client work, status, year, type,
 *              platform/store availability (apps), category, live site, QR code, card image
 *   Overview ← about          See it in action ← demo video (card image as poster)
 *   Features ← features       Team ← roles      Tech stack ← tech
 *   Client review ← review
 */
export function blocksFromProject(project: Project): Block[] {
  const blocks: Block[] = []
  const add = <K extends Block['type']>(type: K, sectionLabel: string | null, data: BlockData[K]) =>
    blocks.push({ id: `derived-${type}-${blocks.length}`, type, sectionLabel, data } as Block)

  const projectType = projectTypeOf(project)
  const facts: Fact[] = [
    { label: 'Status', value: STATUS_LABELS[project.status] ?? '' },
    { label: 'Year', value: project.year },
    { label: 'Type', value: typeLabel(projectType) },
    // Store availability, as the popup showed it (apps and PWAs only).
    { label: 'Platform', value: hasApp(projectType) ? getProjectPlatformLabel(project) : '' },
    { label: 'Category', value: project.category },
  ].filter(fact => shownText(fact.value?.trim()))
  const live = liveSiteUrl(project)

  add('cover', null, {
    label: project.isOwn ? 'Our product' : 'Client work',
    summary: project.tagline,
    summaryAccent: '',
    facts,
    links: live ? [{ label: 'Visit live site', url: live }] : [],
    mediaUrl: project.cardImageUrl ?? '',
    qrUrl: project.qrUrl ?? '',
  })

  if (shownText(project.about)) add('text', 'Overview', { heading: 'Overview', body: project.about })

  // The demo, in its own section, played inside the project's device frame.
  if (shownText(project.demoVideoUrl)) {
    add('video', 'See it in action', { heading: 'See it in action', videoUrl: project.demoVideoUrl ?? '', posterUrl: project.cardImageUrl ?? '', caption: '', frame: 'auto' })
  }

  const features = project.features.filter(feature => shownText(feature.name) || shownText(feature.desc))
  if (features.length) {
    add('list', 'Features', {
      heading: 'Features',
      intro: '',
      numbered: true,
      items: features.map(feature => ({ title: feature.name, text: feature.desc })),
    })
  }

  const roles = project.roles.filter(role => shownText(role.title))
  if (roles.length) {
    add('groups', 'Team', {
      heading: 'Roles & team',
      intro: '',
      style: 'chips',
      groups: roles.map(role => ({ title: role.title, items: role.desc.split(',').map(item => item.trim()).filter(Boolean) })),
    })
  }

  const tech = project.tech.map(item => item.trim()).filter(Boolean)
  if (tech.length) add('groups', 'Tech stack', { heading: 'Tech stack', intro: '', style: 'chips', groups: [{ title: '', items: tech }] })

  if (project.review && shownText(project.review.quote)) {
    add('review', 'Review', {
      heading: 'Client review',
      quote: project.review.quote,
      clientName: project.review.clientName || 'Client',
      clientRole: project.review.clientRole ?? '',
    })
  }

  return blocks
}
