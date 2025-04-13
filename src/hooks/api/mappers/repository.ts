interface GithubRepositoryResponse {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  subscribers_count: number
}

export interface RepositoryInfo {
  name: string
  description: string | null
  stars: number
  forks: number
  watchers: number
}

export function mapRepositoryInfo(
  data: GithubRepositoryResponse
): RepositoryInfo {
  return {
    name: data.name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.subscribers_count,
  }
}
