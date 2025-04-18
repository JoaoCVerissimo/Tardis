import Home from '@/app/(main)/page'
import { render } from '@/tests/test-utils'

describe('Home page', () => {
  it('renders welcome heading', () => {
    const { getByRole } = render(<Home />)
    expect(getByRole('heading', { name: /welcome/i })).toBeInTheDocument()
  })

  it('renders feature sections', () => {
    const { getByRole } = render(<Home />)
    expect(getByRole('heading', { name: /features/i })).toBeInTheDocument()
    expect(getByRole('heading', { name: /modern stack/i })).toBeInTheDocument()
    expect(getByRole('heading', { name: /design system/i })).toBeInTheDocument()
    expect(
      getByRole('heading', { name: /api integration/i })
    ).toBeInTheDocument()
    expect(
      getByRole('heading', { name: /best practices/i })
    ).toBeInTheDocument()
  })

  it('renders get started section', () => {
    const { getByRole, getByText } = render(<Home />)
    expect(getByRole('heading', { name: /get started/i })).toBeInTheDocument()
    expect(getByText(/explore the website/i)).toBeInTheDocument()
  })
})
