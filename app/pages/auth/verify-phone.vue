<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

const schema = v.object({
  code: v.pipe(
    v.string(),
    v.length(6, 'Verification code must be 6 digits'),
    v.regex(/^\d{6}$/, 'Verification code must contain only numbers')
  )
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  code: ''
})

const { user, isLoading, verifyPhone, resendVerification: resendVerificationApi } = useAuth()
const toast = useToast()
const route = useRoute()

const verificationStatus = ref<'pending' | 'success' | 'error'>('pending')
const errorMessage = ref('')
const isVerifying = ref(false)

const handleVerification = async (event: FormSubmitEvent<Schema>) => {
  isVerifying.value = true
  
  try {
    const result = await verifyPhone(event.data.code)
    verificationStatus.value = 'success'
    
    toast.add({
      title: 'Phone Verified!',
      description: result.message || 'Your account is now active.',
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
  // Get phone from user data or URL params
  const phoneNumber = user.value?.phoneNumber || route.query.phone as string
  
  if (!phoneNumber) {
    toast.add({
      title: 'Error',
      description: 'No phone number found. Please try registering again.',
      color: 'error'
    })
    return
  }
  
  try {
    const result = await resendVerificationApi('phone', phoneNumber)
    
    toast.add({
      title: 'Verification Code Sent',
      description: result.message || 'Please check your phone for a new verification code.',
      color: 'success'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unable to resend verification code. Please try again.'
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
      <!-- Header -->
      <div class="text-center">
        <img src="/logo.png" alt="PawGo" class="mx-auto h-12 w-auto" />
        
        <UCard class="mt-8">
          <!-- Pending Verification -->
          <div v-if="verificationStatus === 'pending' && !isVerifying" class="text-center p-8">
            <UIcon name="i-heroicons-device-phone-mobile" class="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <h2 class="text-3xl font-bold mb-4">
              Verify Your Phone
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              We've sent a 6-digit verification code to
              <span class="font-medium">{{ user?.phoneNumber || route.query.phone || 'your phone number' }}</span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Enter the code below to verify your account
            </p>

            <!-- Verification Form -->
            <UForm :schema="schema" :state="state" @submit="handleVerification">
              <div class="space-y-4">
                <UFormField label="Verification Code" name="code">
                  <UInput 
                    v-model="state.code" 
                    type="text" 
                    placeholder="000000"
                    maxlength="6"
                    class="text-center text-lg tracking-widest"
                    :disabled="isVerifying"
                  />
                </UFormField>

                <UButton 
                  type="submit" 
                  color="primary" 
                  size="lg" 
                  class="w-full" 
                  :loading="isVerifying"
                >
                  Verify Phone Number
                </UButton>
              </div>
            </UForm>
          </div>

          <!-- Verifying -->
          <div v-else-if="isVerifying" class="text-center p-8">
            <UIcon name="i-heroicons-arrow-path" class="mx-auto h-16 w-16 text-blue-500 mb-4 animate-spin" />
            <h2 class="text-3xl font-bold mb-4">
              Verifying...
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Please wait while we verify your phone number
            </p>
          </div>

          <!-- Success -->
          <div v-else-if="verificationStatus === 'success'" class="text-center p-8">
            <UIcon name="i-heroicons-check-circle" class="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 class="text-3xl font-bold mb-4">
              Phone Verified!
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
              {{ errorMessage || 'Unable to verify your phone number' }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Actions -->
      <div class="space-y-4">
        <div v-if="verificationStatus === 'pending' || verificationStatus === 'error'">
          <UButton
            @click="resendVerification"
            block
            size="lg"
            variant="soft"
            :loading="isLoading"
          >
            Resend Verification Code
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
            Didn't receive the code? Check your messages and try again
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
