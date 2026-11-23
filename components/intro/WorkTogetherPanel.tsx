import { ArrowRight, MessageCircle } from 'lucide-react'
import { StartProjectButton } from '@/components/home/SiteActions'
import type { CompanyDetails } from '@/lib/data/siteContent'
import { whatsappLink } from '@/lib/whatsapp'
import { IntroPanel } from './IntroSlider'
import { VideoEnquiryButton } from './VideoEnquiryButton'

/**
 * Panel 3: Let's work together. The video enquiry as the highlight, Start a
 * Project, and WhatsApp when set in Company details. Only real details.
 */
export function WorkTogetherPanel({ companyDetails }: { companyDetails: CompanyDetails }) {
  const whatsapp = whatsappLink(companyDetails.whatsapp)
  return (
    <IntroPanel label="3 of 3: Let’s work together">
      <p className="font-mono text-[11px] tracking-[0.16em] text-bbw-accent uppercase">Let’s work together</p>
      <h2 className="mt-4 font-display text-[clamp(34px,5vw,44px)] leading-[1.04] font-bold tracking-[-0.03em] text-bbw-fg stick:mt-3 stick:text-[clamp(26px,4dvh,36px)] min-[960px]:text-[clamp(40px,6.4svh,64px)]">
        Let&apos;s build something <em className="text-bbw-accent">worth building.</em>
      </h2>
      <p className="mt-5 max-w-[480px] text-[16px] leading-[1.65] text-bbw-muted short:mt-3 stick:mt-2 stick:text-[14px]">
        Tell us about your business. We&apos;ll show you how technology can make it operate, grow, and scale.
      </p>

      <div className="mt-10 grid gap-4 short:mt-6 stick:mt-5 stick:gap-2.5 min-[768px]:grid-cols-2 min-[960px]:gap-6">
        <VideoEnquiryButton />

        <div className="grid gap-4 stick:gap-2.5 min-[960px]:gap-6">
          <StartProjectButton className="group flex cursor-pointer flex-col items-start rounded-[10px] border border-bbw-border bg-bbw-surface p-7 text-left transition-[border-color] duration-200 hover:border-bbw-border-hi stick:p-4">
            <span className="font-mono text-[10px] tracking-[0.15em] text-bbw-muted uppercase">Start a Project</span>
            <span className="mt-2 flex items-center gap-2 font-display text-[26px] font-bold tracking-[-0.02em] text-bbw-fg stick:mt-1 stick:text-[20px]">
              Type a Message <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="mt-auto pt-4 font-mono text-[11px] tracking-[0.08em] text-bbw-muted stick:pt-1">{companyDetails.email}</span>
          </StartProjectButton>

          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-[10px] border border-bbw-border bg-bbw-surface p-7 no-underline transition-[border-color] duration-200 hover:border-bbw-border-hi stick:p-4">
              <span className="font-mono text-[10px] tracking-[0.15em] text-bbw-muted uppercase">WhatsApp</span>
              <span className="mt-2 flex items-center gap-2 font-display text-[26px] font-bold tracking-[-0.02em] text-bbw-fg stick:mt-1 stick:text-[20px]">
                <MessageCircle size={20} aria-hidden="true" /> {companyDetails.whatsapp}
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </IntroPanel>
  )
}
