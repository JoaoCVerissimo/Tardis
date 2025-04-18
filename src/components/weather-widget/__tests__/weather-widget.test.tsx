import { WeatherInfo } from '@/hooks/api/mappers/weather'
import { useWeatherInfo } from '@/hooks/api/use-weather-info'
import { QueryObserverResult, UseQueryResult } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { WeatherWidget } from '../../weather-widget/weather-widget'

jest.mock('@/hooks/api/use-weather-info')
const mockUseWeatherInfo = useWeatherInfo as jest.MockedFunction<
  typeof useWeatherInfo
>

// Define a base mock structure matching TanStack Query's result shape
// This helps ensure all required properties are present.
const baseMockQueryResult = {
  data: undefined,
  dataUpdatedAt: Date.now(),
  error: null,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  fetchStatus: 'idle',
  isError: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isFetching: false,
  isInitialLoading: false, // Deprecated in v5, use isPending
  isLoading: false, // Derived from status === 'pending'
  isLoadingError: false, // Derived from status === 'error' && data === undefined
  isPaused: false,
  isPending: false, // Replaces isLoading for initial load status
  isPlaceholderData: false,
  isRefetchError: false, // Derived from status === 'error' && data !== undefined
  isRefetching: false,
  isStale: false,
  isSuccess: true, // Derived from status === 'success'
  // Mock refetch to return a Promise resolving to a minimal QueryObserverResult structure
  refetch: jest.fn(() =>
    Promise.resolve({
      data: undefined, // Provide minimal structure matching QueryObserverResult
      status: 'success',
      // Add other required properties if needed by specific tests
    } as unknown as QueryObserverResult<WeatherInfo, Error>)
  ),
  remove: jest.fn(),
  status: 'success', // 'pending', 'error', 'success'
  // Add a resolved promise to satisfy the type, actual promise content may not matter for most tests
  promise: Promise.resolve(undefined as unknown as WeatherInfo),
} as const // Use 'as const' for stricter typing where appropriate

// Helper type for mock return values to avoid excessive casting
// Use UseQueryResult for better type compatibility
type MockQueryResult = UseQueryResult<WeatherInfo, Error>

