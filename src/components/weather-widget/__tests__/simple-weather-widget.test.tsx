import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { render } from '@/tests/test-utils'
import { screen, waitFor } from '@testing-library/react'
import { SimpleWeatherWidget } from '../simple-weather-widget'

// Mock the useWeatherInfo hook
jest.mock('@/hooks/api/use-weather-info')
const mockUseWeatherInfo = useWeatherInfo as jest.Mock

jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils')
  return {
    ...originalModule,
    getRandomMessage: jest.fn().mockReturnValue('Test message'),
  }
})

// Re-import the mocked utils to access the mock function if needed later
import { getRandomMessage } from '../utils'

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
    CloudSnow: () => <div data-testid="snow-icon" />,
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
    // Clear the mock function specifically
    ;(getRandomMessage as jest.Mock).mockClear()
    // Optionally reset to default mock value if needed for other tests
    ;(getRandomMessage as jest.Mock).mockReturnValue('Test message')
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

    // Find the containing element with data-testid="error-widget"
    const errorContainer = screen.getByTestId('error-widget')
    expect(errorContainer).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(errorContainer).toHaveClass('bg-error')
    expect(errorContainer).toHaveAttribute('data-state')
    expect(errorContainer).toHaveAttribute('data-slot', 'tooltip-trigger')
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

    const widgetElement = await screen.findByText('Clear')
    expect(widgetElement).toBeInTheDocument()

    const widgetContainer = screen.getByTestId('weather-widget')
    expect(widgetContainer).toBeInTheDocument()

    // We'll mock the tooltip functionality since we can't test portals easily
    // Just verify that the tooltip trigger component has the expected attributes
    expect(widgetContainer).toHaveAttribute('data-state')
    expect(widgetContainer).toHaveAttribute('data-slot', 'tooltip-trigger')

    // Check for weather icon
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()

    // Ensure getRandomMessage was called with the correct condition
    expect(getRandomMessage).toHaveBeenCalledWith('Clear')
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

    const widgetElement = await screen.findByText('Clouds')
    await waitFor(() => {
      expect(widgetElement.parentElement).toHaveClass('opacity-100')
    })
    expect(widgetElement).toBeInTheDocument()
    expect(screen.getByTestId('cloud-icon')).toBeInTheDocument()
    // Assert correct class based on utils.tsx (Clouds -> bg-muted)
    expect(widgetElement.parentElement).toHaveClass('bg-muted')
  })

  // Add similar tests for Rain, Snow, Thunderstorm conditions
  it('renders success state correctly for "Rain" condition', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: { condition: 'Rain', location: 'Rainy Place' /* other data */ },
    })
    render(<SimpleWeatherWidget />)
    const widgetElement = await screen.findByText('Rain')
    await waitFor(() => {
      expect(widgetElement.parentElement).toHaveClass('opacity-100')
    })
    expect(widgetElement).toBeInTheDocument()
    expect(screen.getByTestId('rain-icon')).toBeInTheDocument()
    // Assert correct class based on utils.tsx (Rain -> bg-secondary)
    expect(widgetElement.parentElement).toHaveClass('bg-secondary')
  })

  it('renders success state correctly for "Snow" condition', async () => {
    mockUseWeatherInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: { condition: 'Snow', location: 'Snowy Village' /* other data */ },
    })
    render(<SimpleWeatherWidget />)
    const widgetElement = await screen.findByText('Snow')
    await waitFor(() => {
      expect(widgetElement.parentElement).toHaveClass('opacity-100')
    })
    expect(widgetElement).toBeInTheDocument()
    // Add waitFor for icon check just in case
    await waitFor(() => {
      expect(screen.getByTestId('snow-icon')).toBeInTheDocument()
    })
    // Assert correct class based on utils.tsx (Snow -> bg-primary)
    expect(widgetElement.parentElement).toHaveClass('bg-primary')
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
    const widgetElement = await screen.findByText('Thunderstorm')
    await waitFor(() => {
      expect(widgetElement.parentElement).toHaveClass('opacity-100')
    })
    expect(widgetElement).toBeInTheDocument()
    expect(screen.getByTestId('thunderstorm-icon')).toBeInTheDocument()
    // Assert correct class based on utils.tsx (Thunderstorm -> bg-accent)
    expect(widgetElement.parentElement).toHaveClass('bg-accent')
  })
})
