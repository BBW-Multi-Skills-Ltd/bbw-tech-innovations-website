import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-[18px] font-mono text-[11px] tracking-[0.16em] text-bbw-accent uppercase">{children}</p>
}

/** Section title. Pass the max width as a Tailwind class, e.g. "max-w-[460px]". */
export default function SectionHeading({ children, className = 'max-w-[620px]' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(32px,4.5vw,54px)] leading-[1.08] font-bold tracking-[-0.025em] text-bbw-fg ${className}`}>
      {children}
    </h2>
  )
}
