export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1>Welcome to Tardis</h1>
        <p className="text-muted-foreground">
          A personal portfolio and experimental website project showcasing
          modern web development practices and technologies.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3>Modern Stack</h3>
            <p className="text-muted-foreground">
              Built with Next.js 15, TypeScript, and Tailwind CSS for a robust
              and maintainable codebase.
            </p>
          </div>
          <div className="space-y-2">
            <h3>Design System</h3>
            <p className="text-muted-foreground">
              Comprehensive design system with consistent components and
              typography.
            </p>
          </div>
          <div className="space-y-2">
            <h3>API Integration</h3>
            <p className="text-muted-foreground">
              Efficient data fetching with TanStack Query and proper caching
              strategies.
            </p>
          </div>
          <div className="space-y-2">
            <h3>Best Practices</h3>
            <p className="text-muted-foreground">
              Following industry standards for code organization, testing, and
              documentation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2>Get Started</h2>
        <p className="text-muted-foreground">
          Explore the website to learn more about the project, its features, and
          the technologies used. Check out the design system to see our UI
          components in action.
        </p>
      </div>
    </div>
  )
}
