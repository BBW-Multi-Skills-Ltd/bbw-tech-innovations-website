import type { ProcessStep } from '../content/process'
import { PROCESS_STEPS } from '../content/process'
import { TECHNOLOGIES } from '../content/site'

export interface LegalSection { heading: string; body: string }
export interface PrivacyPolicyContent { introduction: string; lastUpdated: string; sections: LegalSection[] }
export interface CompanyDetails { email: string; location: string }

export const defaultProcessSteps: ProcessStep[] = PROCESS_STEPS
export const defaultTechnologies = TECHNOLOGIES
export const defaultCompanyDetails: CompanyDetails = { email: 'bbwmultiskillsltd@gmail.com', location: 'Lagos, Nigeria' }
export const defaultPrivacyPolicy: PrivacyPolicyContent = {
  introduction: 'This policy explains how BBW Tech Innovations, the technology arm of BBW Multi-Skills Ltd, handles information submitted through this website.',
  lastUpdated: 'September 5, 2026',
  sections: [
    { heading: 'Information we collect', body: 'When you contact BBW Tech Innovations, we may collect your name, email address, phone number, project message, and any optional video you choose to submit.' },
    { heading: 'How we use information', body: 'We use enquiry information to review your request, communicate with you, prepare a proposal where appropriate, and operate and secure our website.' },
    { heading: 'Service providers', body: 'We use trusted service providers to operate the website and enquiries, including Vercel, Supabase, and Resend. They process data only as needed to provide their services.' },
    { heading: 'Sharing and retention', body: 'We do not sell personal information. We retain enquiry information only for as long as reasonably necessary for communication, record-keeping, legal obligations, and business operations.' },
    { heading: 'Your choices', body: 'You may ask us to access, correct, or delete personal information we hold about you, subject to applicable law and legitimate business requirements.' },
    { heading: 'Contact', body: 'For privacy questions or requests, email bbwmultiskillsltd@gmail.com.' },
  ],
}
