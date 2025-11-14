'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function FaviconSwitcher() {
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme
    const isDark = currentTheme === 'dark'
    
    // Get the main favicon link
    const iconLink = document.querySelector('link[rel="icon"]:not([sizes])')
    if (iconLink) {
      (iconLink as HTMLLinkElement).href = isDark ? '/icon.png' : '/icon_light.png'
    }
  }, [theme, systemTheme])

  return null
}