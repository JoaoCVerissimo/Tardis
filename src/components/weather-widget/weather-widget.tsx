'use client'

import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { cn } from '@/lib/utils'
import { AlertTriangle, Droplets, Loader2, Sunset, Wind } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  getRandomMessage,
  getWeatherBackgroundClass,
  getWeatherIcon,
} from './utils'

export function WeatherWidget() {
  const { isPending, error, data } = useWeatherInfo()
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isPending) {
    return (
      <div className="bg-pending text-pending-foreground flex items-center gap-2 rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out">
        <Loader2 className="size-4 animate-spin" />
        <span>Scanning local atmospheric conditions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error text-error-foreground flex items-center gap-2 rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out">
        <AlertTriangle className="size-4" />
        <span>Failed to analyze weather patterns</span>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        'relative overflow-hidden rounded-lg p-5 shadow-lg transition-all duration-500 ease-in-out',
        getWeatherBackgroundClass(data.condition),
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        isHovering ? 'scale-[1.01] shadow-xl' : 'scale-100'
      )}
    >
      {/* Weather-specific background effects */}
      {data.condition === 'Rain' && (
        <div className="pointer-events-none absolute inset-0 flex justify-around overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-rain bg-primary h-4 w-0.5 rounded opacity-50"
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `${i * 5}%`,
                top: '-20px',
                animationDuration: `${1 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      {data.condition === 'Drizzle' && (
        <div className="pointer-events-none absolute inset-0 flex justify-around overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="animate-rain bg-primary h-2 w-0.5 rounded-full opacity-30"
              style={{
                animationDelay: `${i * 0.15}s`,
                left: `${i * 3.33}%`,
                top: '-20px',
                animationDuration: `${2 + Math.random() * 1}s`,
              }}
            />
          ))}
        </div>
      )}
      {data.condition === 'Snow' && (
        <div className="pointer-events-none absolute inset-0 flex justify-around overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-snow bg-primary size-2 rounded-full opacity-70"
              style={{
                animationDelay: `${i * 0.2}s`,
                left: `${i * 5}%`,
                top: '-10px',
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}
      {data.condition === 'Thunderstorm' && (
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-lightning bg-primary/10 absolute inset-0 opacity-0" />
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="animate-rain bg-primary h-4 w-0.5 rounded opacity-50"
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `${i * 7}%`,
                top: '-20px',
                animationDuration: `${1 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="z-10 space-y-1">
          <div className="flex items-center gap-1 text-sm opacity-90">
            <Sunset className="size-3.5" /> {data.location}
          </div>
          <div className="flex items-center gap-2">
            <div className="transform transition-all hover:scale-110">
              {getWeatherIcon(data.condition, 'size-6')}
            </div>
            <div className="text-lg font-medium">
              {data.temperature}°C - {data.description}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <Droplets className="size-4" />
              <span>{data.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="size-4" />
              <span>{data.windSpeed} m/s</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Feels like: {data.feelsLike}°C</span>
            </div>
          </div>

          <p className="pt-1 text-sm italic opacity-90">
            {getRandomMessage(data.condition)}
          </p>
        </div>
        {data.icon && (
          <div className="z-10 transform transition-all hover:scale-110">
            <Image
              src={data.icon}
              alt={data.description}
              width={80}
              height={80}
              className="animate-float bg-background/25 rounded-full p-1 backdrop-blur-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
