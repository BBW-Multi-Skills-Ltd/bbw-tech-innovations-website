'use client'

import ErrorFallback from '@/components/ErrorFallback'
import './globals.css'

export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-NG" data-theme="dark">
      <body><ErrorFallback {...props} /></body>
    </html>
  )
}
