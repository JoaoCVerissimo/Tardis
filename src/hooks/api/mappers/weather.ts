// Weather types based on OpenWeatherMap API v2.5 structure
export interface WeatherResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    country?: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

// Our simplified weather model
export interface WeatherInfo {
  temperature: number
  feelsLike: number
  condition: string
  description: string
  icon: string
  location: string
  humidity: number
  windSpeed: number
}

export function mapWeatherInfo(response: WeatherResponse): WeatherInfo {
  const weather = response.weather[0] || {
    main: 'Unknown',
    description: 'No weather data available',
    icon: '',
  }

  return {
    temperature: Math.round(response.main.temp),
    feelsLike: Math.round(response.main.feels_like),
    condition: weather.main,
    description: capitalizeFirstLetter(weather.description),
    icon: weather.icon
      ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
      : '',
    location: response.name || 'Unknown Location',
    humidity: response.main.humidity,
    windSpeed: response.wind.speed,
  }
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
