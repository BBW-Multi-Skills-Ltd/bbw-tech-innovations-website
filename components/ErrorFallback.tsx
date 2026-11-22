'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

/** Shown when a page crashes (same message as the Vite site's error boundary). */
export default function ErrorFallback({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error) }, [error])
  return (
    <main className="route-loader sentry-error-boundary" role="alert">
      <p>Something went wrong while loading this page.</p>
      <button type="button" onClick={reset}>Try again</button>
    </main>
  )
}
