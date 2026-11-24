// Prezpa: BBW's first full case study, in the agency layout. Rewritten for
// BBW (in "we" voice, for business owners) from the portfolio's Prezpa case
// study, wording approved by the owner (Nov 2026). Every fact is from that
// source; nothing is added. The technical deep-dives (hard problems,
// diagrams, deployment) are left out on purpose.
//
// Used when the database has no blocks for Prezpa (lib/case-studies/data.ts).
// No screenshots exist yet: the journey steps show numbered empty screens
// until real ones (1080 × 2280, lib/screens.ts) are added. The cover uses
// the project's card image (filled in at runtime).

import type { BundledBlock } from './types'

const steps = (...captions: string[]) => captions.map(caption => ({ caption, text: '', imageUrl: '' }))

export const prezpaBlocks: BundledBlock[] = [
  {
    type: 'cover',
    data: {
      label: 'Our product',
      summary: 'Your business profile, prices and work, shared by QR.',
      summaryAccent: 'Clients book on WhatsApp.',
      facts: [
        { label: 'Status', value: 'Live' },
        { label: 'Timeline', value: 'Development started 9 September 2026. Live on Google Play in October 2026, about six weeks to launch. Ongoing updates since.' },
        { label: 'Platforms', value: 'Android app on Google Play, the same app on the web, a marketing website, and an internal admin portal' },
        { label: 'What we did', value: 'Product, design, engineering, release and support' },
      ],
      links: [
        { label: 'Website and web app', url: 'https://prezpa.app' },
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.bbwmultiskills.prezpa' },
      ],
      mediaUrl: '',
    },
  },

  // The brief ------------------------------------------------------------------
  {
    type: 'text',
    section: 'The brief',
    data: {
      heading: 'The brief',
      body: 'Small Nigerian businesses and service providers, such as nail technicians, lash technicians, photographers, cinematographers and installers, sell mostly through WhatsApp and Instagram. Their prices, past work and contact details end up scattered across chats, statuses and DMs. Clients ask “how much?” again and again, and there’s no single, professional link or QR code to share.',
    },
  },
  {
    type: 'list',
    data: {
      heading: 'Who it’s for',
      intro: '',
      items: [
        { title: 'Business owners', text: 'create and manage their profile in the app.' },
        { title: 'Their clients', text: 'view it in any browser, with no app needed, and book on WhatsApp.' },
      ],
    },
  },

  // What we built --------------------------------------------------------------
  {
    type: 'text',
    section: 'What we built',
    data: {
      heading: 'What we built',
      body: 'Prezpa gives small businesses one professional home: who they are, what they offer, what it costs and what their work looks like. They share it as a QR code, a link (prezpa.app/u/username) or an NFC card. Their clients open it in any browser and tap one button to book on WhatsApp.',
    },
  },
  {
    type: 'flow',
    data: {
      heading: '',
      number: '1',
      title: 'A business owner sets up one professional home for their business.',
      note: 'Then they add services and ₦ prices, portfolio photos (camera or gallery, crop, tag by service), links, and an “Open for bookings” switch.',
      steps: steps(
        'Welcome: “Your business, one tap away”',
        'Business name and username',
        '“What services do you offer?” (pick up to 3)',
        '“Make it recognisable”: logo and cover',
        '“Your WhatsApp number” (+234)',
        'Optional links (“you can change these anytime”)',
        '“You’re live!”',
      ),
      business: '[Result to add, e.g. profiles created]',
    },
  },
  {
    type: 'flow',
    data: {
      heading: '',
      number: '2',
      title: 'One QR code, link or NFC card shares the whole business.',
      note: '',
      steps: steps('Open the QR code', 'Save or share it, copy the link, or write it to an NFC card'),
      business: '[Result to add, e.g. QR scans]',
    },
  },
  {
    type: 'flow',
    data: {
      heading: '',
      number: '3',
      title: 'Clients see the work and prices, then book on WhatsApp with one tap, with no app to install.',
      note: 'Clients can also report a profile.',
      steps: steps('Scan the QR code or open the link', 'See the work, services and prices', 'Tap “Book on WhatsApp”', 'WhatsApp opens with the business'),
      business: '[Result to add, e.g. WhatsApp taps]',
    },
  },
  {
    type: 'flow',
    data: {
      heading: '',
      number: '4',
      title: 'Owners get help inside the app, and know the moment support replies.',
      note: '',
      steps: steps(
        'Settings → Support',
        'Choose a topic',
        'Send a message or photo',
        'Support replies from the admin portal',
        'The owner gets a push notification; tapping it opens the chat',
      ),
      business: '[Result to add, e.g. support chats answered]',
    },
  },
  {
    type: 'groups',
    data: {
      heading: 'Also in the app',
      intro: '',
      style: 'chips',
      groups: [
        {
          title: '',
          items: [
            'Services and prices in Naira (₦)',
            'Portfolio of up to 12 photos',
            'WhatsApp, website and social links',
            'Activity: views, QR scans, WhatsApp taps',
            'Testimonials and referrals',
            'Report, block and moderation',
            'Account management',
            'Web login',
            'Light and dark theme',
          ],
        },
      ],
    },
  },
  {
    type: 'list',
    data: {
      heading: 'Built for how Nigerian businesses work',
      intro: '',
      items: [
        { title: '₦ pricing', text: 'throughout.' },
        { title: '+234 WhatsApp numbers', text: 'checked against real mobile prefixes, with every format saved the same way.' },
        { title: 'WhatsApp', text: 'as the booking channel.' },
        { title: 'One phone-sized layout', text: 'on every screen.' },
        { title: 'Sign-up in the app.', text: 'The website explains how to get it, and existing users can log in on the web.' },
      ],
    },
  },

  // The result -----------------------------------------------------------------
  {
    type: 'list',
    section: 'The result',
    data: {
      heading: 'The result',
      intro: '',
      showPlaceholders: true,
      items: [
        { title: '', text: 'Live on Google Play in October 2026, about six weeks after development started.' },
        { title: '', text: 'The web app, marketing website and admin portal are live at prezpa.app.' },
        { title: '', text: 'The first update shipped based on real user feedback: support notifications, fixes for small phones and tablets, and a smaller app.' },
        { title: '', text: '[Numbers to add: profiles created, downloads, QR scans, WhatsApp taps, support chats]' },
      ],
    },
  },

  // The team, then Built with --------------------------------------------------
  {
    type: 'groups',
    section: 'Team',
    data: {
      heading: 'The team',
      intro: '',
      groups: [
        { title: 'Product & design', items: ['The product for Nigerian small businesses', 'The user flows', 'The visual system'] },
        {
          title: 'App & web',
          items: [
            'One codebase for the Android app and the web app',
            'Photo upload, QR and NFC sharing, and activity tracking',
            'Live support chat with push notifications',
          ],
        },
        {
          title: 'Data & security',
          items: [
            'Each user can only ever reach their own data',
            '37 versioned database changes and 20 test files covering permissions and business rules',
            'Private files served through expiring links',
          ],
        },
        {
          title: 'Admin portal & website',
          items: [
            'A marketing site edited live from the admin',
            'An admin portal with two-step sign-in, a live support inbox and a content manager',
          ],
        },
        { title: 'Release & support', items: ['Shipped to Google Play and handled its quality reviews', 'Error monitoring', 'Answering users through in-app support'] },
      ],
    },
  },
  {
    type: 'text',
    data: {
      heading: 'How we worked',
      body: 'We used AI pair-programming (Claude Code) to build faster, while owning the product decisions, architecture, reviews, testing on real phones and releases.',
    },
  },
  {
    type: 'groups',
    section: 'Built with',
    data: {
      heading: 'Built with',
      intro: '',
      style: 'chips',
      groups: [{ title: '', items: ['Expo & React Native', 'Supabase', 'Cloudflare', 'Vite & React', 'Firebase Cloud Messaging', 'Sentry'] }],
    },
  },
]
