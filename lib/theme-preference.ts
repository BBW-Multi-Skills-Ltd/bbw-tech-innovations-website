/**
 * The site theme: the visitor's saved choice, else their system setting
 * (prefers-color-scheme), else dark. The choice is saved only when the visitor
 * allowed preference cookies (see the cookie banner); otherwise it lasts for
 * the page. `themeScript` applies it in <head> before first paint, so there is
 * no flash of the wrong theme.
 */
export type Theme = 'light' | 'dark'

export const THEME_KEY = 'bbw-theme'
export const THEME_EVENT = 'bbw:theme-change'

export const themeScript = `try{var t=null;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}`

export function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch { return null }
}

export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function saveTheme(theme: Theme | null) {
  try {
    if (theme) localStorage.setItem(THEME_KEY, theme)
    else localStorage.removeItem(THEME_KEY)
  } catch { /* storage blocked: the choice lasts for this page */ }
}
