'use client'

import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { Theme, mapConditionToTheme } from '@/lib/weatherUtils'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme // Default theme is 'default' - might become redundant
  initialTheme?: Theme // Add prop for server-rendered theme
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

export function ThemeProvider({
  children,
  defaultTheme = 'default', // Keep for potential fallback if initialTheme is undefined
  initialTheme, // Receive the server-determined theme
}: ThemeProviderProps) {
  const { data: weatherData, isPending, error } = useWeatherInfo()

  // Initialize state with server-provided theme, fallback to defaultTheme
  const [internalTheme, setInternalTheme] = useState<Theme>(
    initialTheme || defaultTheme
  )
  // State to track if the theme was set manually
  const [isManualTheme, setIsManualTheme] = useState<boolean>(false)

  // Effect to update theme based on weather, unless set manually
  useEffect(() => {
    // Only update based on weather if not manually set
    if (isManualTheme) return

    let currentTheme: Theme = defaultTheme

    if (!isPending && !error && weatherData?.condition) {
      currentTheme = mapConditionToTheme(weatherData.condition)
    }
    // console.log(`ThemeProvider Effect: Current theme theme: ${currentTheme}, Pending: ${isPending}, Initial: ${initialTheme}, Internal: ${internalTheme}`); // Debug log

    // --- Refined Logic to prevent flicker ---
    // Avoid setting to default during initial client load if a server theme exists
    // and the client calculation is still pending or resulted in default temporarily.
    const isInitialLoadAndDefaulting =
      isPending && initialTheme && currentTheme === defaultTheme

    // Only update state and DOM if:
    // 1. The currentTheme is different from the current state AND
    // 2. We are NOT in the specific initial load scenario described above.
    if (currentTheme !== internalTheme && !isInitialLoadAndDefaulting) {
      // console.log(`ThemeProvider: Updating theme from ${internalTheme} to ${currentTheme}`); // Debug log
      setInternalTheme(currentTheme)
      const root = window.document.documentElement
      root.setAttribute(`data-theme`, currentTheme)
    }
  }, [
    weatherData,
    isPending,
    error,
    defaultTheme,
    isManualTheme,
    internalTheme,
    initialTheme,
  ])

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
