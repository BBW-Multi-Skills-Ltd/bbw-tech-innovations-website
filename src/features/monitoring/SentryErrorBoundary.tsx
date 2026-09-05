import * as Sentry from '@sentry/react'
import type { ReactNode } from 'react'

interface SentryErrorBoundaryProps {
  children: ReactNode
}

export default function SentryErrorBoundary({ children }: SentryErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ resetError }) => (
        <main className="route-loader sentry-error-boundary" role="alert">
          <p>Something went wrong while loading this page.</p>
          <button type="button" onClick={resetError}>Try again</button>
        </main>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
