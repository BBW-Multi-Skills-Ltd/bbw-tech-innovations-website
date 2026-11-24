'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  /** Position in a group; each step delays the reveal by 0.06s. */
  index?: number
  className?: string
  id?: string
}

/**
 * Fades content in and lifts it 24px, once, when 20% is visible (from the
 * portfolio). Styles in styles/case-study.css; content stays visible without
 * JS and with reduced motion.
 */
export function Reveal({ children, as: Tag = 'div', index = 0, className, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = ''
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} id={id} data-reveal="" className={className} style={{ '--reveal-index': index } as CSSProperties}>
      {children}
    </Tag>
  )
}
