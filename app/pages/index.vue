<template>
  <UContainer class="py-16">
    <!-- Hero Section -->
    <UCard class="max-w-3xl mx-auto text-center mb-12">
      <div class="p-8">
        <img src="/logo.png" alt="PawGo" class="h-20 w-20 mx-auto mb-6 rounded-full" />
        <h1 class="text-5xl font-extrabold mb-4 tracking-tight">
          Welcome to <span class="text-primary">PawGo</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          The complete platform for managing your pet's health, activities, and memories.<br>
          Keep track of everything your furry friends need to live their best life.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/auth/register" size="lg" color="primary" icon="i-heroicons-plus">
            Get Started Free
          </UButton>
          <UButton to="/auth/login" size="lg" variant="outline" icon="i-heroicons-arrow-right-on-rectangle">
            Sign In
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-heart" class="text-4xl text-pink-500 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-3">Pet Profiles</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Create detailed profiles for each of your pets with photos, medical history, and personality traits.
          </p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-shield-check" class="text-4xl text-green-500 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-3">Health Tracking</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Keep track of vaccinations, vet visits, medications, and health records all in one place.
          </p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-camera" class="text-4xl text-yellow-500 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-3">Memories & Gallery</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Save and share your favorite pet moments, photos, and adventures.
          </p>
        </div>
      </UCard>
    </div>

    <!-- Additional Features -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-calendar-days" class="text-4xl text-blue-500 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-3">Appointment Scheduling</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Never miss a vet appointment or vaccination with our smart reminder system.
          </p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-user-group" class="text-4xl text-purple-500 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-3">Community</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Connect with other pet owners, share experiences, and get advice from the community.
          </p>
        </div>
      </UCard>
    </div>

    <!-- CTA Section -->
    <UCard class="max-w-2xl mx-auto text-center">
      <div class="p-8">
        <h2 class="text-3xl font-bold mb-4">
          Ready to give your pets the care they deserve?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Join thousands of pet owners who trust PawGo to keep their furry friends healthy and happy.
        </p>
        <UButton to="/auth/register" size="lg" color="primary">
          Start Your Journey Today
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Redirect authenticated users to dashboard
onMounted(() => {
  if (authStore.isLoggedIn) {
    navigateTo('/dashboard')
  }
})
</script>