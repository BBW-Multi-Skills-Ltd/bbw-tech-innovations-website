import { StartProjectButton } from '@/components/home/SiteActions'
import AnimatedHeroGrid from '@/components/hero/AnimatedHeroGrid'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-[clamp(20px,5vw,80px)] pt-[clamp(72px,6vw,88px)] pb-20">
      <AnimatedHeroGrid />
      <div className="pointer-events-none absolute top-[15%] left-[40%] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(41,121,255,0.07)_0%,transparent_65%)]" />
      <div className="relative z-1 mx-auto w-full max-w-[1200px]">
        <div className="mb-11 inline-flex items-center gap-2 rounded-full border border-bbw-border px-3.5 py-[5px] font-mono text-[11px] tracking-[0.14em] text-bbw-muted">
          <span className="inline-block h-1.5 w-1.5 animate-[dot-pulse_2.2s_ease-in-out_infinite] rounded-full bg-bbw-accent" />
          A BBW Multi-Skills Ltd Company
        </div>
        <h2 className="mb-7 font-display text-[clamp(44px,8vw,96px)] leading-[1.02] font-bold tracking-[-0.035em] text-bbw-fg">
          We Build Technology<br />That Moves Businesses<br /><em className="text-bbw-accent">Forward.</em>
        </h2>
        <p className="mb-11 max-w-[560px] text-[clamp(16px,2vw,19px)] leading-[1.7] text-bbw-muted">
          BBW Tech Innovations designs and develops websites, applications, SaaS products, and intelligent digital systems for businesses ready to grow.
        </p>
        <div className="mb-20 flex flex-wrap gap-3">
          <StartProjectButton />
          <a href="#work" className="btn-ghost">Explore Our Work</a>
        </div>
        <p className="font-mono text-[10px] tracking-[0.18em] text-bbw-muted uppercase">Built by Will. Powered by Skills.</p>
      </div>
    </section>
  )
}
