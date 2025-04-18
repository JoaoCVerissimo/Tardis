import { NextRequest } from 'next/server'
import { GET } from '../route'

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url) => ({
    url,
    nextUrl: new URL(url),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

const originalEnv = process.env

describe('Weather API Route', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv, OPENWEATHER_API_KEY: 'test-api-key' }
    global.fetch = jest.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  it('should return 400 if lat or lon is missing', async () => {
    // Create a request with missing parameters
    const request = new NextRequest('https://example.com/api/weather')
    const response = await GET(request)

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data).toEqual({ error: 'Missing lat or lon parameters' })
  })

  it('should return 502 if API key is missing', async () => {
    // Remove API key
    process.env.OPENWEATHER_API_KEY = ''

    // Create request with required params
    const request = new NextRequest(
      'https://example.com/api/weather?lat=35&lon=139'
    )
    const response = await GET(request)

    expect(response.status).toBe(502)
    const data = await response.json()
    expect(data.error).toContain('Failed to fetch weather data')
  })

  it('should return 502 if OpenWeather API returns unauthorized', async () => {
    // Mock fetch to return a 401 response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue('Unauthorized'),
      statusText: 'Unauthorized',
    })

    // Create request with required params
    const request = new NextRequest(
      'https://example.com/api/weather?lat=35&lon=139'
    )
    const response = await GET(request)

    expect(response.status).toBe(502)
    const data = await response.json()
    expect(data.error).toContain('Failed to fetch weather data')
  })

  it('should return 502 if OpenWeather API returns other error', async () => {
    // Mock fetch to return a 500 response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server Error'),
      statusText: 'Server Error',
    })

    // Create request with required params
    const request = new NextRequest(
      'https://example.com/api/weather?lat=35&lon=139'
    )
    const response = await GET(request)

    expect(response.status).toBe(502)
    const data = await response.json()
    expect(data.error).toContain('Failed to fetch weather data')
  })

  it('should return weather data on successful API call', async () => {
    // Sample weather data
    const mockWeatherData = {
      coord: { lon: 139, lat: 35 },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      base: 'stations',
      main: {
        temp: 25,
        feels_like: 24,
        temp_min: 22,
        temp_max: 27,
        pressure: 1012,
        humidity: 50,
      },
      wind: { speed: 3.5, deg: 180 },
      clouds: { all: 0 },
      dt: 1630000000,
      sys: { country: 'JP', sunrise: 1629900000, sunset: 1629950000 },
      name: 'Tokyo',
    }

    // Mock successful fetch response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    })

    // Create request with required params
    const request = new NextRequest(
      'https://example.com/api/weather?lat=35&lon=139'
    )
    const response = await GET(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual(mockWeatherData)

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.openweathermap.org/data/2.5/weather')
    )
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('lat=35'))
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('lon=139')
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('appid=test-api-key')
    )
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'))

    const request = new NextRequest(
      'https://example.com/api/weather?lat=35&lon=139'
    )
    const response = await GET(request)

    expect(response.status).toBe(502)
    const data = await response.json()
    expect(data.error).toContain('Failed to fetch weather data')
  })
})
