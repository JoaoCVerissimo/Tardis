# Coding Patterns and Practices

## Component Architecture

### Component Organization

```
components/
├── ui/               # Reusable UI components
├── features/         # Feature-specific components
├── layouts/         # Layout components
└── shared/          # Shared components across features
```

### Component Structure

```typescript
// Example component structure
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

function Button({ children, variant = 'default', className }: ButtonProps) {
  return (
    <button
      className={cn(
        'base-styles',
        variant === 'outline' && 'outline-styles',
        variant === 'ghost' && 'ghost-styles',
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Button
```

## File Naming Conventions

- React Components: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- Utility files: camelCase (e.g., `utils.ts`, `hooks.ts`)
- Test files: Component name + .test.tsx (e.g., `Button.test.tsx`)
- Page components: page.tsx (Next.js 13+ convention)
- Layout components: layout.tsx (Next.js 13+ convention)

## Type Definitions

### Props Interface Naming

```typescript
interface ButtonProps {} // For components
interface UseAuthResult {} // For hooks
type UserState = {} // For global states
```

### Type vs Interface

- Use `interface` for component props and class definitions
- Use `type` for union types, mapped types, and utility types
- Extend interfaces over intersection types when possible

## Testing Patterns

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="outline">Click me</Button>)
    expect(container.firstChild).toHaveClass('outline-styles')
  })
})
```

### Testing Best Practices

1. Test user interactions over implementation
2. Use meaningful test descriptions
3. Group related tests using describe blocks
4. Mock external dependencies
5. Test error states and edge cases

## State Management

### Local State

- Use `useState` for component-level state
- Use `useReducer` for complex state logic

### Global State

- Use React Context for theme/auth/global UI state
- Keep state minimal and focused

## Custom Hooks

### Hook Structure

```typescript
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
```

### Hook Naming Conventions

- Start with 'use' prefix
- Be descriptive about functionality
- Document parameters and return types

## Error Handling

### API Error Pattern

```typescript
interface ApiError {
  message: string
  code: string
  status: number
}

async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    handleError(error)
    throw error
  }
}
```

## CSS/Styling Patterns

### Tailwind Class Organization

```tsx
<div
  className={cn(
    // Layout
    'flex flex-col gap-4',
    // Typography
    'text-lg font-medium',
    // Colors
    'bg-white dark:bg-gray-800',
    // Responsive
    'md:flex-row lg:gap-6',
    // States
    'hover:bg-gray-50 dark:hover:bg-gray-700',
    // Custom classes
    className
  )}
>
```

### CSS Variables

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* Add other design tokens */
}
```

## Project Structure

```
src/
├── app/                  # Next.js app directory
├── components/           # React components
├── lib/                 # Utility functions
├── hooks/               # Custom hooks
├── types/               # TypeScript types
├── styles/              # Global styles
└── tests/               # Test utilities
```

Remember to:

- Keep components focused and single-responsibility
- Write comprehensive tests
- Document complex logic
- Use TypeScript features effectively
- Follow consistent formatting
- Use meaningful commit messages
