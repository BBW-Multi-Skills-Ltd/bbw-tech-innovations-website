import BrandLogo from '@/components/ui/BrandLogo'
import type { BusinessArm } from '@/lib/data/company'
import { BUSINESS_ARM_STATUS_COLORS, BUSINESS_ARM_STATUS_LABELS } from '@/lib/data/company'
import type { CompanyDetails } from '@/lib/data/siteContent'
import { IntroPanel } from './IntroSlider'

const TECH_ARM_ID = 'bbw-tech-innovations'

/**
 * Panel 1: Who we are. The former hero's headline and paragraph, beside a
 * company card: BBW Tech as the technology arm of BBW Multi-Skills Ltd, the
 * business arms as a small tree with their status, and our location.
 */
export function WhoWeArePanel({ businessArms, companyDetails }: { businessArms: BusinessArm[]; companyDetails: CompanyDetails }) {
  return (
    <IntroPanel label="1 of 3: Who we are">
      <div className="flex flex-col gap-10 stick:gap-5 min-[960px]:flex-row min-[960px]:items-center min-[960px]:gap-16">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-bbw-border px-3.5 py-[5px] font-mono text-[11px] tracking-[0.14em] text-bbw-muted">
            <span className="inline-block h-1.5 w-1.5 animate-[dot-pulse_2.2s_ease-in-out_infinite] rounded-full bg-bbw-accent" />
            Who we are
          </div>
          <h2 className="mt-7 font-display text-[clamp(36px,5.4vw,46px)] leading-[1.04] font-bold tracking-[-0.035em] text-bbw-fg stick:mt-4 stick:text-[clamp(28px,4.4dvh,40px)] min-[960px]:text-[clamp(44px,7.6svh,76px)]">
            We Build Technology That Moves Businesses <em className="text-bbw-accent">Forward.</em>
          </h2>
          <p className="mt-6 max-w-[560px] text-[clamp(16px,2vw,18px)] leading-[1.7] text-bbw-muted stick:mt-3 stick:text-[14px] stick:leading-[1.6]">
            BBW Tech Innovations designs and develops websites, applications, SaaS products, and intelligent digital systems for businesses ready to grow.
          </p>
          <p className="mt-8 font-mono text-[10px] tracking-[0.18em] text-bbw-muted uppercase stick:hidden">Built by Will. Powered by Skills.</p>
        </div>

        <CompanyCard businessArms={businessArms} companyDetails={companyDetails} />
      </div>
    </IntroPanel>
  )
}

function CompanyCard({ businessArms, companyDetails }: { businessArms: BusinessArm[]; companyDetails: CompanyDetails }) {
  return (
    <div className="w-full shrink-0 rounded-[10px] border border-bbw-border bg-bbw-surface p-6 [--arms-bg:var(--bbw-surface)] stick:p-4 min-[960px]:w-[440px] min-[960px]:p-7">
      <div className="flex items-center gap-3">
        <BrandLogo width={48} height={34} />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-bbw-fg">BBW Tech Innovations</p>
          <p className="text-[12px] leading-snug text-bbw-muted">The technology arm of BBW Multi-Skills Ltd.</p>
        </div>
      </div>

      <div className="mt-6 stick:mt-3">
        <p className="inline-flex rounded-md border border-bbw-border-hi bg-bbw-surface2 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-bbw-fg uppercase">BBW Multi-Skills Ltd — Business Arms</p>
        <ul className="arms-tree mt-0 pt-3 stick:pt-2">
          {businessArms.map(arm => {
            const color = BUSINESS_ARM_STATUS_COLORS[arm.status]
            const isTech = arm.id === TECH_ARM_ID
            return (
              <li key={arm.id} className="py-1 stick:py-0.5">
                <div className={`flex items-center gap-3 rounded-md border px-3 py-2 stick:py-1.5 ${isTech ? 'border-[rgba(41,121,255,0.45)] bg-bbw-accent-dim' : 'border-bbw-border'}`}>
                  <span className="size-1.5 shrink-0 rounded-full" style={{ background: color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-bbw-fg">{arm.name}</span>
                    <span className="block truncate text-[11px] text-bbw-muted stick:max-[767px]:hidden">{arm.role}</span>
                  </span>
                  <span className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[8px] tracking-[0.08em] whitespace-nowrap uppercase" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>
                    {BUSINESS_ARM_STATUS_LABELS[arm.status]}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-bbw-border pt-4 stick:mt-3 stick:pt-3">
        <span className="font-mono text-[10px] tracking-[0.15em] text-bbw-muted uppercase">Location</span>
        <span className="text-[13px] text-bbw-fg">{companyDetails.location}</span>
      </div>
    </div>
  )
}