describe('WeatherWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state', () => {
    // Mock loading state
    mockUseWeatherInfo.mockReturnValue({
      ...baseMockQueryResult,
      isPending: true,
      isLoading: true, // Keep for compatibility if needed, but isPending is primary
      isInitialLoading: true, // Keep for compatibility if needed
      isSuccess: false,
      status: 'pending',
      fetchStatus: 'fetching',
      data: undefined,
      error: null,
      promise: new Promise(() => {}), // Represent pending promise
      refetch: jest.fn(() =>
        Promise.resolve({
          data: undefined,
          status: 'pending',
        } as unknown as QueryObserverResult<WeatherInfo, Error>)
      ),
    } as MockQueryResult)

    render(<WeatherWidget />)

    expect(
      screen.getByText('Scanning local atmospheric conditions...')
    ).toBeInTheDocument()
  })

  it('should show error state', () => {
    const mockError = new Error('Failed to load weather')
    // Mock error state
    mockUseWeatherInfo.mockReturnValue({
      ...baseMockQueryResult,
      isPending: false,
      isLoading: false,
      isSuccess: false,
      isError: true,
      isLoadingError: true, // Error during initial load
      status: 'error',
      fetchStatus: 'idle',
      error: mockError,
      failureCount: 1,
      failureReason: mockError,
      errorUpdateCount: 1,
      data: undefined,
      refetch: jest.fn(() =>
        Promise.resolve({
          data: undefined,
          status: 'error',
          error: mockError,
        } as unknown as QueryObserverResult<WeatherInfo, Error>)
      ),
    } as MockQueryResult)

    render(<WeatherWidget />)

    expect(
      screen.getByText('Failed to analyze weather patterns')
    ).toBeInTheDocument()
  })

  it('should render Clear weather correctly', () => {
    const mockData: WeatherInfo = {
      temperature: 25,
      feelsLike: 24,
      condition: 'Clear',
      description: 'Clear sky',
      icon: 'https://openweathermap.org/img/wn/01d@2x.png',
      location: 'London',
      humidity: 50,
      windSpeed: 3.5,
    }
    // Mock successful data - Clear weather
    mockUseWeatherInfo.mockReturnValue({
      ...baseMockQueryResult,
      isPending: false,
      isLoading: false,
      isSuccess: true,
      isError: false,
      status: 'success',
      fetchStatus: 'idle',
      data: mockData,
      error: null,
      promise: Promise.resolve(mockData), // Represent resolved promise
      refetch: jest.fn(() =>
        Promise.resolve({
          data: mockData,
          status: 'success',
        } as unknown as QueryObserverResult<WeatherInfo, Error>)
      ),
    } as MockQueryResult)

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

    // Verify we're using the correct background class - updated to check for non-null first
    const container = screen
      .getByText('25°C - Clear sky')
      .closest('div[class*="bg-accent"]')
    expect(container).not.toBeNull()
  })

  it('should render Rain weather correctly', () => {
    const mockData: WeatherInfo = {
      temperature: 18,
      feelsLike: 16,
      condition: 'Rain',
      description: 'Light rain',
      icon: 'https://openweathermap.org/img/wn/10d@2x.png',
      location: 'London',
      humidity: 80,
      windSpeed: 2.1,
    }
    // Mock successful data - Rain weather
    mockUseWeatherInfo.mockReturnValue({
      ...baseMockQueryResult,
      isPending: false,
      isLoading: false,
      isSuccess: true,
      isError: false,
      status: 'success',
      fetchStatus: 'idle',
      data: mockData,
      error: null,
      promise: Promise.resolve(mockData),
      refetch: jest.fn(() =>
        Promise.resolve({
          data: mockData,
          status: 'success',
        } as unknown as QueryObserverResult<WeatherInfo, Error>)
      ),
    } as MockQueryResult)

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

    // Verify we're using the correct background class - updated to check for non-null first
    const container = screen
      .getByText('18°C - Light rain')
      .closest('div[class*="bg-secondary"]')
    expect(container).not.toBeNull()
  })

  it('should render Snow weather correctly', () => {
    const mockData: WeatherInfo = {
      temperature: 0,
      feelsLike: -2,
      condition: 'Snow',
      description: 'Light snow',
      icon: 'https://openweathermap.org/img/wn/13d@2x.png',
      location: 'London',
      humidity: 85,
      windSpeed: 1.5,
    }
    // Mock successful data - Snow weather
    mockUseWeatherInfo.mockReturnValue({
      ...baseMockQueryResult,
      isPending: false,
      isLoading: false,
      isSuccess: true,
      isError: false,
      status: 'success',
      fetchStatus: 'idle',
      data: mockData,
      error: null,
      promise: Promise.resolve(mockData),
      refetch: jest.fn(() =>
        Promise.resolve({
          data: mockData,
          status: 'success',
        } as unknown as QueryObserverResult<WeatherInfo, Error>)
      ),
    } as MockQueryResult)

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

    // Verify we're using the correct background class - updated to check for non-null first
    const container = screen
      .getByText('0°C - Light snow')
      .closest('div[class*="bg-primary"]')
    expect(container).not.toBeNull()
  })

  it('should render Thunderstorm weather correctly', () => {
    const mockData: WeatherInfo = {
      temperature: 22,
      feelsLike: 23,
      condition: 'Thunderstorm',
      description: 'Thunderstorm',
      icon: 'https://openweathermap.org/img/wn/11d@2x.png',
      location: 'London',
      humidity: 75,
      windSpeed: 5.2,
    }
    // Mock successful data - Thunderstorm weather
    mockUseWeatherInfo.mockReturnValue({
      ...baseMockQueryResult,
      isPending: false,
      isLoading: false,
      isSuccess: true,
      isError: false,
      status: 'success',
      fetchStatus: 'idle',
      data: mockData,
      error: null,
      promise: Promise.resolve(mockData),
      refetch: jest.fn(() =>
        Promise.resolve({
          data: mockData,
          status: 'success',
        } as unknown as QueryObserverResult<WeatherInfo, Error>)
      ),
    } as MockQueryResult)

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

    // Verify we're using the correct background class - updated to check for non-null first
    const container = screen
      .getByText('22°C - Thunderstorm')
      .closest('div[class*="bg-accent"]')
    expect(container).not.toBeNull()
  })
})
