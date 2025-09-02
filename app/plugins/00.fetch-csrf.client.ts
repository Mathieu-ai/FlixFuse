export default defineNuxtPlugin(() => {
  // Override $fetch on client to attach CSRF header on unsafe methods
  const fetchWithCsrf = $fetch.create({
    onRequest({ options }) {
    const method = String((options as { method?: string }).method || 'GET').toUpperCase()
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const token = useCookie('csrf_token').value
        if (token) {
      const headers = new Headers(options.headers as HeadersInit)
      headers.set('x-csrf-token', token)
      options.headers = headers
        }
      }
    }
  })
  const g = globalThis as unknown as { $fetch: typeof $fetch }
  g.$fetch = fetchWithCsrf as typeof $fetch
})
