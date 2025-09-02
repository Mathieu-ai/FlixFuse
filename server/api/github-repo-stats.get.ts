import { eventHandler } from 'h3'
import type { H3Event } from 'h3'

export default eventHandler(async (_event: H3Event) => {
  // Use a GitHub token if provided to increase rate limits
  const token = process.env.GITHUB_TOKEN || ''

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    // Server-side fetch to GitHub API
    const resUnknown = await $fetch('https://api.github.com/repos/Mathieu-ai/PawGo', { headers }) as unknown
    const res = resUnknown as Record<string, unknown>

    return {
      stars: (res['stargazers_count'] as number) ?? 0,
      forks: (res['forks_count'] as number) ?? 0,
      repo: (res['full_name'] as string) ?? 'Mathieu-ai/PawGo',
      fetched_at: new Date().toISOString()
    }
  } catch (err: unknown) {
    // Keep the response shape consistent
    const message = err instanceof Error ? err.message : String(err)
    return {
      stars: null,
      forks: null,
      repo: 'Mathieu-ai/PawGo',
      error: message
    }
  }
})
