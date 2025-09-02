import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.isLoggedIn) {
    // Try refresh and re-fetch
    try { await $fetch('/api/auth/refresh', { method: 'POST' }) } catch { /* ignore */ }
    try { await auth.fetchCurrentUser() } catch { /* ignore */ }
    if (!auth.isLoggedIn) return navigateTo('/auth/login')
  }
})
