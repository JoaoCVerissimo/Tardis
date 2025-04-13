import { useQuery } from '@tanstack/react-query'
import { WeatherInfo, WeatherResponse, mapWeatherInfo } from './mappers/weather'

// London coordinates as fallback
const FALLBACK_LOCATION = {
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
}

async function fetchWeatherInfo(
  lat: number,
  lon: number
): Promise<WeatherInfo> {
  // Using our server-side API route instead of directly calling OpenWeather API
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
  })

  const response = await fetch(`/api/weather?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data: WeatherResponse = await response.json()
  return mapWeatherInfo(data)
}

export function useWeatherInfo() {
  const locationQuery = useQuery({
    queryKey: ['geolocation'],
    queryFn: () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'))
          return
        }

        // Add timeout to fall back to London if permission takes too long
        const timeoutId = setTimeout(() => {
          reject(new Error('Geolocation request timed out'))
        }, 5000)

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId)
            resolve(position)
          },
          (error) => {
            clearTimeout(timeoutId)
            reject(error)
          },
          { maximumAge: 10 * 60 * 1000 } // Cache location for 10 minutes
        )
      }),
    retry: false,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
  })

  // Use London as fallback if geolocation fails or is not yet resolved
  const coords = locationQuery.data?.coords ?? FALLBACK_LOCATION

  return {
    ...useQuery({
      queryKey: ['weather', coords.latitude, coords.longitude],
      queryFn: async () =>
        await fetchWeatherInfo(coords.latitude, coords.longitude),
      enabled: !!coords,
    }),
  }
}
