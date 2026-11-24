import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

/** "← All work": the way back from a case study. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group mb-10 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-bbw-muted uppercase no-underline transition-colors duration-300 ease-soft hover:text-bbw-accent"
    >
      <ArrowLeft size={16} className="transition-transform duration-300 ease-soft group-hover:-translate-x-1" aria-hidden="true" />
      {children}
    </Link>
  )
}
