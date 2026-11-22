'use client'

import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'
import { InlineScript } from '@/components/InlineScript'
import { StartProjectButton } from '@/components/home/SiteActions'
import { FlatLogo } from '@/components/logo3d/FlatLogo'
import { SceneBoundary } from '@/components/logo3d/SceneBoundary'
import { StillLogo } from '@/components/logo3d/StillLogo'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { placeLogoScript } from './logo-size'
import { useHeroStart } from './useHeroStart'
import { DUST_PUFFS, useLogoWalk } from './useLogoWalk'

// three.js only reaches the browser on desktop with working WebGL.
const HeroLogoScene = dynamic(() => import('@/components/logo3d/HeroLogoScene'), { ssr: false })

const GIANT_WORD = 'BBW TECH'
const GREETINGS = ['Hello!', 'Hi there!', 'Welcome to BBW Tech!', 'Let’s build something.']

/**
 * The homepage hero: the giant word behind, the floor line, and the 3D BBW
 * logo standing on it; click (or touch) and hold the logo to drag it along.
 * Built like the portfolio's GuideHero. The walk is in useLogoWalk, the
 * start-up in useHeroStart.
 */
export default function BrandHero() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { introIn, load3D, noWebGL, onScreen } = useHeroStart(section)
  const { floorRef, lettersRef, flatRef, shadowRef, bubbleRef, dustRef, grabRef, pose, held, dragHandlers } = useLogoWalk({
    section,
    introIn,
    onScreen,
    reduced,
    greetings: GREETINGS,
  })

  const [ready, setReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const failed = noWebGL || sceneFailed
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => {
    setSceneFailed(true)
    setReady(false)
  }, [])
  const frameloop = !onScreen ? 'never' : reduced && ready && !held ? 'demand' : 'always'

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className={`guide-hero relative h-svh min-h-[560px] overflow-hidden ${introIn ? 'is-in' : ''} ${onScreen ? '' : 'is-paused'}`}
    >
      {/* Background: two slow, heavily blurred brand-blue glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="gh-glow gh-glow-a absolute top-[8%] left-[12%] size-[42vw] rounded-full bg-bbw-accent" />
        <div className="gh-glow gh-glow-b absolute right-[6%] bottom-[14%] size-[36vw] rounded-full bg-bbw-accent" />
      </div>

      {/* Giant word behind everything */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[14vh] flex justify-center font-display text-[15.5vw] leading-[0.8] font-bold tracking-[-0.03em] whitespace-nowrap uppercase select-none min-[640px]:text-[clamp(120px,15.5vw,300px)]"
      >
        {GIANT_WORD.split('').map((char, i) => (
          <span key={i} ref={n => { lettersRef.current[i] = n }} className="inline-block will-change-transform">
            <span
              className="gh-letter inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to bottom, color-mix(in oklab, var(--bbw-fg) 11%, transparent), transparent 92%)',
                ['--i' as string]: i,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          </span>
        ))}
      </p>

      {/* The logo layer: 3D canvas (full size, transparent) + still/flat fallback */}
      <div aria-hidden className="gh-logo pointer-events-none absolute inset-0 z-10">
        <div ref={shadowRef} className="absolute top-0 left-0 h-5 rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.45),transparent)]" />
        {Array.from({ length: DUST_PUFFS }, (_, i) => (
          <span
            key={i}
            ref={n => { dustRef.current[i] = n }}
            className="absolute top-0 left-0 size-2.5 rounded-full bg-bbw-muted opacity-0"
          />
        ))}
        <div
          ref={flatRef}
          data-gh-flat=""
          // placeLogoScript sets its style before React loads; the loop then owns it.
          suppressHydrationWarning
          className={`absolute top-0 left-0 origin-bottom transition-opacity duration-600 ease-soft ${ready ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* No WebGL: the flat SVG in brand blue (the still is a 3D render). */}
          {noWebGL ? <FlatLogo className="w-full" /> : <StillLogo className="w-full" priority />}
        </div>
        {load3D && !failed ? (
          <div className={`absolute inset-0 transition-opacity duration-600 ease-soft ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <SceneBoundary onError={onError}>
              <HeroLogoScene pose={pose} frameloop={frameloop} onReady={onReady} />
            </SceneBoundary>
          </div>
        ) : null}
        <div
          ref={grabRef}
          {...dragHandlers}
          className="pointer-events-auto absolute top-0 left-0 cursor-grab touch-pan-y active:cursor-grabbing"
        />
      </div>

      {/* Speech bubble beside the logo while it says hello */}
      <div
        ref={bubbleRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 rounded-full border border-bbw-border-hi bg-bbw-surface px-4 py-2 font-display text-[19px] whitespace-nowrap text-bbw-fg italic opacity-0 shadow-lg transition-opacity duration-300 ease-soft"
      />

      {/* Floor line + what sits under it */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div ref={floorRef} data-gh-floor="" className="gh-floor h-px bg-bbw-border-hi" />
        <div className="mx-auto flex min-h-[clamp(118px,17vh,170px)] w-full max-w-[1200px] flex-col justify-center gap-5 px-[clamp(20px,5vw,80px)] py-6 min-[1360px]:px-0 min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between">
          <div className="gh-rise max-w-[52ch]">
            <h1 id="hero-title" className="font-display text-[30px] leading-none font-bold tracking-[-0.02em] text-bbw-fg min-[960px]:text-[36px]">
              BBW Tech <em className="text-bbw-accent">Innovations</em>
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-bbw-muted min-[960px]:text-[16px]">
              We build websites, applications, SaaS products, and intelligent digital systems for businesses ready to grow.
            </p>
          </div>
          <div className="gh-rise flex shrink-0 gap-2.5 min-[400px]:gap-3">
            <StartProjectButton className="btn-primary flex-1 justify-center whitespace-nowrap px-5 min-[640px]:flex-none min-[640px]:px-7" />
            <a href="#work" className="btn-ghost flex-1 justify-center whitespace-nowrap px-5 min-[640px]:flex-none min-[640px]:px-7">Our Work</a>
          </div>
        </div>
      </div>
      {/* Places the still logo before the first paint (it is the page's
          largest paint on phones); the walk takes over from the same spot. */}
      <InlineScript html={placeLogoScript} />
    </section>
  )
}
