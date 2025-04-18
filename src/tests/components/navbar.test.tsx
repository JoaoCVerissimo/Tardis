import Navbar from '@/components/ui/Navbar'
import { render } from '@/tests/test-utils'

describe('Navbar', () => {
  it('renders logo with home link', () => {
    const { getByText } = render(<Navbar />)
    const logo = getByText('Tardis')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders menu button', () => {
    const { getByRole } = render(<Navbar />)
    expect(getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const testClass = 'test-class'
    const { container } = render(<Navbar className={testClass} />)
    expect(container.firstChild).toHaveClass(testClass)
  })
})
