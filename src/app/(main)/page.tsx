import { RepositoryStats } from '@/components/ui/repository-stats'

export default function Home() {
  return (
    <>
      <div className="space-y-8">
        <div>
          <h1>Welcome to Tardis</h1>
          <p className="text-muted-foreground">
            A personal portfolio and experimental website project.
          </p>
        </div>

        <div>
          <h2 className="mb-4">Project Repository</h2>
          <RepositoryStats />
        </div>
      </div>
    </>
  )
}
