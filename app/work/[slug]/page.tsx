import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CaseStudyArticle } from '@/components/case-study/CaseStudyArticle'
import HomeShell from '@/components/home/HomeShell'
import { getCaseStudy, getCaseStudySlugs } from '@/lib/case-studies/data'
import { shownText } from '@/lib/case-studies/text'

// Unknown slugs wait for the full render, so notFound() sends a real 404.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) return {}
  const { project } = study
  const description = shownText(project.shortDesc) ?? shownText(project.tagline) ?? undefined
  return {
    title: project.name,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: 'article', url: `/work/${slug}`, title: `${project.name} | BBW Tech Innovations`, description },
    twitter: { title: `${project.name} | BBW Tech Innovations`, description },
  }
}

export default function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  return (
    <HomeShell>
      <main>
        {/* The slug is read inside Suspense, so a click shows the page frame at once. */}
        <Suspense fallback={<CaseStudySkeleton />}>
          <CaseStudy params={params} />
        </Suspense>
      </main>
    </HomeShell>
  )
}

function CaseStudySkeleton() {
  return (
    <div aria-busy="true" className="container-site pt-36 pb-24">
      <span className="sr-only">Loading the case study…</span>
      <div className="h-3 w-40 animate-pulse rounded bg-bbw-surface2" />
      <div className="mt-6 h-[clamp(52px,7.4vw,104px)] w-[min(520px,80%)] animate-pulse rounded-2xl bg-bbw-surface2" />
      <div className="mt-8 h-6 w-[min(640px,90%)] animate-pulse rounded bg-bbw-surface2" />
      <div className="mt-12 h-40 animate-pulse rounded-[10px] bg-bbw-surface2" />
    </div>
  )
}

async function CaseStudy({ params }: { params: PageProps<'/work/[slug]'>['params'] }) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()
  return <CaseStudyArticle project={study.project} blocks={study.blocks} next={study.next} />
}
