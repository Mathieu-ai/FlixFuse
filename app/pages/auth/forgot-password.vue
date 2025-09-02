<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: false
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <img class="mx-auto h-12 w-auto" src="/logo.png" alt="PawGo" />
        <h2 class="mt-6 text-3xl font-extrabold">
          Forgot your password?
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Reset Form -->
      <UCard>
        <div class="p-6">
          <form class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium mb-2">
                Email address
              </label>
              <UInput 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                size="lg"
              />
            </div>

            <UButton 
              type="submit" 
              color="primary" 
              size="lg" 
              class="w-full"
            >
              Send reset link
            </UButton>
          </form>

          <div class="text-center mt-4">
            <NuxtLink to="/auth/login" class="text-sm text-primary hover:text-primary/80">
              Back to sign in
            </NuxtLink>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
