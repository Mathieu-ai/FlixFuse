export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, user } = useAuth()

  // Only check verification status for authenticated users
  if (!isAuthenticated.value || !user.value) {
    return
  }

  // Skip verification check for verification pages
  const verificationPages = ['/auth/verify-email', '/auth/verify-phone', '/auth/login', '/auth/register']
  if (verificationPages.includes(to.path)) {
    return
  }

  // Check if user needs verification
  if (user.value.status === 'PENDING_VERIFICATION') {
    // Redirect to phone verification if phone number exists and is not verified
    if (user.value.phoneNumber && !user.value.isPhoneVerified) {
      return navigateTo('/auth/verify-phone')
    }
    // Otherwise redirect to email verification
    else if (!user.value.isEmailVerified) {
      return navigateTo('/auth/verify-email')
    }
  }
})
