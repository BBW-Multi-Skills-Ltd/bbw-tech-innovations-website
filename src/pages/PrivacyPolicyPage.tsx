import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { defaultPrivacyPolicy } from '../data/siteContent'
import type { PrivacyPolicyContent } from '../data/siteContent'

export default function PrivacyPolicyPage() {
  const [policy, setPolicy] = useState<PrivacyPolicyContent>(defaultPrivacyPolicy)
  useEffect(() => {
    document.title = 'Privacy Policy | BBW Tech Innovations'
    return () => { document.title = 'BBW Tech Innovations' }
  }, [])
  useEffect(() => {
    void import('../features/cms/contentRepository').then(({ fetchPrivacyPolicy }) => fetchPrivacyPolicy(defaultPrivacyPolicy)).then(setPolicy).catch(() => undefined)
  }, [])

  return (
    <main className="legal-page">
      <article className="legal-content">
        <Link to="/" className="legal-back">← Return to site</Link>
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-intro">{policy.introduction}</p>
        <p className="legal-date">Last updated: {policy.lastUpdated}</p>
        {policy.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      </article>
    </main>
  )
}
