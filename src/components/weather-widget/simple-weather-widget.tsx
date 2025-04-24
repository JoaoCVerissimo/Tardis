'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { cn } from '@/lib/utils'
import { AlertTriangle, Droplets, Loader2, Sunset, Wind } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getRandomMessage,
  getWeatherBackgroundClass,
  getWeatherIcon,
} from './utils'

export function SimpleWeatherWidget() {
  const { isPending, error, data } = useWeatherInfo()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Add a slight delay for the fade-in effect
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (isPending) {
    return (
      <div
        className={cn(
          'bg-pending text-pending-foreground fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-xs shadow-lg transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Loader2 className="size-3 animate-spin" />
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              data-testid="error-widget"
              className={cn(
                'bg-error text-error-foreground fixed right-4 bottom-4 z-50 flex cursor-help items-center gap-2 rounded-full px-3 py-2 text-xs shadow-lg transition-opacity duration-500',
                isVisible ? 'opacity-100' : 'opacity-0'
              )}
            >
              <AlertTriangle className="size-3" />
              <span>Error</span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="end"
            role="tooltip"
            data-testid="error-tooltip"
          >
            <p>Failed to analyze weather patterns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            data-testid="weather-widget"
            className={cn(
              'fixed right-4 bottom-4 z-50 flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-xs shadow-lg transition-all duration-500',
              getWeatherBackgroundClass(data.condition),
              'text-foreground',
              isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            )}
          >
            {/* Pass the condition and the desired size class */}
            {getWeatherIcon(data.condition, 'size-5')}
            <span className="font-medium">{data.condition}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="end"
          className="max-w-xs text-sm"
          role="tooltip"
          data-testid="weather-tooltip"
        >
          <div className="space-y-2 p-2">
            <div className="flex items-center gap-1 font-semibold">
              <Sunset className="size-4" /> {data.location}
            </div>
            <p>
              {data.temperature}°C ({data.description}). Feels like{' '}
              {data.feelsLike}°C.
            </p>
            <div className="text-muted-foreground flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                <Droplets className="size-4" />
                <span>{data.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="size-4" />
                <span>{data.windSpeed} m/s</span>
              </div>
            </div>
            <p className="pt-1 text-xs italic opacity-80">
              &ldquo;{getRandomMessage(data.condition)}&rdquo;
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
