import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'
import type { SocialLink } from '../../data/socialLinks'
import type { CompanyDetails } from '../../data/siteContent'
import { ACCENT, BORDER, FG, MUTED, mono } from '../../styles/theme'
import BrandLogo from '../ui/BrandLogo'
import SocialIcon from '../ui/SocialIcon'

function footerHref(heading: string, label: string) {
  if (heading === 'Solutions') return '#solutions'
  if (heading === 'Products') return '#products'
  if (label === 'About') return '#about'
  if (label === 'Our Work') return '#work'
  if (label === 'Process') return '#process'
  if (label === 'Privacy Policy') return '/privacy'
  return '#contact'
}

export default function Footer({ onStartProject, products, socialLinks, companyDetails }: { onStartProject: () => void; products: Project[]; socialLinks: SocialLink[]; companyDetails: CompanyDetails }) {
  const columns = [
    { heading: 'Solutions', links: ['Software Development', 'UI/UX Design', 'Mobile Apps', 'SaaS Products', 'Business Systems', 'AI & Automation'] },
    { heading: 'Products', links: Array.from(new Set(products.map(product => product.name))) },
    { heading: 'Company', links: ['About', 'Our Work', 'Process', 'Contact', 'Privacy Policy'] },
  ]

  return (
    <footer style={{ borderTop: `1px solid ${BORDER}`, padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 16 }}>
              <BrandLogo />
              <span style={{ fontWeight: 600, fontSize: 14, color: FG }}>Tech <span style={{ color: MUTED, fontWeight: 400 }}>Innovations</span></span>
            </div>
            <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.65, maxWidth: 200 }}>Built by Will.<br />Powered by Skills.</p>
            <p style={{ ...mono, color: MUTED, fontSize: 11, marginTop: 14, letterSpacing: '0.08em' }}>A BBW Multi-Skills Ltd Company</p>
            <button type="button" onClick={onStartProject} style={{ marginTop: 20, padding: '9px 18px', background: ACCENT, border: 'none', borderRadius: 4, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Start a Project →</button>
            <div className="footer-social-links" aria-label="BBW Tech social media">
              {socialLinks.filter(link => link.isEnabled && link.url).map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow BBW Tech on ${link.platform}`} title={link.platform}><SocialIcon platform={link.platform} /></a>)}
            </div>
          </div>
          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ ...mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 18 }}>{heading}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(label => label === 'Privacy Policy' ? <Link key={label} to="/privacy" className="footer-link">{label}</Link> : <a key={label} href={footerHref(heading, label)} className="footer-link">{label}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <p style={{ ...mono, color: MUTED, fontSize: 11 }}>© 2026 BBW Tech Innovations. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <p style={{ ...mono, color: MUTED, fontSize: 11 }}>{companyDetails.location}</p>
            <Link to="/admin" style={{ ...mono, fontSize: 10, color: 'rgba(107,107,104,0.45)', textDecoration: 'none', letterSpacing: '0.1em' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
