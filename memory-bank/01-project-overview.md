# Tardis Project Overview

## Introduction

Tardis is a personal portfolio and experimental website project that serves as both a showcase of work and a platform for trying out new tools and technologies.

## Project Goals

- Create a professional portfolio website
- Showcase personal projects and work experience
- Provide a platform for experimenting with new technologies
- Maintain high code quality and testing standards
- Demonstrate best practices in modern web development
- Implement a dynamic, weather-based theming system alongside the default theme

## Project Structure

```
tardis/
├── src/                    # Source code directory
│   ├── app/               # Next.js App Router directory
│   │   ├── (main)/       # Main route group with shared navbar layout
│   │   │   ├── layout.tsx # Main layout with navbar for nested routes
│   │   │   └── page.tsx  # Homepage
│   │   ├── _providers/    # App-level providers (QueryProvider, ThemeProvider)
│   │   └── layout.tsx    # Root layout (fonts, global styles, providers)
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Shadcn UI components
│   │   └── weather-widget/ # Weather widget component
│   └── lib/              # Utility functions and shared code
├── public/               # Static files
├── memory-bank/          # Project documentation
└── tests/               # Test files for components and utilities
```

### Next.js App Router Layouts

The project uses Next.js 13+ App Router with a nested layout structure:

- `src/app/layout.tsx`: Root layout handling fonts, global styles, and wrapping the app with `QueryProvider` and `ThemeProvider`.
- `src/app/(main)/layout.tsx`: Shared layout for main route group with navbar and page container.
- `src/app/_providers/ThemeProvider.tsx`: Manages the dynamic weather-based theme switching by applying a `data-theme` attribute to the HTML element based on weather conditions. Also provides a `setTheme` function for manual overrides (used on the Design System page).
- Route groups (in parentheses) organize routes sharing the same layout without affecting the URL structure.

### Pages

The application consists of the following pages:

1. **Homepage** (`/`)

   - Entry point of the application
   - Comprehensive project introduction
   - Feature grid highlighting key aspects:
     - Modern tech stack
     - Design system
     - API integration
     - Best practices
   - Get started section for navigation
   - Responsive grid layout

2. **About** (`/about`)

   - Project information and background
   - Repository statistics and details
   - Uses TanStack Query for data fetching
   - Features loading and error states

3. **Design System** (`/design-system`)
   - Living documentation of the project's design system
   - Must be updated whenever design system changes are made
   - Showcases:
     - Typography scale and styles
     - Color system and variations
     - Font families (Geist Sans and Mono)
   - Features:
     - Full-width layout with max-width constraint
     - Organized sections with live examples
     - Easily accessible through navbar menu
   - **Important**: This page serves as the single source of truth for design patterns. When making design system changes:
     1. Update the relevant styles in globals.css or theme configuration
     2. Reflect these changes in the design system page
     3. Ensure examples accurately represent current design tokens

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Run development server: `yarn dev`
4. Run tests: `yarn test`

## Development Workflow

1. Create feature branches from main (see Branch Naming Convention)
2. Write tests for new features
3. Implement features following the established patterns
4. Submit pull requests with comprehensive descriptions
5. Ensure all tests pass before merging

## Branch Naming Convention

Branches should follow this pattern: `type/description-in-kebab-case`

Types:

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `refactor/` - Code refactoring with no functional changes
- `docs/` - Documentation updates only
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks, dependency updates, etc.

Examples:

- `feature/add-auth-system`
- `fix/button-alignment`
- `docs/update-api-docs`
- `refactor/improve-error-handling`

## Commit Conventions

Commits should follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Examples:

```
feat(auth): add user authentication system
fix(ui): correct button alignment on mobile
docs: update README with new API endpoints
test(api): add tests for user registration
```

Best Practices:

- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Reference issues in commit body when applicable
- Use present tense ("add feature" not "added feature")

## Build and Deployment

- Development: `yarn dev`
- Testing: `yarn test`
- Build: `yarn build`
- Production: `yarn start`
