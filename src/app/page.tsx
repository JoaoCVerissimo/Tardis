import Navbar from '@/components/ui/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl space-y-8 p-8">
        <section className="space-y-4">
          <h1>Typography System</h1>
          <p className="text-lg">
            A clean, consistent typographic system using Geist font family.
          </p>

          <div className="space-y-4">
            <h2>Heading Level 2</h2>
            <h3>Heading Level 3</h3>
            <h4>Heading Level 4</h4>

            <p>
              Regular paragraph text. The quick brown fox jumps over the lazy
              dog. This demonstrates our base font size and line height.
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
          <h2>Color System</h2>
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
          <h2>Font Families</h2>
          <div className="space-y-4">
            <p className="font-sans">
              Geist Sans - Primary font for most content
            </p>
            <p className="font-mono">
              Geist Mono - Monospace font for code and technical content
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
