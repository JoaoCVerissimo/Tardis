import { useQuery } from '@tanstack/react-query'
import { WeatherInfo, WeatherResponse, mapWeatherInfo } from './mappers/weather'

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHER_QUERY_KEY = ['weather-info'] as const

async function fetchWeatherInfo(
  lat: number,
  lon: number
): Promise<WeatherInfo> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    appid: process.env.OPENWEATHER_API_KEY!,
    units: 'metric',
  })

  const response = await fetch(`${WEATHER_URL}?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data: WeatherResponse = await response.json()
  return mapWeatherInfo(data)
}

export function useWeatherInfo() {
  const { data: position } = useQuery({
    queryKey: ['geolocation'],
    queryFn: () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject)
      }),
  })

  return useQuery({
    queryKey: [
      ...WEATHER_QUERY_KEY,
      position?.coords?.latitude,
      position?.coords?.longitude,
    ],
    queryFn: () =>
      fetchWeatherInfo(position!.coords.latitude, position!.coords.longitude),
    enabled: !!position,
  })
}
