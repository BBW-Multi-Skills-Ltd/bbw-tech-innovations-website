export interface CookiePreferences {
  essential: true
  preferences: boolean
  analytics: boolean
  savedAt: string
}

const cookieName = 'bbw_cookie_preferences'
const maxAge = 60 * 60 * 24 * 365

export function readCookiePreferences(): CookiePreferences | null {
  const value = document.cookie.split('; ').find(entry => entry.startsWith(`${cookieName}=`))?.split('=').slice(1).join('=')
  if (!value) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<CookiePreferences>
    if (typeof parsed.preferences !== 'boolean' || typeof parsed.analytics !== 'boolean') return null
    return { essential: true, preferences: parsed.preferences, analytics: parsed.analytics, savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '' }
  } catch { return null }
}

export function saveCookiePreferences(preferences: Omit<CookiePreferences, 'essential' | 'savedAt'>) {
  const value: CookiePreferences = { essential: true, preferences: preferences.preferences, analytics: preferences.analytics, savedAt: new Date().toISOString() }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent<CookiePreferences>('bbw:cookie-preferences-saved', { detail: value }))
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event('bbw:open-cookie-preferences'))
}
