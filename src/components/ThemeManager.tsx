import { useEffect } from 'react'
import { useAppStore } from '../stores/app-store'

export function ThemeManager() {
  const theme = useAppStore((s) => s.settings.theme)

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const resolved =
        theme === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : theme

      root.dataset.theme = resolved
    }

    apply()

    if (theme === 'system') {
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }
  }, [theme])

  return null
}
