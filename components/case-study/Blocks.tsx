import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { LaptopFrame } from '@/components/LaptopFrame'
import { PhoneFrame } from '@/components/PhoneFrame'
import { Reveal } from '@/components/Reveal'
import type { Devices } from '@/lib/project-types'
import { isPlaceholder, realValue, shownText } from '@/lib/case-studies/text'
import type { Block, BlockData } from '@/lib/case-studies/types'
import { DemoVideo } from './DemoVideo'
import { DeviceFrame, type FrameKind } from './DeviceFrame'
import { DiagramFigure } from './DiagramFigure'
import { FlowJourney } from './FlowJourney'
import { JourneyDeviceToggle } from './JourneyDeviceToggle'
import { QrCode } from './QrCode'
import { Inline, RichText } from './RichText'

// The case study blocks (ported from the portfolio, in BBW's brand).

export const sectionId = (label: string) => `cs-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

/** Hero device sizes: a phone takes the column's height; a laptop its width. */
const frameSize: Record<FrameKind, string> = {
  phone: 'h-[min(440px,56svh)] min-[961px]:h-full',
  desktop: 'w-full max-w-[560px]',
  none: 'max-h-[min(440px,56svh)] w-auto max-w-full min-[961px]:max-h-full',
}

/** One row of facts on wide screens (up to five across), so no cell is left empty. */
const WIDE_FACT_COLUMNS = ['', 'min-[1100px]:grid-cols-1', 'min-[1100px]:grid-cols-2', 'min-[1100px]:grid-cols-3', 'min-[1100px]:grid-cols-4', 'min-[1100px]:grid-cols-5']

const PHONE_ONLY: Devices = { hero: 'phone', journeys: 'phone' }

const tile = 'rounded-[10px] border border-bbw-border bg-bbw-surface'
const label = 'font-mono text-[11px] tracking-[0.14em] text-bbw-muted uppercase'
const bodyText = 'text-[17px] leading-relaxed text-bbw-fg/80'

/**
 * How a block sits in its section: `true` starts a section (big h2), "intro"
 * is the first block before any section (an h2 at sub-heading size, so the
 * heading levels never skip), `false` is any later block (h3).
 */
type SectionRole = boolean | 'intro'

function Heading({ text, section }: { text: string; section: SectionRole }) {
  const shown = shownText(text)
  if (!shown) return null
  if (section === true)
    return <h2 className="mb-8 font-display text-[clamp(34px,4vw,56px)] leading-[1.02] font-bold tracking-[-0.03em] text-balance text-bbw-fg">{shown}</h2>
  const Tag = section === 'intro' ? 'h2' : 'h3'
  return <Tag className="mb-6 font-display text-[clamp(24px,2.4vw,34px)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-bbw-fg">{shown}</Tag>
}

export function CaseStudyBlock({ block, section, devices = PHONE_ONLY, lazyDiagrams = false }: { block: Block; section: SectionRole; devices?: Devices; lazyDiagrams?: boolean }) {
  switch (block.type) {
    case 'cover':
      return null // rendered by the page header
    case 'tldr':
      return <Tldr data={block.data} section={section} />
    case 'text':
      return <TextBlock data={block.data} section={section} />
    case 'list':
      return <ListBlock data={block.data} section={section} />
    case 'groups':
      return <GroupsBlock data={block.data} section={section} />
    case 'flow':
      return <FlowBlock data={block.data} section={section} device={devices.journeys} />
    case 'video':
      return <VideoBlock data={block.data} section={section} devices={devices} />
    case 'stack_table':
      return <StackTable data={block.data} section={section} />
    case 'diagram':
      // Stored diagrams fetch their drawing from /diagrams/[id]; others carry it inline.
      return <DiagramBlock data={block.data} section={section} src={lazyDiagrams && !block.id.startsWith('derived-') ? `/diagrams/${block.id}` : undefined} />
    case 'problem':
      return <ProblemCard data={block.data} section={section} />
    case 'gallery':
      return <GalleryBlock data={block.data} section={section} />
    case 'review':
      return <ReviewBlock data={block.data} section={section} />
  }
}

// Cover ------------------------------------------------------------------------

/** A screenshot filling a frame's screen, or the fallback (the drawn preview). */
function Shot({ src, alt, fallback }: { src: string | null; alt: string; fallback?: ReactNode }) {
  if (!src) return <>{fallback}</>
  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded (Cloudinary or any URL)
  return <img src={src} alt={alt} fetchPriority="high" className="absolute inset-0 size-full object-cover object-top" />
}

/**
 * Website + app projects (from the portfolio): the laptop with the phone
 * standing in front of its bottom-right corner, so both screens stay readable.
 */
function LaptopAndPhone({ name, desktop, phone, fallback }: { name: string; desktop: string | null; phone: string | null; fallback?: (kind: 'phone' | 'desktop') => ReactNode }) {
  return (
    <div className="relative w-full max-w-[560px] pr-[9%] pb-[7%]">
      <LaptopFrame className="w-full">
        <Shot src={desktop} alt={`${name} on desktop`} fallback={fallback?.('desktop')} />
      </LaptopFrame>
      <div className="absolute right-0 bottom-0 w-[23%]">
        <PhoneFrame className="w-full">
          <Shot src={phone} alt={`${name} on a phone`} fallback={fallback?.('phone')} />
        </PhoneFrame>
      </div>
    </div>
  )
}

export function Cover({
  name,
  data,
  back,
  devices = PHONE_ONLY,
  fallbackScreen,
}: {
  name: string
  data: BlockData['cover']
  back?: ReactNode
  devices?: Devices
  /** BBW: fills the device until real screenshots exist (the project's drawn preview). */
  fallbackScreen?: (kind: 'phone' | 'desktop') => ReactNode
}) {
  const links = data.links.filter(link => realValue(link.url))
  const media = realValue(data.mediaUrl)
  const choice = data.mockupFrame ?? 'auto'
  const frame: FrameKind = choice === 'auto' ? (devices.hero === 'desktop' ? 'desktop' : 'phone') : choice
  const shownFrame: FrameKind = media || frame !== 'none' ? frame : 'phone'
  // Website + app projects: the laptop and the phone together (unless a frame is chosen).
  const both = choice === 'auto' && devices.hero === 'both'
  const desktopMedia = realValue(data.desktopMediaUrl ?? '')
  const qr = realValue(data.qrUrl ?? '')
  const facts = data.facts.filter(fact => shownText(fact.value))
  return (
    <header className="container-site pt-28 pb-12 min-[961px]:pt-32">
      {/* The device spans the whole text column, back link included, so it never pushes the text down. */}
      <div className="grid items-center gap-12 min-[961px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          {back}
          <Reveal>
            {shownText(data.label) ? <p className="font-mono text-[11px] tracking-[0.16em] text-bbw-accent uppercase">{data.label}</p> : null}
            <h1 className="mt-5 font-display text-[clamp(52px,7.4vw,104px)] leading-[0.95] font-bold tracking-[-0.035em] text-bbw-fg">{name}</h1>
            {shownText(data.summary) ? (
              <p className="mt-6 max-w-[34ch] font-display text-[clamp(22px,2.4vw,34px)] leading-[1.2] font-semibold tracking-[-0.01em] text-bbw-fg/80">
                {data.summary} {data.summaryAccent ? <em className="text-bbw-accent">{data.summaryAccent}</em> : null}
              </p>
            ) : null}
          </Reveal>
          {links.length || qr ? (
            <Reveal index={1} className="mt-9 flex flex-wrap items-center gap-6">
              {links.length ? (
                <div className="flex flex-wrap gap-3">
                  {links.map((link, i) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className={`${i === 0 ? 'btn-primary' : 'btn-ghost'} gap-2`}>
                      {link.label}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
              {qr ? <QrCode url={qr} /> : null}
            </Reveal>
          ) : null}
        </div>

        {/* Not faded in: it's the first thing people see (the page's largest paint). */}
        {both ? (
          <div className="relative flex justify-center min-[961px]:self-stretch">
            <div className="flex w-full items-center justify-center min-[961px]:absolute min-[961px]:inset-x-0 min-[961px]:-top-6 min-[961px]:-bottom-10">
              {/* The card image goes on the laptop (or the desktop screenshot, when there is one); the phone gets the phone shot or the drawn preview. */}
              <LaptopAndPhone
                name={name}
                desktop={desktopMedia ?? media}
                phone={desktopMedia ? media : null}
                fallback={fallbackScreen}
              />
            </div>
          </div>
        ) : (
        <div className="relative flex justify-center min-[961px]:self-stretch">
          <div className={`flex w-full justify-center min-[961px]:absolute min-[961px]:inset-x-0 min-[961px]:-top-6 min-[961px]:-bottom-10 ${shownFrame === 'desktop' ? 'items-center' : ''}`}>
            <DeviceFrame
              kind={shownFrame}
              src={media}
              alt={`${name} screens`}
              className={frameSize[shownFrame]}
              fallback={shownFrame === 'none' ? null : fallbackScreen?.(shownFrame)}
            />
          </div>
        </div>
        )}
      </div>

      {facts.length ? (
        <Reveal index={2}>
          <dl className={`mt-14 grid gap-px overflow-hidden rounded-[10px] border border-bbw-border bg-bbw-border min-[640px]:grid-cols-2 ${WIDE_FACT_COLUMNS[Math.min(facts.length, 5)]}`}>
            {facts.map((fact, i) => (
              // Two columns with an odd count: the last fact spans the row (no empty cell).
              <div key={fact.label} className={`bg-bbw-surface p-6 ${facts.length % 2 && i === facts.length - 1 ? 'min-[640px]:max-[1099px]:col-span-2' : ''}`}>
                <dt className={label}>{fact.label}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-bbw-fg">
                  <Inline text={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ) : null}
    </header>
  )
}

// Blocks -----------------------------------------------------------------------

function Tldr({ data, section }: { data: BlockData['tldr']; section: SectionRole }) {
  const tiles = [
    { label: 'The problem', text: data.problem, accent: false },
    { label: 'What we built', text: data.built, accent: false },
    { label: 'The result', text: data.result, accent: true },
  ].filter(t => shownText(t.text))
  if (!tiles.length) return null
  return (
    <div>
      <Heading text={data.heading} section={section} />
      <div className="grid gap-4 min-[961px]:grid-cols-3">
        {tiles.map((t, i) => (
          <Reveal key={t.label} index={i} className={`rounded-[10px] p-7 ${t.accent ? 'bg-bbw-accent text-white' : tile}`}>
            <p className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.accent ? 'opacity-80' : 'text-bbw-muted'}`}>{t.label}</p>
            <p className={`mt-4 text-[17px] leading-relaxed ${t.accent ? '' : 'text-bbw-fg/80'}`}>{t.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function TextBlock({ data, section }: { data: BlockData['text']; section: SectionRole }) {
  if (shownText(data.body) === null) return null
  return (
    <Reveal>
      <Heading text={data.heading} section={section} />
      <RichText text={data.body} className={`max-w-[65ch] ${bodyText}`} />
    </Reveal>
  )
}

function ListBlock({ data, section }: { data: BlockData['list']; section: SectionRole }) {
  const items = data.items.filter(item => shownText(item.title || item.text) !== null)
  if (!items.length) return null
  const titled = items.some(item => item.title)
  return (
    <div>
      <Reveal>
        <Heading text={data.heading} section={section} />
        {data.intro ? <RichText text={data.intro} className={`mb-6 max-w-[65ch] ${bodyText}`} /> : null}
      </Reveal>
      {data.numbered ? (
        // Numbered (BBW features): a grid of numbered tiles.
        <ol className="grid gap-4 min-[768px]:grid-cols-2">
          {items.map((item, i) => (
            <Reveal as="li" key={i} index={i % 2} className={`flex gap-4 p-6 ${tile}`}>
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md bg-bbw-accent font-mono text-[11px] font-bold text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                {item.title ? <h3 className="text-[16px] font-semibold text-bbw-fg">{item.title}</h3> : null}
                {item.text ? <p className="mt-1.5 text-[15px] leading-relaxed text-bbw-fg/75"><Inline text={item.text} /></p> : null}
              </div>
            </Reveal>
          ))}
        </ol>
      ) : titled ? (
        <Reveal>
          <ul className={`flex max-w-[65ch] flex-col gap-3 ${bodyText}`}>
            {items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-bbw-accent" />
                <span>
                  {item.title ? <strong className="font-semibold text-bbw-fg">{item.title}</strong> : null}
                  {item.title && item.text ? ' ' : null}
                  {item.text ? <Inline text={item.text} /> : null}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : (
        <Reveal>
          <RichText text={items.map(item => `- ${item.text}`).join('\n')} className={`max-w-[65ch] ${bodyText}`} />
        </Reveal>
      )}
    </div>
  )
}

function GroupsBlock({ data, section }: { data: BlockData['groups']; section: SectionRole }) {
  const groups = data.groups.filter(group => group.items.length)
  if (!groups.length) return null
  // Single-word items (or style "chips") read best as chips in tiles; else read through.
  const chips = data.style === 'chips' || groups.every(group => group.items.every(item => !/\s/.test(item)))
  if (!chips) return <GroupsReadThrough data={{ ...data, groups }} section={section} />
  const single = groups.length === 1
  return (
    <div>
      <Reveal>
        <Heading text={data.heading} section={section} />
        {data.intro ? <RichText text={data.intro} className={`mb-8 max-w-[65ch] ${bodyText}`} /> : null}
      </Reveal>
      <div className={`grid gap-4 ${single ? '' : 'min-[640px]:grid-cols-2 min-[1100px]:grid-cols-3'}`}>
        {groups.map((group, i) => (
          <Reveal key={`${group.title}-${i}`} index={i % 3} className={`p-6 ${tile}`}>
            {group.title ? <h3 className="text-[16px] font-semibold text-bbw-fg">{group.title}</h3> : null}
            <ul className={`flex flex-wrap gap-2 ${group.title ? 'mt-4' : ''}`}>
              {group.items.map(item => (
                <li key={item} className="rounded-full border border-bbw-border bg-bbw-surface2 px-3 py-1 font-mono text-[12px] text-bbw-fg/80">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/** Groups read top to bottom: a numbered title, a subtitle (the part in brackets), then bullets. */
function GroupsReadThrough({ data, section }: { data: BlockData['groups']; section: SectionRole }) {
  return (
    <div className="max-w-[65ch]">
      <Reveal>
        <Heading text={data.heading} section={section} />
        {data.intro ? <RichText text={data.intro} className={bodyText} /> : null}
      </Reveal>
      <div className={`flex flex-col gap-12 ${data.heading || data.intro ? 'mt-12' : ''}`}>
        {data.groups.map((group, i) => {
          const [, title, subtitle] = group.title.match(/^(.*?)\s*\((.+)\)$/) ?? [null, group.title, '']
          return (
            <Reveal key={`${group.title}-${i}`}>
              {data.groups.length > 1 ? <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-bbw-accent uppercase">{String(i + 1).padStart(2, '0')}</p> : null}
              <h3 className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.08] font-bold tracking-[-0.02em] text-bbw-fg">{title}</h3>
              {subtitle ? <p className={`mt-2 ${label}`}>{subtitle}</p> : null}
              <RichText text={group.items.map(item => `- ${item}`).join('\n')} className={`mt-5 ${bodyText}`} />
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

function FlowBlock({ data, section, device }: { data: BlockData['flow']; section: SectionRole; device: Devices['journeys'] }) {
  if (!data.steps.length) return null
  return (
    <div>
      <Reveal>
        <Heading text={data.heading} section={section} />
        <p className="font-mono text-[11px] tracking-[0.14em] text-bbw-accent uppercase">Feature {data.number.padStart(2, '0')}</p>
        <h3 className="mt-3 font-display text-[clamp(28px,3vw,42px)] leading-[1.04] font-bold tracking-[-0.03em] text-bbw-fg">{data.title}</h3>
        {data.intro ? <p className={`mt-4 max-w-[60ch] ${bodyText}`}>{data.intro}</p> : null}
        {device === 'both' ? <JourneyDeviceToggle /> : null}
      </Reveal>
      <FlowJourney title={data.title} steps={data.steps} device={device} />
      {data.note ? <p className="mt-10 max-w-[65ch] text-[15px] leading-relaxed text-bbw-muted">{data.note}</p> : null}
    </div>
  )
}

/**
 * The demo ("See it in action"), played inside the project's device: a phone
 * for apps and PWAs, a laptop for websites and combined projects. It never
 * autoplays; the poster is the card image.
 */
function VideoBlock({ data, section, devices }: { data: BlockData['video']; section: SectionRole; devices: Devices }) {
  const video = realValue(data.videoUrl)
  if (!video) return null
  const choice = data.frame ?? 'auto'
  const frame = choice === 'auto' ? (devices.hero === 'phone' ? 'phone' : 'desktop') : choice
  const player = <DemoVideo url={video} poster={realValue(data.posterUrl)} title={shownText(data.heading) ?? 'Demo'} fill={frame !== 'none'} />
  return (
    <Reveal>
      <Heading text={data.heading} section={section} />
      {frame === 'phone' ? (
        <PhoneFrame className="mx-auto h-[min(620px,78svh)]">{player}</PhoneFrame>
      ) : frame === 'desktop' ? (
        <LaptopFrame className="mx-auto w-full max-w-[880px]">{player}</LaptopFrame>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-bbw-border bg-bbw-surface2">{player}</div>
      )}
      {data.caption ? <p className="mx-auto mt-6 max-w-[65ch] text-center text-[15px] leading-relaxed text-bbw-muted">{data.caption}</p> : null}
    </Reveal>
  )
}

function StackTable({ data, section }: { data: BlockData['stack_table']; section: SectionRole }) {
  if (!data.rows.length) return null
  return (
    <div>
      <Reveal>
        <Heading text={data.heading} section={section} />
      </Reveal>
      <Reveal>
        <dl className="overflow-hidden rounded-[10px] border border-bbw-border">
          {data.rows.map((row, i) => (
            <div key={row.tech} className={`grid gap-2 p-5 min-[961px]:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] min-[961px]:gap-8 min-[961px]:px-7 ${i % 2 ? 'bg-bbw-surface2' : 'bg-bbw-surface'}`}>
              <dt className="text-[16px] font-semibold text-bbw-fg">{row.tech}</dt>
              <dd className="text-[15px] leading-relaxed text-bbw-fg/80">
                <Inline text={row.why} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  )
}

function DiagramBlock({ data, section, src }: { data: BlockData['diagram']; section: SectionRole; src?: string }) {
  return (
    <Reveal>
      <Heading text={data.heading} section={section} />
      <DiagramFigure data={data} src={src} />
    </Reveal>
  )
}

function ProblemCard({ data, section }: { data: BlockData['problem']; section: SectionRole }) {
  const parts = [
    { label: 'Problem', text: data.problem },
    { label: 'Investigation', text: data.investigation },
    { label: 'Fix', text: data.fix },
    { label: 'Result', text: data.result, accent: true },
  ].filter(part => shownText(part.text))
  return (
    <div>
      <Reveal>
        <Heading text={data.heading} section={section} />
      </Reveal>
      <Reveal className={`p-6 min-[640px]:p-8 ${tile}`}>
        <h4 className="flex items-baseline gap-4 font-display text-[clamp(22px,2.2vw,30px)] leading-tight font-bold tracking-[-0.02em] text-bbw-fg">
          <span className="font-mono text-[13px] text-bbw-accent">{data.number.padStart(2, '0')}</span>
          {data.title}
        </h4>
        <dl className="mt-6 grid gap-6 min-[720px]:grid-cols-2">
          {parts.map(part => (
            <div key={part.label}>
              <dt className={`font-mono text-[11px] tracking-[0.14em] uppercase ${part.accent ? 'text-bbw-accent' : 'text-bbw-muted'}`}>{part.label}</dt>
              <dd className={`mt-2 text-[15px] leading-relaxed ${part.accent ? 'text-bbw-fg' : 'text-bbw-fg/80'}`}>
                <Inline text={part.text} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  )
}

function GalleryBlock({ data, section }: { data: BlockData['gallery']; section: SectionRole }) {
  const images = data.images.filter(image => realValue(image.url))
  if (!images.length) return null
  return (
    <div>
      <Reveal>
        <Heading text={data.heading} section={section} />
      </Reveal>
      <ul className="grid gap-4 min-[720px]:grid-cols-2">
        {images.map((image, i) => (
          <Reveal as="li" key={image.url} index={i % 2}>
            <figure className={`overflow-hidden ${tile}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded, size unknown */}
              <img src={image.url} alt={image.caption || ''} loading="lazy" className="w-full" />
              {image.caption ? <figcaption className="p-4 text-[14px] text-bbw-muted">{image.caption}</figcaption> : null}
            </figure>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

/** BBW: a client's review, as the project popup showed it. */
function ReviewBlock({ data, section }: { data: BlockData['review']; section: SectionRole }) {
  if (isPlaceholder(data.quote)) return null
  return (
    <Reveal>
      <Heading text={data.heading} section={section} />
      <figure className="max-w-[60ch] rounded-[10px] border-l-2 border-bbw-accent bg-bbw-accent-dim px-7 py-6">
        <blockquote className="font-display text-[clamp(19px,1.8vw,24px)] leading-[1.55] text-bbw-fg italic">“{data.quote}”</blockquote>
        <figcaption className="mt-5 flex flex-col gap-1">
          <strong className="text-[14px] font-semibold text-bbw-accent">{data.clientName || 'Client'}</strong>
          {shownText(data.clientRole) ? <span className="text-[13px] text-bbw-muted">{data.clientRole}</span> : null}
        </figcaption>
      </figure>
    </Reveal>
  )
}
