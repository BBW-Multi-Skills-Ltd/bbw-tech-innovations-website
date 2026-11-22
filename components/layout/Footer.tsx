import Link from 'next/link'
import type { Project } from '@/lib/data/projects'
import type { SocialLink } from '@/lib/data/socialLinks'
import type { CompanyDetails } from '@/lib/data/siteContent'
import BrandLogo from '@/components/ui/BrandLogo'
import SocialIcon from '@/components/ui/SocialIcon'
import { StartProjectButton } from '@/components/home/SiteActions'

function footerHref(heading: string, label: string) {
  if (heading === 'Solutions') return '#solutions'
  if (heading === 'Products') return '#products'
  if (label === 'About') return '#about'
  if (label === 'Our Work') return '#work'
  if (label === 'Process') return '#process'
  if (label === 'Privacy Policy') return '/privacy'
  return '#contact'
}

export default function Footer({ products, socialLinks, companyDetails }: { products: Project[]; socialLinks: SocialLink[]; companyDetails: CompanyDetails }) {
  const columns = [
    { heading: 'Solutions', links: ['Software Development', 'UI/UX Design', 'Mobile Apps', 'SaaS Products', 'Business Systems', 'AI & Automation'] },
    { heading: 'Products', links: Array.from(new Set(products.map(product => product.name))) },
    { heading: 'Company', links: ['About', 'Our Work', 'Process', 'Contact', 'Privacy Policy'] },
  ]

  return (
    <footer className="border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(48px,6vw,80px)]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-12">
          <div>
            <div className="mb-4 flex items-center gap-[3px]">
              <BrandLogo />
              <span className="text-sm font-semibold text-bbw-fg">Tech <span className="font-normal text-bbw-muted">Innovations</span></span>
            </div>
            <p className="max-w-[200px] text-[13px] leading-[1.65] text-bbw-muted">Built by Will.<br />Powered by Skills.</p>
            <p className="mt-3.5 font-mono text-[11px] tracking-[0.08em] text-bbw-muted">A BBW Multi-Skills Ltd Company</p>
            <StartProjectButton className="mt-5 cursor-pointer rounded border-none bg-bbw-accent px-[18px] py-[9px] text-[13px] font-semibold text-white" />
            <div className="footer-social-links" aria-label="BBW Tech social media">
              {socialLinks.filter(link => link.isEnabled && link.url).map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow BBW Tech on ${link.platform}`} title={link.platform}><SocialIcon platform={link.platform} /></a>)}
            </div>
          </div>
          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <p className="mb-[18px] font-mono text-[10px] tracking-[0.15em] text-bbw-muted uppercase">{heading}</p>
              <div className="flex flex-col gap-2.5">
                {links.map(label => label === 'Privacy Policy' ? <Link key={label} href="/privacy" className="footer-link">{label}</Link> : <a key={label} href={footerHref(heading, label)} className="footer-link">{label}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bbw-border pt-6">
          <p className="font-mono text-[11px] text-bbw-muted">© 2026 BBW Tech Innovations. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <p className="font-mono text-[11px] text-bbw-muted">{companyDetails.location}</p>
            <Link href="/admin" className="font-mono text-[10px] tracking-[0.1em] text-[rgba(107,107,104,0.45)] no-underline">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
