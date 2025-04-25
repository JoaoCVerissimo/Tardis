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
- Implement user authentication and protected routes

## Project Structure

```
tardis/
├── public/               # Static files
├── src/                    # Source code directory
│   ├── app/               # Next.js App Router directory
│   │   ├── (main)/       # Main route group with shared navbar layout
│   │   │   ├── layout.tsx # Main layout with navbar for nested routes
│   │   │   ├── page.tsx  # Homepage
│   │   │   ├── about/    # About page route
│   │   │   │   └── page.tsx
│   │   │   └── design-system/ # Design system page route
│   │   │       └── page.tsx
│   │   ├── accounting/    # Accounting page route (protected)
│   │   │   └── page.tsx
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # Auth.js API handler
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── weather/  # Example API route
│   │   │       └── route.ts
│   │   ├── _providers/    # App-level providers (QueryProvider, ThemeProvider)
│   │   └── layout.tsx    # Root layout (fonts, global styles, providers)
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Shadcn UI components
│   │   └── weather-widget/ # Weather widget component
│   ├── lib/              # Utility functions and shared code
│   └── middleware.ts     # Next.js middleware (for auth route protection)
├── tests/               # Test files for components and utilities
├── memory-bank/          # Project documentation
├── .env.local            # Local environment variables (required, untracked)
└── ...                   # Other config files (package.json, tsconfig.json, etc.)
```

### Next.js App Router Layouts

The project uses Next.js 13+ App Router with a nested layout structure:

- `src/app/layout.tsx`: Root layout handling fonts, global styles, and wrapping the app with `QueryProvider` and `ThemeProvider`.
- `src/app/(main)/layout.tsx`: Shared layout for main public route group. Includes the global `Navbar` and page container.
- `src/app/(authenticated)/layout.tsx`: Layout for authenticated routes (`/dashboard`, `/accounting`). Marked as `'use client'`. Wraps content with `SidebarProvider`. Uses the `useSession` hook from `next-auth/react` to get the user session client-side (requires `<SessionProvider>` in the root layout via `ClientProviders`). Includes the `AppSidebar` (passing the session to it), a header with breadcrumbs and a mobile sidebar trigger, and the main content area. Handles loading and unauthenticated states from `useSession`.
- `src/app/_providers/ClientProviders.tsx`: Client component wrapper used in the root layout (`src/app/layout.tsx`) to provide client-side contexts like `SessionProvider`, `QueryClientProvider`, and `ThemeProvider`.
- Route groups (in parentheses) organize routes sharing the same layout without affecting the URL structure.
- **Authentication (Auth.js v5):** Configuration (`authConfig`) and the primary `auth` helper function (used for session checking in Server Components and middleware) are defined and exported directly from the API route handler at `src/app/api/auth/[...nextauth]/route.ts`. Client-side session access uses `useSession`.
- `src/middleware.ts`: Handles route protection using the `auth` helper from the Auth.js route handler. Ensures only authenticated users can access routes within the `(authenticated)` group (currently `/dashboard` and `/accounting`). Located in `src/` because the `app` directory is in `src/`.

### Pages

The application consists of the following pages:

1.  **Homepage** (`/`)

    - Entry point of the application
    - Comprehensive project introduction
    - Feature grid highlighting key aspects:
      - Modern tech stack
      - Design system
      - API integration
      - Best practices
    - Get started section for navigation
    - Responsive grid layout

2.  **About** (`/about`)

    - Project information and background
    - Repository statistics and details
    - Uses TanStack Query for data fetching
    - Features loading and error states

3.  **Design System** (`/design-system`)

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

4.  **Dashboard** (`/dashboard`) - **Protected Route**

    - Requires user authentication.
    - Accessible via the authenticated sidebar.
    - Placeholder content currently.

5.  **Accounting** (`/accounting`) - **Protected Route**
    - Requires user authentication.
    - Accessible via the authenticated sidebar.
    - Provides a compound interest calculator.
    - Features form inputs for initial investment, deposit amount/frequency, and annual rate.
    - Displays yearly results up to 40 years in a table.

## Getting Started

**Important:** Before running the development server, ensure you have created a `.env.local` file in the project root with the necessary environment variables for Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) and Auth.js (`AUTH_SECRET`). See `memory-bank/02-technologies.md` for details on obtaining these.

1. Clone the repository
2. Install dependencies: `yarn install`
3. Create and populate `.env.local` (see above and `02-technologies.md`)
4. Run development server: `yarn dev`
5. Run tests: `yarn test`

## Development Workflow

1. Create feature branches from main (see Branch Naming Convention)
2. Write tests for new features
3. Implement features following the established patterns
4. Update relevant memory bank documentation (`01-project-overview.md`, `02-technologies.md`, `03-coding-patterns.md`)
5. Submit pull requests with comprehensive descriptions
6. Ensure all tests pass before merging

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
