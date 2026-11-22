import { Eyebrow } from '@/components/ui/SectionHeading'
import { StartProjectButton } from '@/components/home/SiteActions'

export default function CallToActionSection() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-bbw-border px-[clamp(20px,5vw,80px)] py-[clamp(80px,12vw,160px)] text-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[900px] -translate-1/2 bg-[radial-gradient(ellipse,rgba(41,121,255,0.06)_0%,transparent_65%)]" />
      <div className="relative z-1 mx-auto max-w-[720px]">
        <Eyebrow>Ready to build?</Eyebrow>
        <h2 className="mb-6 font-display text-[clamp(40px,7vw,80px)] leading-[1.02] font-bold tracking-[-0.035em] text-bbw-fg">Let&apos;s build something<br /><em className="text-bbw-accent">worth building.</em></h2>
        <p className="mx-auto mb-11 max-w-[480px] text-[17px] leading-[1.65] text-bbw-muted">Tell us about your business. We&apos;ll show you how technology can make it operate, grow, and scale.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <StartProjectButton />
          <a href="#products" className="btn-ghost">Explore Our Products</a>
        </div>
        <p className="mt-10 font-mono text-[11px] tracking-[0.12em] text-bbw-muted">bbwmultiskillsltd@gmail.com</p>
      </div>
    </section>
  )
}
