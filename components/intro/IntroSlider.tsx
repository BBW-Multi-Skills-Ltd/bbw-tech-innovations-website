'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Children, useEffect, useRef, type ReactNode } from 'react'
import AnimatedHeroGrid from '@/components/hero/AnimatedHeroGrid'
import { DESKTOP_PIN_MEDIA, PHONE_SLIDES_MEDIA, phoneSlides, refreshSoon } from '@/lib/phone-slides'

gsap.registerPlugin(ScrollTrigger)

/**
 * The intro slides after the 3D hero (built like the portfolio's Hero). On
 * wide screens the section pins and vertical scroll moves the panels
 * sideways, then releases. Phones and tablets do the same with a CSS sticky
 * hold (lib/phone-slides.ts). Reduced motion: they stack. The animated
 * background sits in the part that holds still, so the panels slide over it.
 */
export function IntroSlider({ children }: { children: ReactNode }) {
  const panelCount = Children.count(children)
  const rootRef = useRef<HTMLElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const stick = stickRef.current
    const track = trackRef.current
    if (!root || !stick || !track) return

    const showProgress = (progress: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      if (counterRef.current) {
        const panel = Math.round(progress * (panelCount - 1)) + 1
        counterRef.current.textContent = String(panel).padStart(2, '0')
      }
    }

    const mm = gsap.matchMedia()
    mm.add(DESKTOP_PIN_MEDIA, () => {
      const distance = () => track.scrollWidth - root.clientWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => showProgress(progress),
        },
      })
    })

    mm.add(PHONE_SLIDES_MEDIA, () => {
      const panels = Array.from(track.querySelectorAll<HTMLElement>('.intro-panel'))
      return phoneSlides({
        run: root,
        stick,
        track,
        steps: panelCount - 1,
        distance: () => track.scrollWidth - stick.clientWidth,
        // Every slide's content fits on the screen, inside the panel padding.
        fits: () =>
          panels.every(panel => {
            const style = getComputedStyle(panel)
            const room = stick.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
            return (panel.firstElementChild as HTMLElement).offsetHeight <= room + 1
          }),
        onProgress: showProgress,
      })
    })

    // Web fonts change panel widths and heights; measure again once loaded.
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && refreshSoon())

    return () => {
      cancelled = true
      mm.revert()
    }
  }, [panelCount])

  return (
    <section ref={rootRef} id="intro" aria-label="Introduction" className="intro relative">
      {/* Its position and height come from styles/intro.css (Tailwind classes
          for them here would override the phone slides' sticky hold). */}
      <div ref={stickRef} className="intro-stick overflow-hidden">
        {/* Background: stays put while the panels slide across it */}
        <AnimatedHeroGrid />
        <div aria-hidden className="pointer-events-none absolute top-[15%] left-[40%] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(41,121,255,0.07)_0%,transparent_65%)]" />

        <div ref={trackRef} className="intro-track relative z-1">
          {children}
        </div>

        <div aria-hidden className="intro-progress pointer-events-none absolute inset-x-0 bottom-6 z-2 mx-auto w-full max-w-[1200px] items-center justify-between px-[clamp(20px,5vw,80px)] min-[1360px]:px-0 stick:bottom-4 stick:pr-[84px]">
          <span className="relative h-0.5 w-48 overflow-hidden rounded-full bg-bbw-border-hi">
            {/* Inline transform, not Tailwind's scale-x-0 (that uses the CSS `scale`
                property, which would multiply with the transform set on scroll). */}
            <span ref={barRef} className="absolute inset-0 origin-left bg-bbw-accent" style={{ transform: 'scaleX(0)' }} />
          </span>
          <span className="rounded-full border border-bbw-border-hi bg-bbw-surface/80 px-3 py-1 font-mono text-[12px] tracking-[0.12em] text-bbw-muted tabular-nums backdrop-blur-md">
            <span ref={counterRef} className="font-semibold text-bbw-fg">01</span> / {String(panelCount).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}

/** One slide. Its first child is measured to check it fits a phone screen. */
export function IntroPanel({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="group"
      aria-roledescription="panel"
      aria-label={label}
      className="intro-panel flex items-center py-20 min-[960px]:pt-24 min-[960px]:pb-20 short:pt-[76px] short:pb-[64px] stick:pt-[72px] stick:pb-14"
    >
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,5vw,80px)] min-[1360px]:px-0">{children}</div>
    </div>
  )
}
