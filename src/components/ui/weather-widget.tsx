'use client'

import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { AlertTriangle, Cloud, CloudRain, Loader2, Sun } from 'lucide-react'
import Image from 'next/image'

const weatherMessages = {
  Clear: [
    "Perfect weather for a TARDIS landing! Don't forget your sonic screwdriver!",
    'Clear skies ahead - even better than the Eye of Harmony!',
  ],
  Clouds: [
    'Cloudy with a chance of TARDISes materializing!',
    'Visibility might be low, watch out for Weeping Angels!',
  ],
  Rain: [
    "Rain! I love rain - it's like Earth's natural cooling system.",
    'A bit wet for time travel, might need an umbrella!',
  ],
  Snow: [
    'Snow! Just like that time we visited the Ood Sphere!',
    "Bundle up, it's colder than a Cyberman's handshake!",
  ],
  Thunderstorm: [
    'Lightning! Almost as electric as the TARDIS console!',
    'Stay inside, unless you have a force field generator!',
  ],
  default: [
    "Weather's acting strange - could be temporal interference!",
    'Hmm, reminds me of that one planet... or was it a space station?',
  ],
}

function getRandomMessage(condition: string): string {
  const messages =
    weatherMessages[condition as keyof typeof weatherMessages] ||
    weatherMessages.default
  return messages[Math.floor(Math.random() * messages.length)]
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case 'Clear':
      return <Sun className="size-6 text-yellow-500" />
    case 'Clouds':
      return <Cloud className="size-6 text-gray-500" />
    case 'Rain':
    case 'Drizzle':
      return <CloudRain className="size-6 text-blue-500" />
    default:
      return null
  }
}

export function WeatherWidget() {
  const { isPending, error, data } = useWeatherInfo()

  if (isPending) {
    return (
      <div className="bg-pending text-pending-foreground flex items-center gap-2 rounded-lg p-4">
        <Loader2 className="size-4 animate-spin" />
        <span>Scanning local atmospheric conditions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error text-error-foreground flex items-center gap-2 rounded-lg p-4">
        <AlertTriangle className="size-4" />
        <span>Failed to analyze weather patterns</span>
      </div>
    )
  }

  return (
    <div className="bg-accent text-accent-foreground relative rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-accent-foreground/80 text-sm">
            {data.location}
          </div>
          <div className="flex items-center gap-2">
            <div>{getWeatherIcon(data.condition)}</div>
            <div className="text-lg font-medium">
              {data.temperature}°C - {data.description}
            </div>
          </div>
          <p className="text-accent-foreground/90">
            {getRandomMessage(data.condition)}
          </p>
        </div>
        {data.icon && (
          <Image
            src={data.icon}
            alt={data.description}
            width={50}
            height={50}
            className="bg-accent-foreground/10 rounded-full"
          />
        )}
      </div>
    </div>
  )
}
