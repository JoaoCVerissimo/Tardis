import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { render, screen } from '@testing-library/react'
import { WeatherWidget } from '../weather-widget'

// Mock the hooks
jest.mock('@/hooks/api/use-weather-info')
const mockUseWeatherInfo = useWeatherInfo as jest.MockedFunction<
  typeof useWeatherInfo
>

describe('WeatherWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state', () => {
    // Mock loading state
    mockUseWeatherInfo.mockReturnValue({
      isPending: true,
      error: null,
      data: undefined,
    })

    render(<WeatherWidget />)

    expect(
      screen.getByText('Scanning local atmospheric conditions...')
    ).toBeInTheDocument()
  })

  it('should show error state', () => {
    // Mock error state
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: new Error('Failed to load weather'),
      data: undefined,
    })

    render(<WeatherWidget />)

    expect(
      screen.getByText('Failed to analyze weather patterns')
    ).toBeInTheDocument()
  })

  it('should render Clear weather correctly', () => {
    // Mock successful data - Clear weather
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: {
        temperature: 25,
        feelsLike: 24,
        condition: 'Clear',
        description: 'Clear sky',
        icon: 'https://openweathermap.org/img/wn/01d@2x.png',
        location: 'London',
        humidity: 50,
        windSpeed: 3.5,
      },
    })

    render(<WeatherWidget />)

    // Main data points should be displayed
    expect(screen.getByText('25°C - Clear sky')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('3.5 m/s')).toBeInTheDocument()
    expect(screen.getByText('Feels like: 24°C')).toBeInTheDocument()

    // Weather message is displayed (we'll only check if a message element exists
    // since the actual message is randomly selected)
    const weatherMessages = screen.getAllByText(
      /Perfect weather for a TARDIS landing|Clear skies ahead/
    )
    expect(weatherMessages.length).toBeGreaterThan(0)

    // Check for weather image
    const img = screen.getByAltText('Clear sky')
    expect(img).toHaveAttribute('src')

    // Verify we're using the correct background class
    const container = screen
      .getByText('25°C - Clear sky')
      .closest('div[class*="bg-accent"]')
    expect(container).toBeInTheDocument()
  })

  it('should render Rain weather correctly', () => {
    // Mock successful data - Rain weather
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: {
        temperature: 18,
        feelsLike: 16,
        condition: 'Rain',
        description: 'Light rain',
        icon: 'https://openweathermap.org/img/wn/10d@2x.png',
        location: 'London',
        humidity: 80,
        windSpeed: 2.1,
      },
    })

    render(<WeatherWidget />)

    // Main data points should be displayed
    expect(screen.getByText('18°C - Light rain')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()

    // Rain-specific weather message
    const weatherMessages = screen.getAllByText(
      /Rain! I love rain|A bit wet for time travel/
    )
    expect(weatherMessages.length).toBeGreaterThan(0)

    // Should have rain animation elements
    const raindrops = document.querySelectorAll('.animate-rain')
    expect(raindrops.length).toBeGreaterThan(0)

    // Verify we're using the correct background class
    const container = screen
      .getByText('18°C - Light rain')
      .closest('div[class*="bg-secondary"]')
    expect(container).toBeInTheDocument()
  })

  it('should render Snow weather correctly', () => {
    // Mock successful data - Snow weather
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: {
        temperature: 0,
        feelsLike: -2,
        condition: 'Snow',
        description: 'Light snow',
        icon: 'https://openweathermap.org/img/wn/13d@2x.png',
        location: 'London',
        humidity: 85,
        windSpeed: 1.5,
      },
    })

    render(<WeatherWidget />)

    // Main data points should be displayed
    expect(screen.getByText('0°C - Light snow')).toBeInTheDocument()

    // Snow-specific message
    const weatherMessages = screen.getAllByText(
      /Snow! Just like that time|Bundle up/
    )
    expect(weatherMessages.length).toBeGreaterThan(0)

    // Should have snow animation elements
    const snowflakes = document.querySelectorAll('.animate-snow')
    expect(snowflakes.length).toBeGreaterThan(0)

    // Verify we're using the correct background class
    const container = screen
      .getByText('0°C - Light snow')
      .closest('div[class*="bg-primary"]')
    expect(container).toBeInTheDocument()
  })

  it('should render Thunderstorm weather correctly', () => {
    // Mock successful data - Thunderstorm weather
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: {
        temperature: 22,
        feelsLike: 23,
        condition: 'Thunderstorm',
        description: 'Thunderstorm',
        icon: 'https://openweathermap.org/img/wn/11d@2x.png',
        location: 'London',
        humidity: 75,
        windSpeed: 5.2,
      },
    })

    render(<WeatherWidget />)

    // Main data points should be displayed
    expect(screen.getByText('22°C - Thunderstorm')).toBeInTheDocument()

    // Thunderstorm-specific message
    const weatherMessages = screen.getAllByText(
      /Lightning! Almost as electric|Stay inside/
    )
    expect(weatherMessages.length).toBeGreaterThan(0)

    // Should have lightning animation element
    const lightning = document.querySelector('.animate-lightning')
    expect(lightning).toBeInTheDocument()

    // Verify we're using the correct background class
    const container = screen
      .getByText('22°C - Thunderstorm')
      .closest('div[class*="bg-accent"]')
    expect(container).toBeInTheDocument()
  })
})
