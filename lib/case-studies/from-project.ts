import type { Project } from '@/lib/data/projects'
import { getProjectPlatformLabel, STATUS_LABELS } from '@/lib/data/projects'
import { externalUrl } from '@/lib/urls'
import { isPhoneProject } from './devices'
import { shownText } from './text'
import type { Block, BlockData, Fact } from './types'

/** The project's live site, if it has a real one. */
export function liveSiteUrl(project: Project): string | null {
  const url = project.siteUrl?.trim()
  return url && url !== '#' && !/^https?:\/\/$/i.test(url) ? externalUrl(url) : null
}

/**
 * A case study built from the project's existing fields, for projects with no
 * stored blocks yet. Everything the old project popup showed has a place;
 * nothing is added, and empty fields are left out:
 *   cover    ← name, tagline, category, status, year, platform/store availability,
 *              live site, QR code, demo video, card image
 *   Overview ← about          Features ← features (numbered)
 *   Team     ← roles          Tech stack ← tech
 *   Client review ← review
 */
export function blocksFromProject(project: Project): Block[] {
  const blocks: Block[] = []
  const add = <K extends Block['type']>(type: K, sectionLabel: string | null, data: BlockData[K]) =>
    blocks.push({ id: `derived-${type}-${blocks.length}`, type, sectionLabel, data } as Block)

  const facts: Fact[] = [
    { label: 'Status', value: STATUS_LABELS[project.status] ?? '' },
    { label: 'Year', value: project.year },
    { label: isPhoneProject(project) ? 'Platform' : 'Type', value: isPhoneProject(project) ? getProjectPlatformLabel(project) : 'Website' },
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
    demoUrl: project.demoVideoUrl ?? '',
    qrUrl: project.qrUrl ?? '',
  })

  if (shownText(project.about)) add('text', 'Overview', { heading: 'Overview', body: project.about })

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
