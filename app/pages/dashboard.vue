<template>
  <UContainer class="py-8">
    <!-- Welcome Header -->
    <UCard class="max-w-4xl mx-auto text-center mb-8">
      <div class="p-8">
        <h1 class="text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
          Welcome back, {{ authStore.user?.firstName || 'there' }}!
          <UIcon name="i-heroicons-face-smile" class="text-primary" />
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Manage your pets and keep track of their health and activities.</p>
      </div>
    </UCard>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-heart" class="text-4xl text-pink-500 mb-2 mx-auto" />
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Pets</p>
          <p class="text-3xl font-bold">{{ petsStore.pets.length }}</p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-shield-check" class="text-4xl text-green-500 mb-2 mx-auto" />
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Vaccinated</p>
          <p class="text-3xl font-bold">{{ vaccinatedCount }}</p>
        </div>
      </UCard>
      <UCard class="text-center">
        <div class="p-6">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-yellow-500 mb-2 mx-auto" />
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Need Attention</p>
          <p class="text-3xl font-bold">{{ unvaccinatedCount }}</p>
        </div>
      </UCard>
    </div>

    <!-- Recent Pets -->
    <UCard class="mb-8">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Your Pets</h2>
          <UButton to="/pets" color="primary" size="sm">View All</UButton>
        </div>
      </template>

      <div class="p-6">
        <div v-if="petsStore.pets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="pet in recentPets" :key="pet.id" class="hover:shadow-md transition-shadow">
            <div class="p-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <img v-if="pet.profilePhoto" :src="pet.profilePhoto" :alt="pet.name"
                    class="h-12 w-12 rounded-full object-cover">
                  <div v-else class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-camera" class="text-gray-400" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ pet.name }}</p>
                  <p class="text-sm text-gray-500">{{ pet.species }} • {{ getAgeDisplay(pet) }}</p>
                </div>
                <div class="flex-shrink-0">
                  <UBadge :color="pet.isVaccinated ? 'success' : 'warning'" variant="subtle" size="xs">
                    {{ pet.isVaccinated ? 'Vaccinated' : 'Unvaccinated' }}
                  </UBadge>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <UIcon name="i-heroicons-heart" class="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">No pets yet</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Add your first furry friend to get started!</p>
          <UButton to="/pets" color="primary">Add Your First Pet</UButton>
        </div>
      </div>
    </UCard>

    <!-- Quick Actions & Tips -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold">Quick Actions</h3>
        </template>
        <div class="p-6">
          <div class="flex flex-col gap-4">
            <UButton to="/pets" color="primary" variant="soft" icon="i-heroicons-plus" block size="lg">
              Add New Pet
            </UButton>
            <UButton to="/profile" color="primary" variant="soft" icon="i-heroicons-user" block size="lg">
              Update Profile
            </UButton>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold">Tips & Reminders</h3>
        </template>
        <div class="p-6">
          <div class="flex flex-col gap-4">
            <UAlert
              icon="i-heroicons-light-bulb"
              title="Keep records updated"
              description="Regular vet visits help maintain your pet's health"
              color="info"
              variant="subtle"
            />
            <UAlert
              icon="i-heroicons-heart"
              title="Show them love"
              description="Spend quality time with your furry friends daily"
              color="success"
              variant="subtle"
            />
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePetsStore } from '~/stores/pets'

definePageMeta({
  title: 'Dashboard'
})

const authStore = useAuthStore()
const petsStore = usePetsStore()

// Computed properties
const vaccinatedCount = computed(() =>
  petsStore.pets.filter(pet => pet.isVaccinated).length
)

const unvaccinatedCount = computed(() =>
  petsStore.pets.filter(pet => !pet.isVaccinated).length
)

const recentPets = computed(() =>
  petsStore.pets.slice(0, 6)
)

// Methods
const getAgeDisplay = (pet: any) => {
  if (pet.age && pet.ageUnit) {
    return `${pet.age} ${pet.ageUnit.toLowerCase()}`
  }
  return 'Unknown age'
}

// Load data on mount
onMounted(async () => {
  if (authStore.isLoggedIn) {
    await petsStore.fetchPets()
  }
})
</script>
