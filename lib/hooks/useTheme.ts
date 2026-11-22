'use client'

import { useCallback, useEffect, useState } from 'react'

/** Dark on every page load (as on the live site); the toggle switches for this visit only. */
export default function useTheme() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-transitioning')
    setDark(current => {
      document.documentElement.setAttribute('data-theme', current ? 'light' : 'dark')
      return !current
    })
    window.setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 420)
  }, [])

  return { dark, toggleTheme }
}
