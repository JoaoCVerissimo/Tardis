import {
  RepositoryInfo,
  mapRepositoryInfo,
} from '@/hooks/api/mappers/repository'
import { useQuery } from '@tanstack/react-query'

const REPOSITORY_URL = 'https://api.github.com/repos/JoaoCVerissimo/Tardis'
const REPOSITORY_QUERY_KEY = ['repository-info'] as const

async function fetchRepositoryInfo(): Promise<RepositoryInfo> {
  const response = await fetch(REPOSITORY_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch repository data')
  }
  const data = await response.json()
  return mapRepositoryInfo(data)
}

export function useRepositoryInfo() {
  return useQuery<RepositoryInfo>({
    queryKey: REPOSITORY_QUERY_KEY,
    queryFn: fetchRepositoryInfo,
  })
}
