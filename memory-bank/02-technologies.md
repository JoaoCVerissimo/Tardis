# Technologies Used

## Core Technologies

### Node.js

- Version: 23.11.0 (enforced via .nvmrc)
- Required runtime environment
- Version managed via nvm (Node Version Manager)

### Next.js

- Version: 15+
- App Router architecture
- Server and Client Components
- Built-in routing and API routes
- File-based routing system
- Static and dynamic rendering

### TypeScript

- Version: 5+
- Strict type checking
- Type-safe development
- Enhanced IDE support
- Better code maintainability

### Tailwind CSS

- Version: 4+
- Utility-first CSS framework
- Custom design system integration
- Responsive design utilities

## UI Components

### shadcn/ui

- Version: 2.4.0
- Reusable component library
- Built on Radix UI primitives
- Customizable components
- Accessible by default
- Dark mode support
- Tailwind CSS based styling

## Data Fetching & State Management

### TanStack Query (React Query)

- Version: 5+
- Powerful async data management
- Server state synchronization
- Built-in caching and revalidation
- Request deduplication
- Automatic background updates
- Error handling and retries
- Configured with 5-minute stale time by default

## Testing

### Jest

- Version: 29+
- Unit testing framework
- Snapshot testing
- Code coverage reporting
- Mocking capabilities

### React Testing Library

- Component testing
- User-centric testing approach
- Accessibility testing
- Integration testing
- Best practices for testing React components

## Development Tools

### Package Manager

- Yarn for dependency management
- Lock file for consistent installations
- Workspaces support (if needed)

### Code Quality

- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting

## Best Practices

### Testing

- Write tests for all new components
- Maintain high test coverage
- Focus on user behavior in tests
- Use meaningful test descriptions
- Mock external dependencies appropriately

### Component Development

- Use TypeScript for all components
- Follow accessibility guidelines
- Implement responsive design
- Document component props
- Create reusable components

### Styling

- Use Tailwind CSS classes
- Follow consistent naming conventions
- Maintain design system tokens
- Use CSS variables for theming
- Keep components responsive

### Performance

- Use Next.js Image component
- Implement code splitting
- Optimize bundle size
- Use proper caching strategies
- Monitor performance metrics
