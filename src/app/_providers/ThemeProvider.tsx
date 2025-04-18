'use client'

import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'default' | 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'default',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Mapping from weather condition (case-insensitive) to theme
const weatherToThemeMap: Record<string, Theme> = {
  clear: 'clear',
  clouds: 'clouds',
  rain: 'rain',
  drizzle: 'rain', // Map Drizzle to Rain theme
  snow: 'snow',
  thunderstorm: 'thunderstorm',
}

export function ThemeProvider({
  children,
  defaultTheme = 'default',
}: ThemeProviderProps) {
  const { data: weatherData, isPending, error } = useWeatherInfo()

  // Internal state for the current theme
  const [internalTheme, setInternalTheme] = useState<Theme>(defaultTheme)
  // State to track if the theme was set manually
  const [isManualTheme, setIsManualTheme] = useState<boolean>(false)

  // Effect to update theme based on weather, unless set manually
  useEffect(() => {
    // Only update based on weather if not manually set
    if (isManualTheme) return

    let currentTheme: Theme = defaultTheme

    if (!isPending && !error && weatherData?.condition) {
      const conditionLower = weatherData.condition.toLowerCase()
      currentTheme = weatherToThemeMap[conditionLower] || defaultTheme
    }
    // console.log(`Applying weather theme: ${currentTheme}`) // For debugging
    setInternalTheme(currentTheme)

    // Apply the theme to the document
    const root = window.document.documentElement
    root.setAttribute(`data-theme`, currentTheme)
  }, [weatherData, isPending, error, defaultTheme, isManualTheme])

  // Function to manually set the theme
  const handleSetTheme = (newTheme: Theme) => {
    setIsManualTheme(true) // Mark theme as manually set
    setInternalTheme(newTheme) // Update internal state

    // Apply the theme immediately to the document
    const root = window.document.documentElement
    root.setAttribute(`data-theme`, newTheme)
  }

  const value = {
    theme: internalTheme, // Expose the current theme
    setTheme: handleSetTheme, // Expose the manual setter
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
