import { useEffect } from 'react'

const siteUrl = 'https://bbwtechinnovation.com'
const defaultTitle = 'BBW Tech Innovations | Digital Products & Technology Solutions'

interface SeoMetadataProps {
  description?: string
  noIndex?: boolean
  path?: string
  title?: string
}

function upsertMeta(selector: string, attribute: 'name' | 'property', value: string, content: string) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector)
  const element = existing ?? document.createElement('meta')
  const originalContent = existing?.content
  element.setAttribute(attribute, value)
  element.content = content
  if (!existing) document.head.append(element)

  return () => {
    if (existing) existing.content = originalContent ?? ''
    else element.remove()
  }
}

export default function SeoMetadata({ description, noIndex = false, path = '/', title = defaultTitle }: SeoMetadataProps) {
  useEffect(() => {
    const previousTitle = document.title
    const canonicalUrl = `${siteUrl}${path}`
    const previousCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const canonical = previousCanonical ?? document.createElement('link')
    const originalHref = previousCanonical?.href

    document.title = title
    canonical.rel = 'canonical'
    canonical.href = canonicalUrl
    if (!previousCanonical) document.head.append(canonical)

    const cleanups = [
      upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl),
      upsertMeta('meta[property="og:title"]', 'property', 'og:title', title),
      upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title),
    ]

    if (description) {
      cleanups.push(
        upsertMeta('meta[name="description"]', 'name', 'description', description),
        upsertMeta('meta[property="og:description"]', 'property', 'og:description', description),
        upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description),
      )
    }

    if (noIndex) cleanups.push(upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow'))

    return () => {
      document.title = previousTitle
      cleanups.forEach(cleanup => cleanup())
      if (previousCanonical) previousCanonical.href = originalHref ?? ''
      else canonical.remove()
    }
  }, [description, noIndex, path, title])

  return null
}
