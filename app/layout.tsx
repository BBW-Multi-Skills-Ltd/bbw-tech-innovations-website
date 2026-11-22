import type { Metadata, Viewport } from 'next'
import { Fraunces, JetBrains_Mono, Outfit } from 'next/font/google'
import { SITE_URL } from '@/lib/site-url'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
})

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

const description = 'BBW Tech Innovations builds digital products, software, and technology solutions for businesses and entrepreneurs.'
const shareDescription = 'We build websites, applications, SaaS products, and intelligent digital systems for businesses ready to grow.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BBW Tech Innovations | Digital Products & Technology Solutions',
    template: '%s | BBW Tech Innovations',
  },
  description,
  alternates: { canonical: '/' },
  icons: { icon: { url: '/logos/bbwlogo.png', type: 'image/png' } },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'BBW Tech Innovations',
    locale: 'en_NG',
    title: 'BBW Tech Innovations',
    description: shareDescription,
    images: [{ url: '/social/bbw-tech-innovations-og.png', width: 1200, height: 630, alt: 'BBW Tech Innovations — Digital products built for what’s next.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BBW Tech Innovations',
    description: shareDescription,
    images: ['/social/bbw-tech-innovations-og.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-NG" data-theme="dark" suppressHydrationWarning className={`${fraunces.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
