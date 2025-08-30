import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tech-sathi-theme')
    return saved || 'light'
  })

  const themes = {
    light: {
      name: 'Light',
      bg: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
      text: 'text-gray-900',
      card: 'bg-white/80',
      border: 'border-gray-200',
      accent: 'text-blue-600'
    },
    dark: {
      name: 'Dark',
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      text: 'text-white',
      card: 'bg-gray-800/80',
      border: 'border-gray-700',
      accent: 'text-blue-400'
    },
    futuristic: {
      name: 'Futuristic',
      bg: 'bg-gradient-to-br from-black via-purple-900 to-blue-900',
      text: 'text-cyan-100',
      card: 'bg-black/40',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-400'
    },
    neon: {
      name: 'Neon',
      bg: 'bg-gradient-to-br from-black via-pink-900 to-purple-900',
      text: 'text-pink-100',
      card: 'bg-black/30',
      border: 'border-pink-500/50',
      accent: 'text-pink-400'
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme === 'dark' || theme === 'futuristic' || theme === 'neon') {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
    
    localStorage.setItem('tech-sathi-theme', theme)
  }, [theme])

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const value = {
    theme,
    themes,
    currentTheme: themes[theme],
    changeTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
