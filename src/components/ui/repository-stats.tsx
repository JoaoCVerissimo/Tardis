'use client'

import { useRepositoryInfo } from '@/hooks/api/use-repository-info'

export function RepositoryStats() {
  const { isPending, error, data } = useRepositoryInfo()

  if (isPending) {
    return (
      <div className="bg-pending text-pending-foreground rounded-lg border p-4">
        Loading repository information...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error text-error-foreground rounded-lg border p-4">
        Failed to load repository information
      </div>
    )
  }

  return (
    <div className="bg-secondary text-foreground rounded-lg border p-4">
      <h2 className="text-xl font-semibold">{data.name}</h2>
      {data.description && (
        <p className="text-muted-foreground mt-2">{data.description}</p>
      )}
      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="Watchers">
            👀
          </span>
          <span>{data.watchers}</span>
        </div>
        <div className="flex items-center gap-2">
          <span role="img" aria-label="Stars">
            ⭐️
          </span>
          <span>{data.stars}</span>
        </div>
        <div className="flex items-center gap-2">
          <span role="img" aria-label="Forks">
            🍴
          </span>
          <span>{data.forks}</span>
        </div>
      </div>
    </div>
  )
}
