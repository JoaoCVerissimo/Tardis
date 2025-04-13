import { NextRequest, NextResponse } from 'next/server'

// Update API URL to v2.5 which is often available for free tier
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing lat or lon parameters' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.error('Missing API key in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      lat: lat,
      lon: lon,
      appid: apiKey,
      units: 'metric',
    })

    const response = await fetch(`${WEATHER_URL}?${params}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Weather API error: Status ${response.status}`, errorText)

      if (response.status === 401) {
        return NextResponse.json(
          {
            error:
              'API key unauthorized. Please check your OpenWeatherMap subscription.',
          },
          { status: 401 }
        )
      }

      throw new Error(`Failed to fetch weather data: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
