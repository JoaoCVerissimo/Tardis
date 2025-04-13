import { RepositoryStats } from '@/components/ui/repository-stats'

export default function About() {
  return (
    <div className="space-y-8">
      <div>
        <h1>About Tardis</h1>
        <p className="text-muted-foreground">
          A playground for experimenting with modern web technologies and
          sharing development experiences.
        </p>
      </div>

      <div>
        <h2>Project Repository</h2>
        <RepositoryStats />
      </div>
    </div>
  )
}
