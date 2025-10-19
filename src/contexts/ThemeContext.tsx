'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with undefined to indicate "not mounted yet"
  const [theme, setThemeState] = useState<Theme | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  // CRITICAL: Only run on client after mount
  useEffect(() => {
    setMounted(true)

    // Read current theme from DOM (set by ThemeScript)
    const isDark = document.documentElement.classList.contains('dark')
    const initialTheme: Theme = isDark ? 'dark' : 'light'

    setThemeState(initialTheme)

    console.log('✅ Theme initialized:', initialTheme)
  }, [])

  // Apply theme changes to DOM
  useEffect(() => {
    if (!mounted || !theme) return

    const root = document.documentElement

    console.log('🎨 Applying theme:', theme)

    // Tailwind dark mode: add 'dark' class for dark mode, remove for light mode
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Save to localStorage
    try {
      localStorage.setItem('theme', theme)
      console.log('💾 Theme saved to localStorage:', theme)
    } catch (e) {
      console.error('Failed to save theme:', e)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    if (!mounted || !theme) {
      console.warn('⚠️ Attempted to toggle theme before mount')
      return
    }

    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    console.log('🔄 Toggling theme:', theme, '→', newTheme)
    setThemeState(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    if (!mounted) {
      console.warn('⚠️ Attempted to set theme before mount')
      return
    }

    console.log('📝 Setting theme to:', newTheme)
    setThemeState(newTheme)
  }

  // Return loading state until mounted
  if (!mounted || !theme) {
    // During SSR and initial client render, provide no-op functions
    return (
      <ThemeContext.Provider
        value={{
          theme: 'light', // Safe default for SSR
          toggleTheme: () => {},
          setTheme: () => {}
        }}
      >
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
