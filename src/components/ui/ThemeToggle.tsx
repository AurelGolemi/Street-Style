'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show placeholder during SSR
  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse" />
    )
  }

  const handleClick = () => {
    console.log('Theme toggle clicked')
    toggleTheme()
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 group cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Icon container with rotation animation */}
      <div className="relative w-5 h-5">
        {/* Sun icon (visible in light mode) */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 transform ${
            theme === 'light' 
              ? 'rotate-0 opacity-100 scale-100' 
              : 'rotate-90 opacity-0 scale-50'
          }`}
        />
        
        {/* Moon icon (visible in dark mode) */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-slate-700 dark:text-slate-300 transition-all duration-300 transform ${
            theme === 'dark' 
              ? 'rotate-0 opacity-100 scale-100' 
              : '-rotate-90 opacity-0 scale-50'
          }`}
        />
      </div>

      {/* Optional: Add a visual indicator */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}