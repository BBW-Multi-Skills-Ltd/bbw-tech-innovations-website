import { useCallback, useEffect, useState } from 'react'

const headerOffset = 80

function replaceHash(id?: string) {
  const next = id ? `#${id}` : window.location.pathname
  if (window.location.hash !== (id ? `#${id}` : '')) window.history.replaceState(null, '', next)
}

export default function useSectionNavigation(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState('')

  const scrollToSection = useCallback((id: string, behavior: ScrollBehavior = 'smooth') => {
    const target = document.getElementById(id)
    if (!target) return
    setActiveSection(id)
    window.history.pushState(null, '', `#${id}`)
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset), behavior })
  }, [])

  useEffect(() => {
    const syncFromScroll = () => {
      const position = window.scrollY + headerOffset + 24
      const active = sectionIds.filter(id => (document.getElementById(id)?.offsetTop ?? Infinity) <= position).at(-1) ?? ''
      setActiveSection(current => current === active ? current : active)
      replaceHash(active || undefined)
    }
    const syncFromHistory = () => {
      const id = window.location.hash.slice(1)
      if (sectionIds.includes(id)) scrollToSection(id, 'auto')
    }

    const initialId = window.location.hash.slice(1)
    if (sectionIds.includes(initialId)) window.setTimeout(() => scrollToSection(initialId, 'auto'), 0)
    else syncFromScroll()
    window.addEventListener('scroll', syncFromScroll, { passive: true })
    window.addEventListener('popstate', syncFromHistory)
    return () => { window.removeEventListener('scroll', syncFromScroll); window.removeEventListener('popstate', syncFromHistory) }
  }, [scrollToSection, sectionIds])

  return { activeSection, scrollToSection }
}
