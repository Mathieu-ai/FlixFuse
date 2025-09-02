<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth'
})

const { verifyEmail, user, isLoading, resendVerification: resendVerificationApi } = useAuth()
const route = useRoute()
const toast = useToast()

const verificationStatus = ref<'pending' | 'success' | 'error'>('pending')
const errorMessage = ref('')
const isVerifying = ref(false)

// Auto-verify if token is in URL
onMounted(async () => {
  const token = route.query.token as string
  
  if (token) {
    await handleVerification(token)
  }
})

const handleVerification = async (token: string) => {
  isVerifying.value = true
  
  try {
    await verifyEmail(token)
    verificationStatus.value = 'success'
    
    toast.add({
      title: 'Email Verified!',
      description: 'Your account is now active.',
      color: 'success'
    })

    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
  } catch (error: unknown) {
    verificationStatus.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Verification failed'
    
    toast.add({
      title: 'Verification Failed',
      description: errorMessage.value,
      color: 'error'
    })
  } finally {
    isVerifying.value = false
  }
}

const resendVerification = async () => {
  // Get email from user data or URL params
  const email = user.value?.email || route.query.email as string
  
  if (!email) {
    toast.add({
      title: 'Error',
      description: 'No email address found. Please try registering again.',
      color: 'error'
    })
    return
  }
  
  try {
    const result = await resendVerificationApi('email', email)
    toast.add({
      title: 'Verification Email Sent',
      description: result.message || 'Please check your email for a new verification link.',
      color: 'success'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unable to resend verification email. Please try again.'
    toast.add({
      title: 'Failed to Resend',
      description: errorMessage,
      color: 'error'
    })
    console.error('Resend verification error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <img src="/logo.png" alt="PawGo" class="mx-auto h-12 w-auto" />
        
        <UCard class="mt-8">
          <!-- Pending Verification -->
          <div v-if="verificationStatus === 'pending' && !isVerifying" class="text-center p-8">
            <UIcon name="i-heroicons-envelope" class="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <h2 class="text-3xl font-bold mb-4">
              Check Your Email
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              We've sent a verification link to
              <span class="font-medium">{{ user?.email || route.query.email || 'your email address' }}</span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Click the link in the email to verify your account
            </p>
          </div>

          <!-- Verifying -->
          <div v-else-if="isVerifying" class="text-center p-8">
            <UIcon name="i-heroicons-arrow-path" class="mx-auto h-16 w-16 text-blue-500 mb-4 animate-spin" />
            <h2 class="text-3xl font-bold mb-4">
              Verifying...
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Please wait while we verify your email address
            </p>
          </div>

          <!-- Success -->
          <div v-else-if="verificationStatus === 'success'" class="text-center p-8">
            <UIcon name="i-heroicons-check-circle" class="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 class="text-3xl font-bold mb-4">
              Email Verified!
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Your account is now active. Redirecting you to the app...
            </p>
          </div>

          <!-- Error -->
          <div v-else-if="verificationStatus === 'error'" class="text-center p-8">
            <UIcon name="i-heroicons-x-circle" class="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 class="text-3xl font-bold mb-4">
              Verification Failed
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ errorMessage || 'Unable to verify your email address' }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Actions -->
      <div class="space-y-4">
        <div v-if="verificationStatus === 'pending' || verificationStatus === 'error'">
          <UButton
            v-if="verificationStatus === 'error'"
            @click="resendVerification"
            block
            size="lg"
            variant="soft"
            :loading="isLoading"
          />
          <UButton
            v-if="verificationStatus === 'error'"
            @click="resendVerification"
            block
            size="lg"
            variant="soft"
            :loading="isLoading"
          >
            Resend Verification Email
          </UButton>

          <UButton
            v-else-if="verificationStatus === 'pending'"
            @click="resendVerification"
            block
            size="lg"
            variant="soft"
            :loading="isLoading"
          >
            Resend Email
          </UButton>
        </div>

        <div class="text-center space-y-2">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-primary hover:text-primary/80"
          >
            Back to Sign In
          </NuxtLink>
          
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Can't find the email? Check your spam folder
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
