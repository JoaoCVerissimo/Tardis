import { fetchWeatherData } from '@/lib/weatherUtils'
import { NextRequest, NextResponse } from 'next/server'

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

    const data = await fetchWeatherData(parseFloat(lat), parseFloat(lon))

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data from provider' },
        { status: 502 }
      )
    }

    // Return the full weather data fetched by the utility function
    return NextResponse.json(data)
  } catch (error) {
    console.error('API route /api/weather error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
