export interface WeatherInfo {
  location: string
  temperature: number
  condition: string
  description: string
  icon: string
}

export interface WeatherResponse {
  name: string
  main: {
    temp: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
}

export function mapWeatherInfo(data: WeatherResponse): WeatherInfo {
  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  }
}
