export type ProjectType = 'app' | 'website'
export type ProjectStatus = 'in-dev' | 'coming-soon' | 'testing' | 'beta' | 'live' | 'completed'
export type WorkBadge = 'website' | 'mobile-app'
export type PlatformAvailability = 'available' | 'coming-soon' | 'not-supported'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  'in-dev':      'In Development',
  'coming-soon': 'Coming Soon',
  'testing':     'Under Testing',
  'beta':        'Beta Access',
  'live':        'Live',
  'completed':   'Completed',
}

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  'in-dev':      '#F59E0B',
  'coming-soon': '#8B5CF6',
  'testing':     '#EAB308',
  'beta':        '#2979FF',
  'live':        '#22C55E',
  'completed':   '#22C55E',
}

export interface MockScreen {
  label: string
  colorA: string
  colorB: string
  colorC?: string
}

export interface Role {
  title: string
  desc: string
  icon: string
}

export interface Feature {
  name: string
  desc: string
}

export type ReviewSource = 'email' | 'whatsapp' | 'other'

export interface ClientReview {
  quote: string
  clientName: string
  clientRole?: string
  source?: ReviewSource
}

export interface Project {
  id: string
  type: ProjectType
  name: string
  tagline: string
  shortDesc: string
  about: string
  category: string
  status: ProjectStatus
  platform?: string
  androidAvailability?: PlatformAvailability
  iosAvailability?: PlatformAvailability
  siteUrl?: string
  accentColor: string
  mockBg: string
  screens: MockScreen[]
  roles: Role[]
  features: Feature[]
  tech: string[]
  isOwn: boolean
  year: string
  badge?: WorkBadge  // for client works
  demoVideoUrl?: string
  qrUrl?: string
  review?: ClientReview
}

export function formatPlatformAvailability(
  android: PlatformAvailability,
  ios: PlatformAvailability,
): string {
  if (android === 'available' && ios === 'available') return 'Android & iOS'
  if (android === 'coming-soon' && ios === 'coming-soon') return 'Android & iOS Coming Soon'
  if (android === 'available' && ios === 'coming-soon') return 'Android · iOS Coming Soon'
  if (ios === 'available' && android === 'coming-soon') return 'iOS · Android Coming Soon'
  if (android === 'available') return 'Android'
  if (ios === 'available') return 'iOS'
  if (android === 'coming-soon') return 'Android Coming Soon'
  if (ios === 'coming-soon') return 'iOS Coming Soon'
  return ''
}

export function getProjectPlatformLabel(project: Project): string {
  const hasStructuredAvailability = Boolean(project.androidAvailability || project.iosAvailability)
  if (!hasStructuredAvailability) return project.platform?.trim() ?? ''

  return formatPlatformAvailability(
    project.androidAvailability ?? 'not-supported',
    project.iosAvailability ?? 'not-supported',
  )
}

