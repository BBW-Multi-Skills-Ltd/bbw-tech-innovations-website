import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { readCookiePreferences, saveCookiePreferences, type CookiePreferences } from './cookieConsent'

type Draft = Pick<CookiePreferences, 'preferences' | 'analytics'>
const all: Draft = { preferences: true, analytics: true }
const essentialOnly: Draft = { preferences: false, analytics: false }

export default function CookieConsent() {
  const [saved, setSaved] = useState<CookiePreferences | null>(() => readCookiePreferences())
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => saved ? { preferences: saved.preferences, analytics: saved.analytics } : essentialOnly)

  useEffect(() => {
    const openPreferences = () => { const current = readCookiePreferences(); if (current) setDraft({ preferences: current.preferences, analytics: current.analytics }); setOpen(true) }
    window.addEventListener('bbw:open-cookie-preferences', openPreferences)
    return () => window.removeEventListener('bbw:open-cookie-preferences', openPreferences)
  }, [])

  const save = (next: Draft) => { saveCookiePreferences(next); setSaved(readCookiePreferences()); setDraft(next); setOpen(false) }

  return <>
    {!saved && <section className="cookie-banner" role="region" aria-label="Cookie preferences"><div><p className="eyebrow">Your privacy</p><h2>Cookies, with your choice.</h2><p>We use essential cookies to keep the website secure. Optional preferences and future analytics stay off unless you allow them.</p></div><div className="cookie-banner-actions"><button type="button" className="admin-secondary-button" onClick={() => setOpen(true)}>Manage</button><button type="button" className="admin-secondary-button" onClick={() => save(essentialOnly)}>Essential only</button><button type="button" className="btn-primary" onClick={() => save(all)}>Accept all</button></div></section>}
    {open && <div className="cookie-modal-backdrop" role="presentation"><section className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-preferences-title"><button type="button" className="cookie-modal-close" aria-label="Close cookie preferences" onClick={() => setOpen(false)}><X size={19} /></button><p className="eyebrow">Cookie preferences</p><h2 id="cookie-preferences-title">You’re in control.</h2><p>Essential cookies are required for secure sign-in and basic website operation. The other categories are optional.</p><div className="cookie-options"><label><span><strong>Essential</strong><small>Security, sign-in, and core website operation.</small></span><input type="checkbox" checked disabled aria-label="Essential cookies always enabled" /></label><label><span><strong>Preferences</strong><small>Remember optional website choices, such as ambient music settings.</small></span><input type="checkbox" checked={draft.preferences} onChange={event => setDraft(current => ({ ...current, preferences: event.target.checked }))} /></label><label><span><strong>Analytics</strong><small>Help us understand website use. No analytics provider is active yet.</small></span><input type="checkbox" checked={draft.analytics} onChange={event => setDraft(current => ({ ...current, analytics: event.target.checked }))} /></label></div><div className="cookie-modal-actions"><button type="button" className="admin-secondary-button" onClick={() => save(essentialOnly)}>Essential only</button><button type="button" className="btn-primary" onClick={() => save(draft)}>Save preferences</button></div></section></div>}
  </>
}
