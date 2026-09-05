import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    enabled: import.meta.env.PROD,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeBreadcrumb(breadcrumb) {
      return breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr' ? null : breadcrumb
    },
    beforeSend(event) {
      if (event.request) {
        delete event.request.data
        delete event.request.cookies
        if (event.request.url) {
          const url = new URL(event.request.url)
          event.request.url = `${url.origin}${url.pathname}`
        }
      }

      delete event.user
      return event
    },
  })
}