// ─── Own Products — Apps ──────────────────────────────────────────────────────
export const productApps: Project[] = [
  {
    id: 'tailordeck',
    type: 'app',
    name: 'TailorDeck',
    tagline: 'The business OS for Nigerian tailors.',
    shortDesc: 'A SaaS mobile app that helps tailors manage clients, measurements, orders, and finances — all in one place.',
    about: "TailorDeck was born from a real problem: Nigerian tailors lose money, miss deadlines, and lose clients because they have no system. Everything lives in notebooks, memory, and WhatsApp. TailorDeck changes that — a simple, powerful app built specifically for how tailors work.",
    category: 'SaaS · Business Management',
    status: 'in-dev',
    platform: 'Android & iOS',
    accentColor: '#7C3AED',
    mockBg: '#1A0A3B',
    isOwn: true,
    year: '2025',
    screens: [
      { label: 'Dashboard', colorA: '#7C3AED', colorB: '#4C1D95', colorC: '#6D28D9' },
      { label: 'Client Profiles', colorA: '#6D28D9', colorB: '#3B1589', colorC: '#5B21B6' },
      { label: 'New Order', colorA: '#5B21B6', colorB: '#2E1065', colorC: '#4C1D95' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'UI/UX Design, User Research, Wireframes, Prototype', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React Native, Expo, Mobile UI, Animations', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, REST API, Authentication, Push Notifications', icon: '⊟' },
      { title: 'Database Engineer', desc: 'MongoDB Schema Design, Data Modeling', icon: '◈' },
      { title: 'QA Engineer', desc: 'Device Testing, Bug Tracking, Performance QA', icon: '⌬' },
    ],
    features: [
      { name: 'Client Management', desc: "Store every customer's contact info, history, and notes. Find any client instantly." },
      { name: 'Measurements', desc: 'Record full body measurements per client. Supports custom measurement fields.' },
      { name: 'Order Tracking', desc: 'Create orders, set deadlines, track status from fabric sourced to delivered.' },
      { name: 'Deposits & Payments', desc: 'Record deposits and balance payments. Know exactly who owes you money.' },
      { name: 'Digital Receipts', desc: 'Generate and share professional receipts via WhatsApp or email instantly.' },
      { name: 'Materials Management', desc: 'Track fabric and supply usage per job. See your real material cost.' },
      { name: 'Expense Tracking', desc: 'Log business expenses by category. See where your money is going monthly.' },
      { name: 'Profit Dashboard', desc: 'See your real income, expenses, and profit at a glance.' },
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'MongoDB', 'Cloudinary', 'JWT Auth'],
  },
  {
    id: 'zinzool-app',
    type: 'app',
    name: 'Zinzool',
    tagline: 'Watch together. React together. Wherever you are.',
    shortDesc: 'A real-time social app for synchronized video watching — every user sees the same frame at the same moment.',
    about: "Zinzool is BBW Tech's proof of real-time engineering. A social platform where friends watch videos together in perfect sync, react, and share moments regardless of where they are in the world.",
    category: 'Social Platform · Mobile App',
    status: 'in-dev',
    platform: 'Android & iOS',
    accentColor: '#EC4899',
    mockBg: '#2D0A1E',
    isOwn: true,
    year: '2025',
    screens: [
      { label: 'Watch Room', colorA: '#EC4899', colorB: '#9D174D', colorC: '#DB2777' },
      { label: 'Browse Rooms', colorA: '#DB2777', colorB: '#831843', colorC: '#BE185D' },
      { label: 'Profile', colorA: '#BE185D', colorB: '#6D1035', colorC: '#EC4899' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'UI/UX Design, Real-Time UX Patterns, Room Flow', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React Native, WebSocket Client, Video Player UI', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, WebSocket Server, Room Management API', icon: '⊟' },
      { title: 'System Design Engineer', desc: 'Real-Time Sync Engine, State Consistency, Scalability', icon: '◈' },
    ],
    features: [
      { name: 'Synchronized Playback', desc: 'Videos play in perfect sync across all users. Pause, seek, play together in real time.' },
      { name: 'Watch Rooms', desc: 'Create private or public rooms. Share a link and anyone can join.' },
      { name: 'Live Chat', desc: 'Chat with everyone in the room while watching. Emoji reactions included.' },
      { name: 'Timestamp Reactions', desc: 'React to specific moments. Reactions appear synced to the exact timestamp.' },
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'WebSocket', 'Redis', 'Supabase'],
  },
  {
    id: 'prezpa',
    type: 'app',
    name: 'Prezpa',
    tagline: 'Smart presentations, built for professionals on the move.',
    shortDesc: 'A mobile app for creating, delivering, and sharing professional presentations from any device, anywhere.',
    about: "Prezpa is built for the African professional who is always moving but needs to look sharp. Create your deck on your phone, connect to any screen, and present with confidence — or share it as a link in seconds.",
    category: 'Productivity · Mobile App',
    status: 'in-dev',
    platform: 'Android & iOS',
    accentColor: '#0EA5E9',
    mockBg: '#021B2E',
    isOwn: true,
    year: '2025',
    screens: [
      { label: 'My Decks', colorA: '#0EA5E9', colorB: '#0369A1', colorC: '#0284C7' },
      { label: 'Slide Editor', colorA: '#0284C7', colorB: '#075985', colorC: '#0EA5E9' },
      { label: 'Present Mode', colorA: '#0369A1', colorB: '#0C4A6E', colorC: '#0284C7' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'UI/UX Design, Slide Template System, Prototype', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React Native, Canvas Rendering, Gesture Handling', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, File Storage API, Sharing System', icon: '⊟' },
      { title: 'System Design Engineer', desc: 'Real-time Sync, Offline Support Architecture', icon: '◈' },
    ],
    features: [
      { name: 'Slide Editor', desc: 'Create beautiful slides on your phone with drag-and-drop elements.' },
      { name: 'Presenter Mode', desc: 'Full-screen presentation mode with speaker notes and audience mirroring.' },
      { name: 'One-tap Sharing', desc: 'Share as a link, PDF, or directly to WhatsApp with one tap.' },
      { name: 'Offline Access', desc: 'All decks available offline. Present anywhere, even without internet.' },
      { name: 'Template Library', desc: 'Professional templates for pitches, reports, proposals, and reviews.' },
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Supabase', 'Cloudinary'],
  },
  {
    id: 'bbwflow-app',
    type: 'app',
    name: 'BBWFlow',
    tagline: 'BBW Tech built a SaaS platform to run itself.',
    shortDesc: 'Business operations app — digital receipts, proposals, invoices, client management, and project tracking in one system.',
    about: "BBWFlow started as a simple need: BBW Tech needed professional receipts for clients. It grew into a full business operations platform — handling the entire client lifecycle from proposals to final invoices.",
    category: 'SaaS · Business Operations',
    status: 'beta',
    platform: 'Web App (PWA)',
    accentColor: '#6366F1',
    mockBg: '#0D0B24',
    isOwn: true,
    year: '2024',
    screens: [
      { label: 'Dashboard', colorA: '#6366F1', colorB: '#312E81', colorC: '#4F46E5' },
      { label: 'Receipt Builder', colorA: '#4F46E5', colorB: '#2E1D9E', colorC: '#6366F1' },
      { label: 'Client Records', colorA: '#4338CA', colorB: '#231B8A', colorC: '#4F46E5' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'UI/UX Design, Design System, Document Template Design', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, TypeScript, PDF Generation, Print Layout', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Supabase, REST API, Auth, Document Storage', icon: '⊟' },
      { title: 'System Design Engineer', desc: 'Multi-module Architecture, Receipt → Invoice Lifecycle', icon: '◈' },
    ],
    features: [
      { name: 'Digital Receipts', desc: 'Generate professional receipts in seconds. Download as PDF or share via WhatsApp.' },
      { name: 'Proposal Builder', desc: 'Create proposals with itemized pricing, scope, and terms.' },
      { name: 'Invoice Generation', desc: "Turn approved proposals into invoices automatically." },
      { name: 'Client Management', desc: 'Store all client records and project history in one place.' },
      { name: 'Project Tracking', desc: 'Track active projects from proposal to delivery.' },
    ],
    tech: ['React', 'TypeScript', 'Supabase', 'Vite', 'Tailwind CSS', 'jsPDF', 'Vercel'],
  },
]

// ─── Own Products — Websites ──────────────────────────────────────────────────
export const productWebsites: Project[] = [
  {
    id: 'zinzool-web',
    type: 'website',
    name: 'Zinzool',
    tagline: 'The web platform for real-time social watching.',
    shortDesc: 'The web version of Zinzool — synchronized video watching and social interaction directly in the browser.',
    about: "Zinzool Web is the browser-based experience for synchronized watching. No app download required — just share a link, join a room, and watch together.",
    category: 'Social Platform · Web',
    status: 'in-dev',
    siteUrl: '#',
    accentColor: '#EC4899',
    mockBg: '#2D0A1E',
    isOwn: true,
    year: '2025',
    screens: [
      { label: 'Landing Page', colorA: '#EC4899', colorB: '#9D174D', colorC: '#DB2777' },
      { label: 'Watch Room', colorA: '#DB2777', colorB: '#831843', colorC: '#BE185D' },
      { label: 'Browse', colorA: '#BE185D', colorB: '#6D1035', colorC: '#EC4899' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'UI/UX Design, Web Experience Design', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, WebSocket Client, Embedded Video Player', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, WebSocket Server, Room Management', icon: '⊟' },
      { title: 'System Design Engineer', desc: 'Sync Engine, Scalability, CDN Integration', icon: '◈' },
    ],
    features: [
      { name: 'Browser-based Sync', desc: 'No app needed — sync watching directly in any modern browser.' },
      { name: 'Room Creation', desc: 'Create and share rooms with a single link.' },
      { name: 'Live Chat', desc: 'Real-time chat alongside the video player.' },
      { name: 'Multi-platform Support', desc: 'Works across desktop, tablet, and mobile browsers.' },
    ],
    tech: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'Redis', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'domihive',
    type: 'website',
    name: 'DomiHive',
    tagline: 'Property technology built for Africa.',
    shortDesc: 'A future real-estate and property management ecosystem addressing African housing and rental market challenges at scale.',
    about: "DomiHive represents BBW Tech's long-term ambition — applying technology to one of Africa's largest and most underserved markets: housing and property management.",
    category: 'PropTech · Web Platform',
    status: 'coming-soon',
    accentColor: '#2979FF',
    mockBg: '#041224',
    isOwn: true,
    year: '2026',
    screens: [
      { label: 'Property Listings', colorA: '#2979FF', colorB: '#1E3A8A', colorC: '#1D4ED8' },
      { label: 'Property Details', colorA: '#1D4ED8', colorB: '#1E40AF', colorC: '#2563EB' },
      { label: 'Agent Dashboard', colorA: '#2563EB', colorB: '#1D4ED8', colorC: '#2979FF' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'Market Research, UX Strategy, Interface Design', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, Maps Integration, Property Gallery', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, Search API, Listing Management', icon: '⊟' },
      { title: 'System Design Engineer', desc: 'Multi-tenant Architecture, Search Indexing', icon: '◈' },
    ],
    features: [
      { name: 'Property Listings', desc: 'Browse verified properties for rent and sale across Nigerian cities.' },
      { name: 'Agent Portal', desc: 'Tools for agents to list, manage, and track properties and inquiries.' },
      { name: 'Smart Search', desc: 'Filter by location, price range, property type, and amenities.' },
      { name: 'Tenant Dashboard', desc: 'Track rent payments, maintenance requests, and lease details.' },
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Mapbox', 'Cloudinary', 'Vercel'],
  },
  {
    id: 'toyhouseqi',
    type: 'website',
    name: 'ToyHouseQI',
    tagline: 'Quality toys, smart learning, delivered to your door.',
    shortDesc: 'An e-commerce platform for premium educational toys and children\'s learning materials across Nigeria.',
    about: "ToyHouseQI brings quality educational toys and learning materials to Nigerian families through a modern, trustworthy e-commerce experience. Curated products, fast delivery, and a platform built to grow.",
    category: 'E-Commerce · Web Platform',
    status: 'in-dev',
    siteUrl: '#',
    accentColor: '#F97316',
    mockBg: '#1C0A00',
    isOwn: true,
    year: '2025',
    screens: [
      { label: 'Store Front', colorA: '#F97316', colorB: '#9A3412', colorC: '#EA580C' },
      { label: 'Product Page', colorA: '#EA580C', colorB: '#7C2D12', colorC: '#F97316' },
      { label: 'Checkout', colorA: '#C2410C', colorB: '#431407', colorC: '#EA580C' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'E-commerce UX, Product Photography Direction, Checkout Flow', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, Cart System, Payment Integration UI', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, Product Catalog API, Order Management', icon: '⊟' },
      { title: 'Database Engineer', desc: 'MongoDB, Inventory Management, Order Tracking', icon: '◈' },
    ],
    features: [
      { name: 'Product Catalog', desc: 'Curated selection of educational toys organized by age group and category.' },
      { name: 'Cart & Checkout', desc: 'Smooth, mobile-optimized checkout with multiple payment options.' },
      { name: 'Order Tracking', desc: 'Real-time delivery tracking from purchase to doorstep.' },
      { name: 'Admin Inventory', desc: 'Complete backend for managing products, stock levels, and orders.' },
      { name: 'Wishlist & Reviews', desc: 'Save favorites and read verified parent reviews before buying.' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Paystack', 'Cloudinary', 'Tailwind CSS', 'Vercel'],
  },
]

// ─── Client Works ─────────────────────────────────────────────────────────────
export const clientWorks: Project[] = [
  {
    id: 'fifi-installations',
    type: 'website',
    name: 'Fifi Installations',
    tagline: 'From WhatsApp referrals to a professional digital business.',
    shortDesc: 'Full-stack platform for a Nigerian construction and installation company — customer site plus admin backend.',
    about: "Fifi Installations was running entirely on word-of-mouth and WhatsApp referrals. BBW Tech built a complete digital presence: a professional website showcasing services and completed projects, backed by a full admin system for managing quotes, jobs, and clients.",
    category: 'Construction Services',
    status: 'completed',
    siteUrl: '#',
    accentColor: '#2979FF',
    mockBg: '#0A0F1E',
    isOwn: false,
    year: '2024',
    badge: 'website',
    screens: [
      { label: 'Homepage', colorA: '#2979FF', colorB: '#1E3A8A', colorC: '#1D4ED8' },
      { label: 'Services', colorA: '#1D4ED8', colorB: '#1E40AF', colorC: '#2563EB' },
      { label: 'Admin Panel', colorA: '#2563EB', colorB: '#1D4ED8', colorC: '#2979FF' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'Brand Direction, UI/UX, Responsive Layouts', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, Tailwind CSS, Animations', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, Express, REST API, Auth', icon: '⊟' },
      { title: 'Database Engineer', desc: 'MongoDB, Data Modeling', icon: '◈' },
      { title: 'DevOps', desc: 'Vercel Deploy, Domain & SSL Setup', icon: '⌬' },
    ],
    features: [
      { name: 'Service Showcase', desc: 'Professional display of all installation services with images and pricing.' },
      { name: 'Project Gallery', desc: 'Before-and-after gallery of completed installations.' },
      { name: 'Quote Request', desc: 'Structured form for project descriptions — no more WhatsApp chaos.' },
      { name: 'Admin Dashboard', desc: 'Complete backend for managing jobs, quotes, and client records.' },
      { name: 'Image Management', desc: 'Cloudinary-powered gallery with fast-loading optimized images.' },
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'pearl-the-braider',
    type: 'website',
    name: 'Pearl The Braider',
    tagline: 'Booking made beautiful for a master hair braider.',
    shortDesc: 'A sleek booking and portfolio website for a professional hair braider, replacing chaotic Instagram DMs with a structured booking system.',
    about: "Pearl The Braider was taking bookings entirely through Instagram DMs — no system, no schedule, frequent double-bookings, and lost clients. BBW Tech built a clean, stunning portfolio and booking platform that showcases Pearl's work and lets clients book appointments directly online.",
    category: 'Beauty Services',
    status: 'live',
    siteUrl: '#',
    accentColor: '#D946EF',
    mockBg: '#1C002B',
    isOwn: false,
    year: '2024',
    badge: 'website',
    screens: [
      { label: 'Portfolio', colorA: '#D946EF', colorB: '#7E22CE', colorC: '#C026D3' },
      { label: 'Book Appointment', colorA: '#C026D3', colorB: '#6B21A8', colorC: '#D946EF' },
      { label: 'Services & Pricing', colorA: '#A21CAF', colorB: '#581C87', colorC: '#C026D3' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'Brand Identity, UI/UX, Gallery Layout, Booking Flow', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, Photo Gallery, Booking Calendar UI', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, Booking Management API, Notifications', icon: '⊟' },
    ],
    features: [
      { name: 'Portfolio Gallery', desc: 'Stunning visual gallery of completed braid styles, organized by category.' },
      { name: 'Online Booking', desc: 'Clients choose service, date, and time — no DMs needed.' },
      { name: 'Booking Calendar', desc: 'Pearl manages her schedule with a live calendar showing confirmed bookings.' },
      { name: 'Service Pricing', desc: 'Clear pricing for all services with duration and deposit requirements.' },
      { name: 'Client Notifications', desc: 'Automatic confirmation messages sent to clients on booking.' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Cloudinary', 'Vercel'],
  },
  {
    id: 'sendnprint',
    type: 'website',
    name: 'SendNPrint',
    tagline: 'Upload, print, collect. Simple as that.',
    shortDesc: 'An online print-on-demand platform where customers upload documents and receive printed copies — same day, no queue.',
    about: "SendNPrint solves a daily frustration for students and professionals in Nigeria: finding a reliable, fast printing service. Customers upload their files online, choose print specs, pay, and collect — or have it delivered. BBW Tech built the full platform from upload to order management.",
    category: 'Print Services · E-Commerce',
    status: 'live',
    siteUrl: '#',
    accentColor: '#059669',
    mockBg: '#002016',
    isOwn: false,
    year: '2024',
    badge: 'website',
    screens: [
      { label: 'Upload & Order', colorA: '#059669', colorB: '#064E3B', colorC: '#10B981' },
      { label: 'Print Options', colorA: '#10B981', colorB: '#065F46', colorC: '#059669' },
      { label: 'Order Tracking', colorA: '#047857', colorB: '#022C22', colorC: '#10B981' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'User Flow Design, Upload UI, Print Spec Interface', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, File Upload, Order Form, PDF Preview', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, File Storage, Order Management, Paystack', icon: '⊟' },
      { title: 'Database Engineer', desc: 'MongoDB, Order Schema, Status Tracking', icon: '◈' },
    ],
    features: [
      { name: 'File Upload', desc: 'Upload PDF, Word, or image files. Preview before ordering.' },
      { name: 'Print Configuration', desc: 'Choose paper size, color or black & white, single or double-sided.' },
      { name: 'Online Payment', desc: 'Pay via Paystack — card, bank transfer, or USSD.' },
      { name: 'Order Tracking', desc: 'Track your print order status from received to ready for collection.' },
      { name: 'Admin Dashboard', desc: 'Manage all incoming orders, print queue, and customer records.' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Paystack', 'Cloudinary', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'spp-matarh',
    type: 'website',
    name: 'Spp-Matarh Ltd',
    tagline: 'Professional digital presence for a growing enterprise.',
    shortDesc: 'A corporate website and client management platform built for a Nigerian multi-service business company.',
    about: "Spp-Matarh Ltd needed a professional digital identity to match their growing business operations. BBW Tech delivered a polished corporate website with a services showcase, team profile, and an integrated client enquiry management system.",
    category: 'Corporate · Multi-Service',
    status: 'completed',
    siteUrl: '#',
    accentColor: '#0F766E',
    mockBg: '#001F1D',
    isOwn: false,
    year: '2023',
    badge: 'website',
    screens: [
      { label: 'Corporate Home', colorA: '#0F766E', colorB: '#134E4A', colorC: '#14B8A6' },
      { label: 'Services', colorA: '#14B8A6', colorB: '#0F766E', colorC: '#0D9488' },
      { label: 'Contact', colorA: '#0D9488', colorB: '#115E59', colorC: '#14B8A6' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'Corporate Brand Direction, UI/UX, Professional Layout', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, Corporate Animations, Contact Forms', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, Enquiry Management, Email Integration', icon: '⊟' },
    ],
    features: [
      { name: 'Corporate Homepage', desc: 'Professional landing page communicating company values and capabilities.' },
      { name: 'Services Showcase', desc: 'Detailed breakdown of all business services and offerings.' },
      { name: 'Team Profile', desc: 'Meet the team section showcasing leadership and key personnel.' },
      { name: 'Enquiry System', desc: 'Structured enquiry form with admin management backend.' },
      { name: 'Mobile Responsive', desc: 'Fully optimized for all screen sizes and devices.' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'EmailJS', 'Vercel'],
  },
  {
    id: 'shemchester-styles',
    type: 'website',
    name: 'ShemChester Styles',
    tagline: 'Fashion meets function — a modern clothing brand online.',
    shortDesc: 'An e-commerce and brand website for a Nigerian fashion label — showcasing collections, accepting orders, and building brand identity.',
    about: "ShemChester Styles had a strong offline presence and loyal customers but no structured online platform. BBW Tech built a fashion-forward e-commerce site that captures the brand's identity and makes ordering straightforward for both existing and new customers.",
    category: 'Fashion · E-Commerce',
    status: 'live',
    siteUrl: '#',
    accentColor: '#B45309',
    mockBg: '#1C0D00',
    isOwn: false,
    year: '2024',
    badge: 'website',
    screens: [
      { label: 'Collections', colorA: '#B45309', colorB: '#78350F', colorC: '#D97706' },
      { label: 'Product Detail', colorA: '#D97706', colorB: '#92400E', colorC: '#B45309' },
      { label: 'Order Form', colorA: '#92400E', colorB: '#451A03', colorC: '#D97706' },
    ],
    roles: [
      { title: 'Product Designer', desc: 'Fashion Brand UI, Lookbook Design, Product Photography Direction', icon: '◉' },
      { title: 'Frontend Engineer', desc: 'React, Product Gallery, Order Flow, Cart', icon: '⊞' },
      { title: 'Backend Engineer', desc: 'Node.js, Product Catalog, Order Management', icon: '⊟' },
    ],
    features: [
      { name: 'Collection Showcase', desc: 'Lookbook-style display of clothing collections with editorial photography.' },
      { name: 'Product Catalog', desc: 'Full catalog with sizes, colors, and availability.' },
      { name: 'Order Management', desc: 'Customers place orders online — admin manages fulfillment.' },
      { name: 'WhatsApp Integration', desc: 'One-tap to continue order conversation on WhatsApp.' },
      { name: 'Brand Story', desc: 'About page telling the brand story and design philosophy.' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Cloudinary', 'Tailwind CSS', 'Vercel'],
  },
]

// All own products combined (apps + websites) for store use
export const allOwnProducts: Project[] = [...productApps, ...productWebsites]
