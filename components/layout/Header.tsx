'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/content/site'
import { BORDER } from '@/lib/theme'
import BrandLogo from '@/components/ui/BrandLogo'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { useSiteActions } from '@/components/home/SiteActions'
import useSectionNavigation from '@/lib/hooks/useSectionNavigation'

const SECTION_IDS = ['solutions', 'products', 'work', 'about'] as const

export default function Header() {
  const { dark, toggleTheme, openContact } = useSiteActions()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeSection, scrollToSection } = useSectionNavigation(SECTION_IDS)

  // Section links point to the homepage (/#work), so they work from case study pages too.
  const onHome = usePathname() === '/'
  const navigateToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Elsewhere, the link simply goes to the homepage section.
    if (!onHome) return
    // SmoothScroll (components/SmoothScroll.tsx) already handles in-page links
    // when motion is allowed; only scroll here when it didn't.
    if (event.defaultPrevented) return
    event.preventDefault()
    scrollToSection(id)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBackground = scrolled
    ? dark ? 'rgba(9,9,11,0.92)' : 'rgba(247,246,243,0.92)'
    : 'transparent'

  return (
    <>
      <nav aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-200 flex h-16 items-center justify-between px-[clamp(16px,4vw,40px)] transition-[background,border-color] duration-300" style={{ backgroundColor: navBackground, backdropFilter: scrolled ? 'blur(18px)' : 'none', borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent' }}>
        <Link href="/" aria-label="BBW Tech Innovations home" className="flex items-center gap-[3px] no-underline">
          <BrandLogo />
          <span className="text-sm font-semibold text-bbw-fg">Tech <span className="font-normal text-bbw-muted">Innovations</span></span>
        </Link>
        <div className="desktop-nav items-center gap-9">
          {NAV_LINKS.map(label => {
            const id = label.toLowerCase()
            return <a key={label} href={`/#${id}`} className={`nav-link${activeSection === id ? ' is-active' : ''}`} aria-current={activeSection === id ? 'location' : undefined} onClick={event => navigateToSection(event, id)}>{label}</a>
          })}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
          <button type="button" onClick={() => openContact()} className="btn-primary nav-cta px-5! py-[9px]! text-[13px]!">Start a Project →</button>
          <button type="button" className="mobile-menu-btn flex cursor-pointer items-center border-none bg-transparent p-1 text-bbw-fg" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(open => !open)}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? <><line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" /></> : <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="11" x2="19" y2="11" /><line x1="3" y1="15" x2="19" y2="15" /></>}
            </svg>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div id="mobile-navigation" aria-label="Mobile navigation" className="fixed top-16 bottom-0 left-0 z-199 flex w-[min(72vw,280px)] flex-col border-r border-bbw-border px-5 py-8 shadow-[18px_0_38px_rgba(0,0,0,0.22)] backdrop-blur-[24px]" style={{ backgroundColor: dark ? 'rgba(9,9,11,0.97)' : 'rgba(247,246,243,0.97)' }}>
          {NAV_LINKS.map(label => {
            const id = label.toLowerCase()
            return <a key={label} href={`/#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={event => { navigateToSection(event, id); setMobileOpen(false) }} className={`border-b border-bbw-border py-4 font-display text-[22px] font-medium no-underline ${activeSection === id ? 'text-bbw-accent' : 'text-bbw-fg'}`}>{label}</a>
          })}
          <Link href="/#contact" onClick={() => setMobileOpen(false)} className="border-b border-bbw-border py-4 font-display text-[22px] font-medium text-bbw-fg no-underline">Contact</Link>
          <button type="button" className="btn-primary mt-8 justify-center" onClick={() => { setMobileOpen(false); openContact() }}>Start a Project →</button>
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="mt-auto self-start pt-7 font-mono text-[9px] tracking-[0.12em] text-bbw-muted uppercase no-underline opacity-70">Admin access only</Link>
        </div>
      )}
    </>
  )
}
