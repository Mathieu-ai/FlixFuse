<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  auth: false
})

// Valibot schema for login form validation
const schema = v.object({
  identifier: v.pipe(
    v.string('Email or phone number is required'), 
    v.minLength(1, 'Please enter your email or phone number')
  ),
  password: v.pipe(
    v.string('Password is required'), 
    v.minLength(6, 'Password must be at least 6 characters')
  ),
  rememberMe: v.optional(v.boolean())
})

type Schema = v.InferOutput<typeof schema>

// Form state
const state = reactive({
  identifier: '',
  password: '',
  rememberMe: false
})

// Composables and stores
const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(false)

// Form submission handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  
  try {
    // Call the auth store login method
    await authStore.login({
      identifier: event.data.identifier,
      password: event.data.password
    })
    
    // Show success message
    toast.add({ 
      title: 'Welcome back!', 
      description: 'You have successfully signed in.', 
      color: 'success' 
    })
    
    // Redirect to dashboard or home page
    await navigateTo('/')
  } catch (error: any) {
    // Show error message
    toast.add({ 
      title: 'Sign in failed', 
      description: error.message || 'Please check your credentials and try again.', 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (authStore.isLoggedIn) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <img class="mx-auto h-12 w-auto" src="/logo.png" alt="PawGo" />
        <h2 class="mt-6 text-3xl font-extrabold">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Or
          <NuxtLink to="/auth/register" class="font-medium text-primary hover:text-primary/80">
            create a new account
          </NuxtLink>
        </p>
      </div>

      <!-- Login Form -->
      <UCard>
        <div class="p-6">
          <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <!-- Email or Phone Field -->
            <UFormField label="Email or Phone Number" name="identifier" required>
              <UInput 
                v-model="state.identifier" 
                type="text" 
                placeholder="Enter your email or phone number"
                icon="i-heroicons-envelope"
                size="lg"
                :disabled="isLoading"
              />
            </UFormField>

            <!-- Password Field -->
            <UFormField label="Password" name="password" required>
              <UInput 
                v-model="state.password" 
                type="password" 
                placeholder="Enter your password"
                icon="i-heroicons-lock-closed"
                size="lg"
                :disabled="isLoading"
              />
            </UFormField>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <UCheckbox 
                v-model="state.rememberMe" 
                label="Remember me" 
                :disabled="isLoading"
              />

              <NuxtLink 
                to="/auth/forgot-password" 
                class="text-sm font-medium text-primary hover:text-primary/80"
              >
                Forgot your password?
              </NuxtLink>
            </div>

            <!-- Submit Button -->
            <UButton 
              type="submit" 
              color="primary" 
              size="lg" 
              class="w-full" 
              :loading="isLoading"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Sign in</span>
              <span v-else>Signing in...</span>
            </UButton>
          </UForm>

          <!-- Additional Links -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?
              <NuxtLink to="/auth/register" class="font-medium text-primary hover:text-primary/80">
                Sign up now
              </NuxtLink>
            </p>
          </div>
        </div>
      </UCard>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our 
          <NuxtLink to="/terms" class="text-primary hover:text-primary/80">Terms of Service</NuxtLink>
          and 
          <NuxtLink to="/privacy" class="text-primary hover:text-primary/80">Privacy Policy</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the login form */
.form-container {
  backdrop-filter: blur(10px);
}
</style>
