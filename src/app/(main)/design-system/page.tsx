export default function DesignSystem() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Design System</h1>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Typography System
        </h2>
        <p className="text-lg">
          A clean, consistent typographic system using Geist font family.
        </p>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Heading Level 2
          </h2>
          <h3 className="text-2xl font-semibold tracking-tight">
            Heading Level 3
          </h3>
          <h4 className="text-xl font-semibold tracking-tight">
            Heading Level 4
          </h4>

          <p>
            Regular paragraph text. The quick brown fox jumps over the lazy dog.
            This demonstrates our base font size and line height.
          </p>

          <p className="text-lg">
            Large text variant for emphasis without using a heading.
          </p>

          <p className="text-muted-foreground text-sm">
            Small text variant for auxiliary information.
          </p>

          <p>
            Here is an example of <code>inline code</code> within text.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">Color System</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-primary text-primary-foreground rounded p-4">
            Primary Color
          </div>
          <div className="bg-secondary text-secondary-foreground rounded p-4">
            Secondary Color
          </div>
          <div className="bg-accent text-accent-foreground rounded p-4">
            Accent Color
          </div>
          <div className="bg-muted text-muted-foreground rounded p-4">
            Muted Color
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">Font Families</h2>
        <div className="space-y-4">
          <p className="font-sans">
            Geist Sans - Primary font for most content
          </p>
          <p className="font-mono">
            Geist Mono - Monospace font for code and technical content
          </p>
        </div>
      </section>
    </div>
  )
}
