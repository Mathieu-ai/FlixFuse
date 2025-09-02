import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  // Initialize auth on app start
  const initAuth = async () => {
    await authStore.initAuth()
  }

  // Login function
  const login = async (identifier: string, password: string, rememberMe = false) => {
    return await authStore.login({ identifier, password, rememberMe })
  }

  // Register function
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName?: string
    phoneNumber?: string
    acceptTerms: boolean
  }) => {
    return await authStore.register(data)
  }

  // Logout function
  const logout = async () => {
    await authStore.logout()
  }

  // Verify email function
  const verifyEmail = async (token: string) => {
    return await authStore.verifyEmail(token)
  }

  // Verify phone function
  const verifyPhone = async (code: string) => {
    return await authStore.verifyPhone(code)
  }

  // Resend verification
  const resendVerification = async (type: 'email' | 'phone', identifier: string) => {
    return await authStore.resendVerification(type, identifier)
  }

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    return await authStore.requestPasswordReset(email)
  }

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    return await authStore.resetPassword(token, newPassword)
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => authStore.isLoggedIn)

  // Get current user
  const user = computed(() => authStore.user)

  // Check if email verification is required
  const requiresEmailVerification = computed(() => authStore.requiresEmailVerification)

  // Get user's full name
  const userFullName = computed(() => authStore.userFullName)

  // Check loading state
  const isLoading = computed(() => authStore.isLoading)

  return {
    // Functions
    initAuth,
    login,
    register,
    logout,
    verifyEmail,
    verifyPhone,
    resendVerification,
    requestPasswordReset,
    resetPassword,
    
    // Computed properties
    isAuthenticated,
    user,
    requiresEmailVerification,
    userFullName,
    isLoading
  }
}
