import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const sections = [
  ['Information we collect', 'When you contact BBW Tech Innovations, we may collect your name, email address, phone number, project message, and any optional video you choose to submit.'],
  ['How we use information', 'We use enquiry information to review your request, communicate with you, prepare a proposal where appropriate, and operate and secure our website.'],
  ['Service providers', 'We use trusted service providers to operate the website and enquiries, including Vercel, Supabase, and Resend. They process data only as needed to provide their services.'],
  ['Sharing and retention', 'We do not sell personal information. We retain enquiry information only for as long as reasonably necessary for communication, record-keeping, legal obligations, and business operations.'],
  ['Your choices', 'You may ask us to access, correct, or delete personal information we hold about you, subject to applicable law and legitimate business requirements.'],
  ['Contact', 'For privacy questions or requests, email bbwmultiskillsltd@gmail.com.'],
]

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | BBW Tech Innovations'
    return () => { document.title = 'BBW Tech Innovations' }
  }, [])

  return (
    <main className="legal-page">
      <article className="legal-content">
        <Link to="/" className="legal-back">← Return to site</Link>
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-intro">This policy explains how BBW Tech Innovations, the technology arm of BBW Multi-Skills Ltd, handles information submitted through this website.</p>
        <p className="legal-date">Last updated: September 5, 2026</p>
        {sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
      </article>
    </main>
  )
}
