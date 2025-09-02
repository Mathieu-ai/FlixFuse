import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  try {
    await auth.initAuth()
  } catch {
    // ignore
  }
})
