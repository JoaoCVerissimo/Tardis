# Tardis Project Overview

## Introduction

Tardis is a personal portfolio and experimental website project that serves as both a showcase of work and a platform for trying out new tools and technologies.

## Project Goals

- Create a professional portfolio website
- Showcase personal projects and work experience
- Provide a platform for experimenting with new technologies
- Maintain high code quality and testing standards
- Demonstrate best practices in modern web development

## Project Structure

```
tardis/
├── src/               # Source code directory
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable React components
│   └── lib/         # Utility functions and shared code
├── public/           # Static files
├── memory-bank/      # Project documentation
└── tests/           # Test files for components and utilities
```

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
