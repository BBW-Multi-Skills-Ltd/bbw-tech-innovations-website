import { useEffect, useState } from 'react'

export default function useTheme() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transitioning')
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark')
    setDark(current => !current)
    window.setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 420)
  }

  return { dark, toggleTheme }
}
