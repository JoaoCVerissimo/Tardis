import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { render } from '@/tests/test-utils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { SimpleWeatherWidget } from '../simple-weather-widget'
import * as weatherUtils from '../utils' // Import utils to spy on them

// Mock the useWeatherInfo hook
jest.mock('@/hooks/api/use-weather-info')
const mockUseWeatherInfo = useWeatherInfo as jest.Mock

// Mock the getRandomMessage function for deterministic tests
jest.spyOn(weatherUtils, 'getRandomMessage').mockReturnValue('Test message')

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const original = jest.requireActual('lucide-react')
  return {
    ...original,
    Loader2: () => <div data-testid="loader-icon" />,
    AlertTriangle: () => <div data-testid="alert-icon" />,
    Sun: () => <div data-testid="sun-icon" />,
    Cloud: () => <div data-testid="cloud-icon" />,
    CloudRain: () => <div data-testid="rain-icon" />,
    Snowflake: () => <div data-testid="snow-icon" />,
    CloudLightning: () => <div data-testid="thunderstorm-icon" />,
    Sunset: () => <div data-testid="sunset-icon" />,
    Droplets: () => <div data-testid="droplets-icon" />,
    Wind: () => <div data-testid="wind-icon" />,
  }
})

describe('SimpleWeatherWidget', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseWeatherInfo.mockClear()
    ;(weatherUtils.getRandomMessage as jest.Mock).mockClear()
  })

  it('renders loading state correctly', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: true,
      error: null,
      data: null,
    })
    render(<SimpleWeatherWidget />)

    // Wait for the component to become visible
    await waitFor(() => {
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByTestId('loader-icon').parentElement).toHaveClass(
      'bg-pending'
    )
  })

  it('renders error state correctly and shows tooltip on hover', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: new Error('Failed to fetch'),
      data: null,
    })
    render(<SimpleWeatherWidget />)

    // Wait for the component to become visible
    const errorElement = await screen.findByTestId('alert-icon')
    expect(errorElement).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(errorElement.parentElement).toHaveClass('bg-error')

    // Test tooltip
    fireEvent.mouseEnter(errorElement.parentElement!)
    await waitFor(() => {
      expect(
        screen.getByText('Failed to analyze weather patterns')
      ).toBeInTheDocument()
    })
  })

  it('renders success state correctly for "Clear" condition and shows tooltip', async () => {
    const mockWeatherData = {
      location: 'Test City',
      condition: 'Clear',
      temperature: 25,
      feelsLike: 27,
      humidity: 60,
      windSpeed: 5,
      description: 'Sunny day',
    }
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: mockWeatherData,
    })

    render(<SimpleWeatherWidget />)

    // Wait for the component to become visible and check content
    const conditionElement = await screen.findByText('Clear')
    expect(conditionElement).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument() // Assuming getWeatherIcon returns Sun for Clear
    expect(conditionElement.parentElement).toHaveClass('bg-weather-clear') // Check background class

    // Test tooltip content
    fireEvent.mouseEnter(conditionElement.parentElement!)

    await waitFor(() => {
      expect(screen.getByText('Test City')).toBeInTheDocument()
      expect(screen.getByTestId('sunset-icon')).toBeInTheDocument()
      expect(
        screen.getByText('25°C (Sunny day). Feels like 27°C.')
      ).toBeInTheDocument()
      expect(screen.getByText('60%')).toBeInTheDocument()
      expect(screen.getByTestId('droplets-icon')).toBeInTheDocument()
      expect(screen.getByText('5 m/s')).toBeInTheDocument()
      expect(screen.getByTestId('wind-icon')).toBeInTheDocument()
      expect(screen.getByText('"Test message"')).toBeInTheDocument() // Check mocked random message
    })

    // Ensure getRandomMessage was called with the correct condition
    expect(weatherUtils.getRandomMessage).toHaveBeenCalledWith('Clear')
  })

  it('renders success state correctly for "Clouds" condition', async () => {
    const mockWeatherData = {
      location: 'Cloudy Town',
      condition: 'Clouds',
      temperature: 18,
      feelsLike: 17,
      humidity: 75,
      windSpeed: 3,
      description: 'Partly cloudy',
    }
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: mockWeatherData,
    })

    render(<SimpleWeatherWidget />)

    const conditionElement = await screen.findByText('Clouds')
    expect(conditionElement).toBeInTheDocument()
    expect(screen.getByTestId('cloud-icon')).toBeInTheDocument()
    expect(conditionElement.parentElement).toHaveClass('bg-weather-clouds')
  })

  // Add similar tests for Rain, Snow, Thunderstorm conditions
  it('renders success state correctly for "Rain" condition', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: { condition: 'Rain', location: 'Rainy Place' /* other data */ },
    })
    render(<SimpleWeatherWidget />)
    const conditionElement = await screen.findByText('Rain')
    expect(screen.getByTestId('rain-icon')).toBeInTheDocument()
    expect(conditionElement.parentElement).toHaveClass('bg-weather-rain')
  })

  it('renders success state correctly for "Snow" condition', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: { condition: 'Snow', location: 'Snowy Village' /* other data */ },
    })
    render(<SimpleWeatherWidget />)
    const conditionElement = await screen.findByText('Snow')
    expect(screen.getByTestId('snow-icon')).toBeInTheDocument()
    expect(conditionElement.parentElement).toHaveClass('bg-weather-snow')
  })

  it('renders success state correctly for "Thunderstorm" condition', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: {
        condition: 'Thunderstorm',
        location: 'Stormy City',
        /* other data */
      },
    })
    render(<SimpleWeatherWidget />)
    const conditionElement = await screen.findByText('Thunderstorm')
    expect(screen.getByTestId('thunderstorm-icon')).toBeInTheDocument()
    expect(conditionElement.parentElement).toHaveClass(
      'bg-weather-thunderstorm'
    )
  })
})
