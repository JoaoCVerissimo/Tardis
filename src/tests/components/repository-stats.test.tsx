import { RepositoryStats } from '@/components/ui/repository-stats'
import * as hooks from '@/hooks/api/use-repository-info'
import { render } from '@/test-utils'

jest.mock('@/hooks/api/use-repository-info')
const mockUseRepositoryInfo = hooks.useRepositoryInfo as jest.Mock

describe('RepositoryStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUseRepositoryInfo.mockReturnValue({
      isPending: true,
      error: null,
      data: undefined,
    })

    const { getByText } = render(<RepositoryStats />)
    expect(getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseRepositoryInfo.mockReturnValue({
      isPending: false,
      error: new Error('Failed to fetch'),
      data: undefined,
    })

    const { getByText } = render(<RepositoryStats />)
    expect(getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('shows repository information', () => {
    mockUseRepositoryInfo.mockReturnValue({
      isPending: false,
      error: null,
      data: {
        name: 'Test Repo',
        description: 'Test Description',
        stars: 10,
        watchers: 5,
        forks: 3,
      },
    })

    const { getByText } = render(<RepositoryStats />)
    expect(getByText('Test Repo')).toBeInTheDocument()
    expect(getByText('Test Description')).toBeInTheDocument()
    expect(getByText('10')).toBeInTheDocument()
    expect(getByText('5')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
  })
})
