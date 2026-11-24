import { ArrowRight, MessageCircle } from 'lucide-react'
import { StartProjectButton } from '@/components/home/SiteActions'
import type { CompanyDetails } from '@/lib/data/siteContent'
import { whatsappLink } from '@/lib/whatsapp'
import { IntroPanel } from './IntroSlider'

const tile = 'group flex flex-col items-start rounded-[10px] text-left no-underline transition-[border-color,opacity] duration-200'
const plain = 'border border-bbw-border bg-bbw-surface p-7 hover:border-bbw-border-hi stick:p-4'
// The highlighted tile (accent background), as the video tile was.
const highlight = 'min-h-56 border-none bg-bbw-accent p-8 text-white hover:opacity-90 stick:min-h-0 stick:p-5 min-[960px]:min-h-[min(240px,32svh)] min-[960px]:p-10'
const label = (on: boolean) => `font-mono text-[10px] tracking-[0.15em] uppercase ${on ? 'opacity-80' : 'text-bbw-muted'}`
const title = (on: boolean) => `mt-2 flex items-center gap-2 font-display font-bold tracking-[-0.02em] stick:mt-1 ${on ? 'text-[34px] leading-tight stick:text-[24px] min-[960px]:text-[40px]' : 'text-[26px] text-bbw-fg stick:text-[20px]'}`

/** "Start a Project": opens the contact form. */
function MessageTile({ email, highlighted }: { email: string; highlighted: boolean }) {
  return (
    <StartProjectButton className={`${tile} cursor-pointer ${highlighted ? highlight : plain}`}>
      <span className={label(highlighted)}>Start a Project</span>
      <span className={title(highlighted)}>
        Type a Message <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </span>
      <span className={`mt-auto pt-4 font-mono text-[11px] tracking-[0.08em] stick:pt-1 ${highlighted ? 'opacity-80' : 'text-bbw-muted'}`}>{email}</span>
    </StartProjectButton>
  )
}

/** WhatsApp chat with the number from Company details (the highlighted tile). */
function WhatsAppTile({ href, number }: { href: string; number: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${tile} ${highlight}`}>
      <span className="flex size-12 items-center justify-center rounded-[12px] bg-black/15 stick:hidden">
        <MessageCircle size={22} aria-hidden="true" />
      </span>
      <span className={`mt-6 stick:mt-0 ${label(true)}`}>WhatsApp</span>
      <span className={`${title(true)} mt-auto pt-4 stick:pt-1`}>{number}</span>
    </a>
  )
}

/**
 * Panel 3: Let's work together. WhatsApp (when set in Company details) is the
 * highlighted tile beside "Type a Message"; without it, "Type a Message" is the
 * highlight. Only real details.
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

      {whatsapp ? (
        <div className="mt-10 grid gap-4 short:mt-6 stick:mt-5 stick:gap-2.5 min-[768px]:grid-cols-2 min-[960px]:gap-6">
          <WhatsAppTile href={whatsapp} number={companyDetails.whatsapp ?? ''} />
          <MessageTile email={companyDetails.email} highlighted={false} />
        </div>
      ) : (
        <div className="mt-10 grid max-w-[560px] short:mt-6 stick:mt-5">
          <MessageTile email={companyDetails.email} highlighted />
        </div>
      )}
    </IntroPanel>
  )
}
