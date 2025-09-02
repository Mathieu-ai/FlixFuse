<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  auth: false
})

const schema = v.pipe(
  v.object({
    firstName: v.pipe(v.string(), v.minLength(2, 'First name must be at least 2 characters')),
    lastName: v.pipe(v.string(), v.minLength(2, 'Last name must be at least 2 characters')),
    email: v.optional(v.union([
      v.literal(''),
      v.pipe(v.string(), v.email('Please enter a valid email'))
    ])),
    phoneNumber: v.optional(v.union([
      v.literal(''),
      v.pipe(v.string(), v.regex(/^\+?[\d\s\-()]{10,15}$/, 'Please enter a valid phone number'))
    ])),
    password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters')),
    confirmPassword: v.pipe(v.string(), v.minLength(6, 'Please confirm your password')),
    acceptTerms: v.pipe(v.boolean(), v.literal(true, 'You must accept the terms and conditions'))
  }),
  v.forward(
    v.check((data) => {
      // At least one of email or phone number must be provided and not empty
      const hasEmail = !!(data.email && data.email.trim() !== '')
      const hasPhone = !!(data.phoneNumber && data.phoneNumber.trim() !== '')
      return hasEmail || hasPhone
    }, 'Please provide either an email address or phone number'),
    ['email']
  )
)

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Validate password confirmation
  if (event.data.password !== event.data.confirmPassword) {
    toast.add({
      title: 'Validation Error',
      description: 'Passwords do not match',
      color: 'error'
    })
    return
  }

  isLoading.value = true
  
  try {
    const result = await authStore.register({
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email || '',
      phoneNumber: event.data.phoneNumber,
      password: event.data.password,
      acceptTerms: event.data.acceptTerms
    })
    
    toast.add({ 
      title: 'Account created!', 
      description: result.message || 'Welcome to PawGo! Please verify your account.', 
      color: 'success' 
    })
    
    // Redirect based on verification method
    if (event.data.phoneNumber) {
      // Phone number provided, redirect to phone verification
      await navigateTo(`/auth/verify-phone?phone=${encodeURIComponent(event.data.phoneNumber)}`)
    } else {
      // Only email provided, redirect to email verification
      await navigateTo(`/auth/verify-email?email=${encodeURIComponent(event.data.email || '')}`)
    }
  } catch (error: any) {
    toast.add({ 
      title: 'Registration failed', 
      description: error.message || 'Please try again.', 
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
          Create your account
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-primary hover:text-primary/80">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>

      <!-- Register Form -->
      <UCard>
        <div class="p-6">
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="First Name" name="firstName">
                <UInput v-model="state.firstName" type="text" placeholder="First name" />
              </UFormField>

              <UFormField label="Last Name" name="lastName">
                <UInput v-model="state.lastName" type="text" placeholder="Last name" />
              </UFormField>
            </div>

            <UFormField label="Email (Optional)" name="email">
              <UInput v-model="state.email" type="email" placeholder="Enter your email" />
              <template #hint>
                <span class="text-xs text-gray-500">Required if no phone number provided</span>
              </template>
            </UFormField>

            <UFormField label="Phone Number (Optional)" name="phoneNumber">
              <UInput v-model="state.phoneNumber" type="tel" placeholder="Enter your phone number" />
              <template #hint>
                <span class="text-xs text-gray-500">Required if no email provided. SMS verification preferred if both provided.</span>
              </template>
            </UFormField>

            <UFormField label="Password" name="password">
              <UInput v-model="state.password" type="password" placeholder="Create a password" />
            </UFormField>

            <UFormField label="Confirm Password" name="confirmPassword">
              <UInput v-model="state.confirmPassword" type="password" placeholder="Confirm your password" />
            </UFormField>

            <UFormField name="acceptTerms">
              <div class="flex items-center">
                <UCheckbox v-model="state.acceptTerms" />
                <label class="ml-2 block text-sm text-gray-600 dark:text-gray-300">
                  I accept the 
                  <NuxtLink to="/terms" class="text-primary hover:text-primary/80">terms and conditions</NuxtLink>
                  and 
                  <NuxtLink to="/privacy" class="text-primary hover:text-primary/80">privacy policy</NuxtLink>
                </label>
              </div>
            </UFormField>

            <UButton 
              type="submit" 
              color="primary" 
              size="lg" 
              class="w-full" 
              :loading="isLoading"
            >
              Create Account
            </UButton>
          </UForm>
        </div>
      </UCard>
    </div>
  </div>
</template>
