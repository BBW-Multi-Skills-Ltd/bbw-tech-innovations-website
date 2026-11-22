/** The site's public address. Set NEXT_PUBLIC_SITE_URL per environment. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bbwtechinnovation.com').replace(/\/$/, '')
