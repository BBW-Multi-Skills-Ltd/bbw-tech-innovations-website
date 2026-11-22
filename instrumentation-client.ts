import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

// Browser error reporting, as on the Vite site: production only, no personal
// data, no request bodies or cookies, no query strings, no tracing.
if (dsn) {
  Sentry.init({
    dsn,
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV,
    // Sentry 11's replacement for sendDefaultPii: false.
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
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
