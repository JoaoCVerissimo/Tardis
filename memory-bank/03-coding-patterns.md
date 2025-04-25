# Coding Patterns and Practices

## Design System

### Colors

The application primarily uses a dark blue theme but also features a dynamic, weather-based theming system controlled by `src/app/_providers/ThemeProvider.tsx`. This provider applies a `data-theme` attribute (`clear`, `clouds`, `rain`, `snow`, `thunderstorm`) to the HTML element based on weather data, overriding the default dark blue theme variables defined in `src/app/globals.css`.

#### Default Dark Theme

The default dark theme uses the following color palette:

- Background: Dark blue-gray (HSL 222 47% 11%)
- Foreground: Light gray (HSL 213 31% 91%)
- Primary: Almost white (HSL 210 40% 98%)
- Secondary: Darker blue-gray (HSL 217 32% 17%)
- Accent: Mid blue-gray (HSL 215 25% 27%)
- Error: Warm red (HSL 0 84% 40%)
- Pending: Neutral blue-gray (HSL 215 25% 27%)
- Muted: Dark blue-gray with reduced opacity

#### Weather Themes

Specific color palettes are defined in `src/app/globals.css` within `@theme` blocks and applied via `[data-theme='...']` selectors for the following conditions:

- **Clear:** Light yellows, oranges, and sky blues.
- **Clouds:** Grays, muted blues, and whites.
- **Rain:** Blues, blue-grays, and soft indigos.
- **Snow:** Whites, light cyans, and soft lavenders.
- **Thunderstorm:** Dark indigos, purples, and electric yellows.

Refer to `src/app/globals.css` for the exact HSL values for each theme.

#### States and Foreground Colors (General)

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
├── ui/               # Reusable UI components (from shadcn/ui)
├── weather-widget/   # Weather widget component and related files
├── features/         # Feature-specific components (if any)
└── shared/          # Shared components across features (if any)
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

### Running Tests

- `yarn test` - Run tests once
- `yarn test:watch` - Run tests in watch mode

### Testing Best Practices

1. Test user interactions over implementation
2. Use meaningful test descriptions
3. Group related tests using describe blocks
4. Mock external dependencies
5. Test error states and edge cases

### Test File Organization

Tests are organized in a dedicated test directory structure, mirroring the `src` structure:

```
src/
└── tests/          # Test files directory
    ├── pages/      # Page tests (e.g., home.test.tsx)
    ├── components/ # Component tests (e.g., navbar.test.tsx, weather-widget.test.tsx)
    └── utils/      # Utility function tests
```

Best practices:

- Use `.test.tsx` extension for test files
- Import test utilities from `@/test-utils`
- Mock API hooks in appropriate tests
- Follow same directory structure as source code
- Name test files after their source file (e.g., `navbar.test.tsx` for `Navbar.tsx`)

### Test Utilities

Located in `src/test-utils.tsx`:

- Custom render function with providers
- QueryClient configuration for testing
- Common test utilities and re-exports

### Example Test Pattern

```typescript
import { render } from '@/test-utils'

describe('ComponentName', () => {
  it('renders expected content', () => {
    const { getByRole, getByText } = render(<ComponentName />)
    expect(getByRole('heading')).toBeInTheDocument()
    expect(getByText(/expected content/i)).toBeInTheDocument()
  })

  it('handles different states', () => {
    // Test loading, error, success states
    // Test user interactions
    // Test prop variations
  })
})
```

## State Management

### Theme Management

- **Provider:** `src/app/_providers/ThemeProvider.tsx`
- **Mechanism:** Uses the `useWeatherInfo` hook to fetch weather data. Based on the condition, it sets a `data-theme` attribute on the `<html>` element (`clear`, `clouds`, `rain`, `snow`, `thunderstorm`). If no weather data is available or the condition doesn't match a specific weather theme, it applies `data-theme="default"`. It also exposes a `setTheme` function via the `useTheme` hook to allow manual theme overrides (e.g., for testing on the Design System page). Manual setting prevents automatic weather updates until the next page load or if reset logic is implemented.
- **CSS:** `src/app/globals.css` defines the color variables for each theme (including `default`) within `@theme` blocks and applies them using `[data-theme='...']` selectors. Generic variables (`--color-background`, etc.) are used in base styles and components, automatically adopting the active theme's colors.
- **Usage:** The `ThemeProvider` wraps the application content within the root layout (`src/app/layout.tsx`), ensuring the theme is applied globally. The `useTheme` hook can be used in components to access the current theme or the `setTheme` function.

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
- Configure appropriate cache times
  - Use longer staleTime for data that changes infrequently
  - Adjust gcTime based on how long data should be kept
  - Consider user behavior and data freshness requirements

### Local State

- Use `useState` for component-level state
- Use `useReducer` for complex state logic

### Global State / UI State

- **Theme:** Managed by `ThemeProvider` (see above).
- **Sidebar State:** Managed by `SidebarProvider` (`src/components/ui/sidebar.tsx`). This context provider wraps the authenticated layout (`src/app/(authenticated)/layout.tsx`) and manages the collapsed/expanded state of the `AppSidebar`. It uses `useIsMobile` to default to a collapsed state on mobile devices and persists the state using cookies. The `useSidebar` hook provides access to the state and toggle function.
- **Authentication:** Primarily managed server-side by Auth.js and accessed via `auth()` in Server Components or fetched client-side where necessary (see Authentication State section).

### Authentication State (Auth.js v5)

- **Session Fetching:** The user session is preferably fetched server-side within layouts or pages using the `auth()` function exported from `@/app/api/auth/[...nextauth]/route`.

  ```typescript
  // Example in src/app/(main)/layout.tsx
  import { auth } from '@/app/api/auth/[...nextauth]/route' // Use correct path

  export default async function MainLayout({ children }) {
    const session = await auth()
    // Pass session down to client components if needed
    return <Navbar session={session} />
  }
  ```

- **Client Component Access:** Client components needing session data should use the `useSession` hook from `next-auth/react`. This requires wrapping the application in a `<SessionProvider>` (typically done in a client-side providers component like `src/app/_providers/ClientProviders.tsx` which is then used in the root layout). The hook provides both the session data and the authentication status (`loading`, `authenticated`, `unauthenticated`). Example usage in `src/app/(authenticated)/layout.tsx`.
- **Sign-in/Sign-out:** Authentication actions (sign-in, sign-out) are handled using Server Actions within simple form components, as seen in `src/components/ui/Navbar.tsx`. This avoids the need for client-side JavaScript for these core actions.

  ```typescript
  // Example SignOutButton in Navbar.tsx
  import { signOutAction } from '@/actions/auth'

  function SignOutButton() {
    return (
      <form action={signOutAction}>
        <Button type="submit">Sign Out</Button>
      </form>
    )
  }
  ```

- **Route Protection:** Middleware (`src/middleware.ts`) intercepts requests and uses the `auth` helper to check the session status, redirecting unauthenticated users from protected routes (currently `/dashboard` and `/accounting`). It must be located in `src/` if the `app` directory is also in `src/`.

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

All colors are defined using HSL values in `src/app/globals.css`. Generic variables like `--color-background`, `--color-primary`, etc., are defined in `:root` and map to the currently active theme's specific variables (e.g., `--color-background-clear` when `data-theme='clear'` is active). This allows components to use generic color classes while adapting to the dynamic theme.

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
