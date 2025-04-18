// Shared constants and types for weather-related functionality
import type { WeatherResponse } from '@/hooks/api/mappers/weather'

/**
 * Represents the possible weather-based themes.
 * 'default' is used when no specific weather theme applies or as a fallback.
 */
export type Theme =
  | 'default'
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'snow'
  | 'thunderstorm'

/**
 * OpenWeatherMap API endpoint. Using v2.5 which is a free tiers.
 */
export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

/**
 * Default location coordinates (London) used as a fallback when
 * geolocation fails or is unavailable (e.g., server-side).
 */
export const FALLBACK_LOCATION = {
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
}

/**
 * Maps OpenWeatherMap main weather conditions (lowercase) to corresponding theme names.
 * Includes common conditions. Add more mappings as needed based on API responses.
 * See: https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
 */
export const weatherToThemeMap: Record<string, Theme> = {
  clear: 'clear',
  clouds: 'clouds', // Covers few clouds, scattered clouds, broken clouds, overcast clouds
  rain: 'rain', // Covers light rain, moderate rain, heavy intensity rain, very heavy rain, extreme rain, freezing rain
  drizzle: 'rain', // Covers light intensity drizzle, drizzle, heavy intensity drizzle, etc.
  snow: 'snow', // Covers light snow, snow, heavy snow, sleet, etc.
  thunderstorm: 'thunderstorm', // Covers thunderstorm with light rain, rain, heavy rain, etc.
}

/**
 * Maps a weather condition string (case-insensitive) to a Theme.
 * @param condition - The main weather condition (e.g., "Clear", "Rain", "clouds").
 * @returns The corresponding Theme, or 'default' if no specific mapping exists.
 */
export function mapConditionToTheme(condition?: string | null): Theme {
  if (!condition) {
    return 'default'
  }
  // Normalize condition to lowercase for matching
  const lowerCaseCondition = condition.toLowerCase()
  return weatherToThemeMap[lowerCaseCondition] || 'default'
}

/**
 * Fetches the full weather data from OpenWeatherMap API.
 * Handles API key check, parameter building, fetching, and basic error handling.
 * Returns the full JSON response on success, or null on failure.
 * Requires OPENWEATHER_API_KEY environment variable.
 * @param lat - Latitude.
 * @param lon - Longitude.
 */
export async function fetchWeatherData(
  lat: number,
  lon: number
): Promise<WeatherResponse | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    console.error(
      'fetchWeatherData: Missing OPENWEATHER_API_KEY environment variable.'
    )
    return null
  }

  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    appid: apiKey,
    units: 'metric',
  })

  try {
    const response = await fetch(`${WEATHER_API_URL}?${params}`)

    if (!response.ok) {
      try {
        const errorData = await response.json()
        console.error(
          `fetchWeatherData: OpenWeatherMap API error: Status ${response.status}`,
          errorData
        )
      } catch {
        console.error(
          `fetchWeatherData: OpenWeatherMap API error: Status ${response.status}, ${response.statusText}`
        )
      }
      return null // Indicate failure
    }

    const data = await response.json()
    return data // Return full data on success
  } catch (error) {
    console.error('fetchWeatherData: Network or other error:', error)
    return null // Indicate failure
  }
}

/**
 * Fetches only the main weather condition (e.g., "Clear", "Clouds") using fetchWeatherData.
 * Intended primarily for server-side theme determination where only the condition is needed.
 * Requires OPENWEATHER_API_KEY environment variable.
 * @param lat - Latitude.
 * @param lon - Longitude.
 * @returns The main weather condition string (e.g., "Clear") or null if fetch fails or API key is missing.
 */
export async function fetchWeatherCondition(
  lat: number,
  lon: number
): Promise<string | null> {
  try {
    const data = await fetchWeatherData(lat, lon)

    if (!data) {
      return null // Propagate failure from fetchWeatherData
    }

    // Extract the main weather condition
    if (data?.weather?.length > 0 && data.weather[0]?.main) {
      return data.weather[0].main // e.g., "Clear", "Clouds"
    } else {
      console.warn(
        'fetchWeatherCondition: Unexpected API response structure.',
        data
      )
      return null
    }
  } catch (error) {
    console.error(
      'fetchWeatherCondition: Error processing weather data:',
      error
    )
    return null
  }
}
