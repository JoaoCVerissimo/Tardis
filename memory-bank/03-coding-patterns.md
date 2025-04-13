# Coding Patterns and Practices

## Design System

### Colors

The application uses a dark theme with the following color palette:

- Background: Dark blue-gray (HSL 222 47% 11%)
- Foreground: Light gray (HSL 213 31% 91%)
- Primary: Almost white (HSL 210 40% 98%)
- Secondary: Darker blue-gray (HSL 217 32% 17%)
- Accent: Mid blue-gray (HSL 215 25% 27%)
- Error: Warm red (HSL 0 84% 40%)
- Pending: Neutral blue-gray (HSL 215 25% 27%)
- Muted: Dark blue-gray with reduced opacity

States and their foreground colors:

- Error: Error background with light foreground
- Pending: Pending background with muted text

VS Code's theme is customized to match this color palette through `.vscode/settings.json`. The editor uses:

- Dark blue-gray (#151923) for backgrounds
- Light gray (#E1E7F0) for most text
- Almost white (#F8FAFC) for active/highlighted elements
- Darker blue-gray (#2A3545) for badges and accents

### Typography

#### Font Families

- Primary: Geist Sans (`font-sans`) - Modern, clean sans-serif for general content
- Monospace: Geist Mono (`font-mono`) - Technical content and code blocks

#### Type Scale

- 2xs: 0.75rem (12px)
- xs: 0.8125rem (13px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)

#### Text Styles

```typescript
// Heading styles
h1: text-4xl font-bold tracking-tight
h2: text-3xl font-semibold tracking-tight
h3: text-2xl font-semibold tracking-tight
h4: text-xl font-semibold tracking-tight

// Paragraph styles
p: text-base leading-7
.lead: text-xl text-muted-foreground
.large: text-lg font-semibold
.small: text-sm font-medium leading-none
code: relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm
```

## Component Architecture

### Component Organization

```
components/
├── ui/               # Reusable UI components
├── features/         # Feature-specific components
└── shared/          # Shared components across features
```

### Layout Organization

Layouts are managed through Next.js App Router:

```
app/
├── layout.tsx        # Root layout (fonts, global styles)
└── (main)/          # Main route group
    ├── layout.tsx   # Shared layout (navbar, container)
    ├── page.tsx     # Homepage
    └── design-system/ # Design system page
        └── page.tsx
```

Remember:

- Route groups (in parentheses) organize routes without affecting URL structure
- Layouts automatically wrap nested routes
- Root layout is required and wraps all pages

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

## Code Formatting

### Prettier Configuration

The project uses Prettier for consistent code formatting with the following configuration:

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "tailwindFunctions": ["clsx"],
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

VS Code is configured to automatically format files on save. This is managed through `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

You can also manually format files using:

- `yarn format` - Format all files
- `yarn format:check` - Check files for formatting issues

### ESLint Integration

ESLint is configured to work with Prettier through `eslint-config-prettier` and `eslint-plugin-prettier`.

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

### API Data Fetching

- API hooks located in `src/hooks/api` directory
- Use TanStack Query for server state management
- Follow naming convention: `use-<resource>-<action>`
- Implement proper error handling and loading states
- Define TypeScript interfaces for API responses

Example pattern:

```typescript
// src/hooks/api/use-resource-action.ts
interface ResourceData {
  // Define response type
}

const RESOURCE_URL = '/api/endpoint'
const RESOURCE_QUERY_KEY = ['resource-key'] as const

async function fetchResourceData(): Promise<ResourceData> {
  const response = await fetch(RESOURCE_URL)
  if (!response.ok) {
    throw new Error('Request failed')
  }
  const data = await response.json()
  return data
}

export function useResourceAction() {
  return useQuery<ResourceData>({
    queryKey: RESOURCE_QUERY_KEY,
    queryFn: fetchResourceData,
  })
}
```

Best practices:

- Extract URLs and query keys as constants
- Define fetch functions outside hooks for separation of concerns
- Return typed data from fetch functions
- Use consistent error handling patterns

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
    'bg-background text-foreground',
    // Responsive
    'md:flex-row lg:gap-6',
    // States
    'hover:bg-secondary',
    // Custom classes
    className
  )}
>
```

### CSS Variables

All colors are defined using HSL values for better control over lightness and opacity:

```css
:root {
  --background: 222 47% 11%;
  --foreground: 213 31% 91%;
  /* ... other color tokens */
}
```

## Project Structure

```
(root)/
├── public/            # Static files served from base URL (/)
│   └── assets/        # Static assets (images, etc.)
├── src/              # Application source code
│   ├── app/          # Next.js app directory
│   │   ├── favicon.ico    # App favicon (must be in app directory)
│   │   ├── globals.css    # Application-wide styles
│   │   └── ...           # Pages and layouts
│   ├── components/   # React components
│   ├── lib/         # Utility functions
│   ├── hooks/       # Custom hooks
│   └── types/       # TypeScript types
├── .vscode/         # Editor settings
└── ...             # Config files
```

### File Organization

- `public/assets/`: Contains static files served directly from the base URL (/)
- `src/app/favicon.ico`: Must be in app directory for Next.js App Router to handle it correctly
- `src/app/globals.css`: Must be in app directory for Next.js automatic style integration
- `src/components/`: Organized React components (see Component Organization above)
- `.vscode/`: Editor-specific settings for consistent development experience

Remember to:

- Keep components focused and single-responsibility
- Write comprehensive tests
- Document complex logic
- Use TypeScript features effectively
- Follow consistent formatting
- Use meaningful commit messages
