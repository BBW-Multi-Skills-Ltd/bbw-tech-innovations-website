import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../../content/site'
import { BORDER, FG, MUTED, display } from '../../styles/theme'
import BrandLogo from '../ui/BrandLogo'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  dark: boolean
  onToggleTheme: () => void
  onStartProject: () => void
}

export default function Header({ dark, onToggleTheme, onStartProject }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      <nav aria-label="Primary navigation" style={{ position: 'fixed', inset: '0 0 auto', zIndex: 200, height: 64, padding: '0 clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: navBackground, backdropFilter: scrolled ? 'blur(18px)' : 'none', borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent', transition: 'background 0.3s, border-color 0.3s' }}>
        <Link to="/" aria-label="BBW Tech Innovations home" style={{ display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          <BrandLogo />
          <span style={{ fontWeight: 600, fontSize: 14, color: FG }}>Tech <span style={{ color: MUTED, fontWeight: 400 }}>Innovations</span></span>
        </Link>
        <div className="desktop-nav" style={{ alignItems: 'center', gap: 36 }}>
          {NAV_LINKS.map(label => <a key={label} href={`#${label.toLowerCase()}`} className="nav-link">{label}</a>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <button type="button" onClick={onStartProject} className="btn-primary nav-cta" style={{ padding: '9px 20px', fontSize: 13 }}>Start a Project →</button>
          <button type="button" className="mobile-menu-btn" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(open => !open)} style={{ background: 'none', border: 'none', color: FG, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? <><line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" /></> : <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="11" x2="19" y2="11" /><line x1="3" y1="15" x2="19" y2="15" /></>}
            </svg>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div id="mobile-navigation" aria-label="Mobile navigation" style={{ position: 'fixed', inset: '64px 0 0', zIndex: 199, backgroundColor: dark ? 'rgba(9,9,11,0.97)' : 'rgba(247,246,243,0.97)', backdropFilter: 'blur(24px)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
          {[...NAV_LINKS, 'Contact'].map(label => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{ color: FG, textDecoration: 'none', fontSize: 22, fontWeight: 500, padding: '16px 0', borderBottom: `1px solid ${BORDER}`, ...display }}>{label}</a>)}
          <button type="button" className="btn-primary" style={{ marginTop: 32, justifyContent: 'center' }} onClick={() => { setMobileOpen(false); onStartProject() }}>Start a Project →</button>
        </div>
      )}
    </>
  )
}
