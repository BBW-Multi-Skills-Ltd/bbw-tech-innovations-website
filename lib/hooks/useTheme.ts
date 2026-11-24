'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { readCookiePreferences } from '@/components/privacy/cookieConsent'
import { THEME_EVENT, saveTheme, savedTheme, systemTheme, type Theme } from '@/lib/theme-preference'

// The current theme is the <html data-theme> attribute (set before paint by
// themeScript in the layout). Read it as an external store; the server
// renders dark, the browser then shows the real one.
const subscribe = (onChange: () => void) => {
  window.addEventListener(THEME_EVENT, onChange)
  return () => window.removeEventListener(THEME_EVENT, onChange)
}
const snapshot = () => document.documentElement.getAttribute('data-theme') !== 'light'
const serverSnapshot = () => true

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  window.dispatchEvent(new Event(THEME_EVENT))
}

/** The site theme: saved choice, else the system setting, else dark. The toggle remembers the choice when preference cookies are allowed. */
export default function useTheme() {
  const dark = useSyncExternalStore(subscribe, snapshot, serverSnapshot)

  useEffect(() => {
    // Follow the system setting while the visitor hasn't picked a theme.
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const followSystem = () => { if (!savedTheme()) applyTheme(systemTheme()) }
    media.addEventListener('change', followSystem)
    // Preference cookies turned off: forget a saved choice.
    const onConsent = () => { if (!readCookiePreferences()?.preferences) saveTheme(null) }
    window.addEventListener('bbw:cookie-preferences-saved', onConsent)
    return () => {
      media.removeEventListener('change', followSystem)
      window.removeEventListener('bbw:cookie-preferences-saved', onConsent)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    document.documentElement.classList.add('theme-transitioning')
    applyTheme(next)
    if (readCookiePreferences()?.preferences) saveTheme(next)
    window.setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 420)
  }, [])

  return { dark, toggleTheme }
}
