import { defineStore } from 'pinia'

// Tokens are set in HTTP-only cookies by the server. We keep shape for possible future use but do not store in localStorage.
interface AuthTokens {
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, unknown>
  }
}

interface User {
  id: string
  email: string
  firstName: string
  lastName?: string
  displayName?: string
  profilePicture?: string
  phoneNumber?: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'BANNED'
  isOnline?: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  lastLoginAt?: Date
  level: number
  points: number
}

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface LoginData {
  identifier: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName?: string
  phoneNumber?: string
  acceptTerms: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    isLoading: false,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    requiresEmailVerification: (state) => state.user && !state.user.isEmailVerified,
    userFullName: (state) => {
      if (!state.user) return ''
      return state.user.displayName || 
             `${state.user.firstName} ${state.user.lastName || ''}`.trim()
    }
  },

  actions: {
    // Initialize auth by asking server for current user (cookies carry auth)
    async initAuth() {
      try {
        await this.fetchCurrentUser()
      } catch {
        this.clearAuth()
      }
    },

    // Register new user
    async register(data: RegisterData) {
      this.isLoading = true
      try {
  const response = await $fetch<ApiResponse<{ user: User; message?: string }>>('/api/auth/register', {
          method: 'POST',
          body: data
        })

        if (response.success && response.data) {
          this.user = response.data.user
          this.tokens = null
          this.isAuthenticated = true
          
          return { success: true, message: response.data.message || 'Registration successful' }
        } else {
          throw new Error(response.error?.message || 'Registration failed')
        }
      } catch (error: unknown) {
        console.error('Registration error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Login user
    async login(data: LoginData) {
      this.isLoading = true
      try {
  const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/login', {
          method: 'POST',
          body: data
        })

        if (response.success && response.data) {
          this.user = response.data.user
          this.tokens = null
          this.isAuthenticated = true
          
          return { success: true }
        } else {
          throw new Error(response.error?.message || 'Login failed')
        }
      } catch (error: unknown) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Logout user
    async logout() {
      try { await $fetch('/api/auth/logout', { method: 'POST' }) } catch {
        // ignore
      }
      this.clearAuth()
      await navigateTo('/auth/login')
    },

    // Verify email
    async verifyEmail(token: string) {
      try {
        const response = await $fetch<ApiResponse<{ message: string }>>('/api/auth/verify-email', {
          method: 'POST',
          body: { token }
        })

        if (response.success) {
          // Refresh user data to update verification status
          await this.fetchCurrentUser()
          return { success: true, message: response.data?.message }
        } else {
          throw new Error(response.error?.message || 'Email verification failed')
        }
      } catch (error: unknown) {
        console.error('Email verification error:', error)
        throw error
      }
    },

    // Verify phone
    async verifyPhone(code: string) {
      try {
        const response = await $fetch<ApiResponse<{ message: string }>>('/api/auth/verify-phone', {
          method: 'POST',
          body: { code }
        })

        if (response.success) {
          // Refresh user data to update verification status
          await this.fetchCurrentUser()
          return { success: true, message: response.data?.message }
        } else {
          throw new Error(response.error?.message || 'Phone verification failed')
        }
      } catch (error: unknown) {
        console.error('Phone verification error:', error)
        throw error
      }
    },

    // Resend verification
    async resendVerification(type: 'email' | 'phone', identifier: string) {
      try {
        const response = await $fetch<ApiResponse<{ message: string }>>('/api/auth/resend-verification', {
          method: 'POST',
          body: { type, identifier }
        })

        if (response.success) {
          return { success: true, message: response.data?.message }
        } else {
          throw new Error(response.error?.message || 'Failed to resend verification')
        }
      } catch (error: unknown) {
        console.error('Resend verification error:', error)
        throw error
      }
    },

    // Request password reset
    async requestPasswordReset(email: string) {
      try {
        const response = await $fetch<ApiResponse<{ message: string }>>('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })

        if (response.success) {
          return { success: true, message: response.data?.message }
        } else {
          throw new Error(response.error?.message || 'Password reset request failed')
        }
      } catch (error: unknown) {
        console.error('Password reset request error:', error)
        throw error
      }
    },

    // Reset password
    async resetPassword(token: string, newPassword: string) {
      try {
        const response = await $fetch<ApiResponse<{ message: string }>>('/api/auth/reset-password', {
          method: 'POST',
          body: { token, newPassword }
        })

        if (response.success) {
          return { success: true, message: response.data?.message }
        } else {
          throw new Error(response.error?.message || 'Password reset failed')
        }
      } catch (error: unknown) {
        console.error('Password reset error:', error)
        throw error
      }
    },

    // Fetch current user
    async fetchCurrentUser() {
      try {
        const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/me')

        if (response.success && response.data) {
          this.user = response.data.user
          this.isAuthenticated = true
        } else {
          this.clearAuth()
        }
      } catch (error) {
        console.error('Fetch user error:', error)
        this.clearAuth()
      }
    },

  // Server stores tokens in cookies; no local storage use

    // Clear authentication data
    clearAuth() {
      this.user = null
      this.tokens = null
      this.isAuthenticated = false
  // cookies cleared server-side on logout
    }
  }
})
