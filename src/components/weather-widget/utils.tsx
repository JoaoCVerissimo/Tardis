import { cn } from '@/lib/utils'
import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'
import type { JSX } from 'react' // Import JSX type for return type
import { weatherMessages } from './constants'

export function getRandomMessage(condition: string): string {
  const messages =
    weatherMessages[condition as keyof typeof weatherMessages] ||
    weatherMessages.default
  return messages[Math.floor(Math.random() * messages.length)]
}

// Function to get the appropriate weather icon component based on condition
// Modified to accept full className string to avoid potential parsing issues
export function getWeatherIcon(
  condition: string,
  className: string // Expect the full className string including size
): JSX.Element {
  switch (condition) {
    case 'Clear':
      return <Sun className={cn('text-primary animate-pulse', className)} />
    case 'Clouds':
      return (
        <Cloud
          className={cn('animate-bounce-slow text-muted-foreground', className)}
        />
      )
    case 'Rain':
    case 'Drizzle':
      return (
        <CloudRain className={cn('animate-drizzle text-primary', className)} />
      )
    case 'Snow':
      return (
        <CloudSnow
          className={cn('animate-spin-slow text-primary', className)}
        />
      )
    case 'Thunderstorm':
      return (
        <CloudLightning
          className={cn('animate-lightning text-accent', className)}
        />
      )
    default:
      // Default icon if condition doesn't match
      return <Cloud className={cn('text-muted-foreground', className)} />
  }
}

// Function to get the appropriate background class based on weather condition
export function getWeatherBackgroundClass(condition: string): string {
  switch (condition) {
    case 'Clear':
    case 'Thunderstorm':
      return 'bg-accent hover:bg-accent/90'
    case 'Rain':
    case 'Drizzle':
      return 'bg-secondary hover:bg-secondary/90'
    case 'Snow':
      return 'bg-primary hover:bg-primary/90'
    case 'Clouds':
    default:
      return 'bg-muted hover:bg-muted/90'
  }
}
