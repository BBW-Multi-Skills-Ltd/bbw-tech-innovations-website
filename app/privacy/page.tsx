import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the BBW Tech Innovations Privacy Policy.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy', title: 'Privacy Policy | BBW Tech Innovations', description: 'Read the BBW Tech Innovations Privacy Policy.' },
  twitter: { title: 'Privacy Policy | BBW Tech Innovations', description: 'Read the BBW Tech Innovations Privacy Policy.' },
}

export default async function PrivacyPolicyPage() {
  const { privacyPolicy: policy } = await getSiteContent()

  return (
    <main className="legal-page">
      <article className="legal-content">
        <Link href="/" className="legal-back">← Return to site</Link>
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-intro">{policy.introduction}</p>
        <p className="legal-date">Last updated: {policy.lastUpdated}</p>
        {policy.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      </article>
    </main>
  )
}
