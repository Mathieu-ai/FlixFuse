<script setup lang="ts">
import { usePets } from '~/composables/usePets'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
const open = ref(false)

definePageMeta({
  title: 'My Pets',
  middleware: 'auth'
})

// Type to match what the API returns
interface Pet {
  id: string
  name: string
  nickname?: string
  species: 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'HAMSTER' | 'GUINEA_PIG' | 'FERRET' | 'REPTILE' | 'FISH' | 'HORSE' | 'OTHER'
  breed?: string
  mixedBreed?: boolean
  secondaryBreed?: string
  age?: number
  ageUnit?: 'WEEKS' | 'MONTHS' | 'YEARS'
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  isNeutered?: boolean
  weight?: number
  weightUnit?: string
  height?: number
  color?: string
  markings?: string
  microchipId?: string
  photos?: string[]
  videos?: string[]
  profilePhoto?: string
  personalityTraits?: string[]
  behaviorTraits?: string[]
  energyLevel?: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  socialLevel?: 'SHY' | 'CAUTIOUS' | 'FRIENDLY' | 'VERY_SOCIAL' | 'OVERLY_SOCIAL'
  trainingLevel?: 'UNTRAINED' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
  allergies?: string[]
  medicalConditions?: string[]
  medications?: string[]
  specialNeeds?: string
  dietaryRestrictions?: string[]
  isVaccinated?: boolean
  lastVetVisit?: string
  nextVetVisit?: string
  compatibility?: {
    dogs?: string
    cats?: string
    children?: string
    strangers?: string
  }
  playStyle?: string[]
  favoriteActivities?: string[]
  fearsTriggers?: string[]
  feedingSchedule?: {
    times?: string[]
    amount?: string
    food_type?: string
  }
  exerciseNeeds?: {
    daily_minutes?: number
    intensity?: string
    preferred_activities?: string[]
  }
  careInstructions?: string
  isActive?: boolean
  isPublic?: boolean
  isLost?: boolean
  lostDetails?: {
    date?: string
    location?: string
    description?: string
  }
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  registrationNumber?: string
  pedigree?: boolean
  insuranceInfo?: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
}

const { pets, fetchPets, createPet, updatePet, deletePet, isLoading } = usePets()
const toast = useToast()

const petCreateOpen = ref(false)
const petEditOpen = ref(false)
const selectedPet = ref<Pet | null>(null)

// Pet form data
const petForm = reactive({
  name: '',
  nickname: '',
  species: 'DOG' as Pet['species'],
  breed: '',
  mixedBreed: false,
  secondaryBreed: '',
  age: 0,
  ageUnit: 'YEARS' as Pet['ageUnit'],
  gender: 'UNKNOWN' as Pet['gender'],
  isNeutered: false,
  weight: 0,
  weightUnit: 'kg',
  height: 0,
  color: '',
  markings: '',
  microchipId: '',
  personalityTraits: [] as string[],
  behaviorTraits: [] as string[],
  energyLevel: 'MODERATE' as Pet['energyLevel'],
  socialLevel: 'FRIENDLY' as Pet['socialLevel'],
  trainingLevel: 'BASIC' as Pet['trainingLevel'],
  allergies: [] as string[],
  medicalConditions: [] as string[],
  medications: [] as string[],
  specialNeeds: '',
  dietaryRestrictions: [] as string[],
  isVaccinated: false,
  lastVetVisit: '',
  nextVetVisit: '',
  compatibility: {
    dogs: 'good',
    cats: 'unknown',
    children: 'good',
    strangers: 'cautious'
  },
  playStyle: [] as string[],
  favoriteActivities: [] as string[],
  fearsTriggers: [] as string[],
  feedingSchedule: {
    times: [] as string[],
    amount: '',
    food_type: ''
  },
  exerciseNeeds: {
    daily_minutes: 60,
    intensity: 'moderate',
    preferred_activities: [] as string[]
  },
  careInstructions: '',
  isPublic: true,
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  registrationNumber: '',
  pedigree: false
})

const errors = reactive({
  name: '',
  species: '',
  general: ''
})

// Nuxt UI UForm validation
const validatePetForm = (state: typeof petForm): FormError[] => {
  const errs: FormError[] = []
  if (!state.name || !state.name.trim()) errs.push({ name: 'name', message: 'Required' })
  if (!state.species) errs.push({ name: 'species', message: 'Required' })
  return errs
}

// UForm submit handlers
const onAddSubmit = async (_event: FormSubmitEvent<typeof petForm>) => {
  await createNewPet()
}
const onEditSubmit = async (_event: FormSubmitEvent<typeof petForm>) => {
  await updateExistingPet()
}

// Fetch pets on client during setup to keep SSR/CSR markup in sync
const { error: petsFetchError, refresh: refreshPets } = await useAsyncData(
  'pets',
  async () => {
    await fetchPets()
    return true
  },
  { server: false }
)

// Show toast on client if initial fetch failed
if (import.meta.client) {
  watch(
    () => petsFetchError.value,
    (err) => {
      if (err) {
        console.error('Failed to fetch pets:', err)
        toast.add({
          title: 'Error Loading Pets',
          description: 'Failed to load your pets. Please try refreshing the page.',
          color: 'error'
        })
      }
    },
    { immediate: true }
  )
}

// Reset form
const resetForm = () => {
  Object.assign(petForm, {
    name: '',
    nickname: '',
    species: 'DOG',
    breed: '',
    mixedBreed: false,
    secondaryBreed: '',
    age: 0,
    ageUnit: 'YEARS',
    gender: 'UNKNOWN',
    isNeutered: false,
    weight: 0,
    weightUnit: 'kg',
    height: 0,
    color: '',
    markings: '',
    microchipId: '',
    personalityTraits: [],
    behaviorTraits: [],
    energyLevel: 'MODERATE',
    socialLevel: 'FRIENDLY',
    trainingLevel: 'BASIC',
    allergies: [],
    medicalConditions: [],
    medications: [],
    specialNeeds: '',
    dietaryRestrictions: [],
    isVaccinated: false,
    lastVetVisit: '',
    nextVetVisit: '',
    compatibility: {
      dogs: 'good',
      cats: 'unknown',
      children: 'good',
      strangers: 'cautious'
    },
    playStyle: [],
    favoriteActivities: [],
    fearsTriggers: [],
    feedingSchedule: {
      times: [],
      amount: '',
      food_type: ''
    },
    exerciseNeeds: {
      daily_minutes: 60,
      intensity: 'moderate',
      preferred_activities: []
    },
    careInstructions: '',
    isPublic: true,
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    registrationNumber: '',
    pedigree: false
  })
  
  errors.name = ''
  errors.species = ''
  errors.general = ''
}

// Load pet data into form
const loadPetIntoForm = (pet: Pet) => {
  petForm.name = pet.name
  petForm.nickname = pet.nickname || ''
  petForm.species = pet.species
  petForm.breed = pet.breed || ''
  petForm.mixedBreed = pet.mixedBreed || false
  petForm.secondaryBreed = pet.secondaryBreed || ''
  petForm.age = pet.age || 0
  petForm.ageUnit = pet.ageUnit || 'YEARS'
  petForm.gender = pet.gender || 'UNKNOWN'
  petForm.isNeutered = pet.isNeutered || false
  petForm.weight = pet.weight || 0
  petForm.weightUnit = pet.weightUnit || 'kg'
  petForm.height = pet.height || 0
  petForm.color = pet.color || ''
  petForm.markings = pet.markings || ''
  petForm.microchipId = pet.microchipId || ''
  petForm.personalityTraits = [...(pet.personalityTraits || [])]
  petForm.behaviorTraits = [...(pet.behaviorTraits || [])]
  petForm.energyLevel = pet.energyLevel || 'MODERATE'
  petForm.socialLevel = pet.socialLevel || 'FRIENDLY'
  petForm.trainingLevel = pet.trainingLevel || 'BASIC'
  petForm.allergies = [...(pet.allergies || [])]
  petForm.medicalConditions = [...(pet.medicalConditions || [])]
  petForm.medications = [...(pet.medications || [])]
  petForm.specialNeeds = pet.specialNeeds || ''
  petForm.dietaryRestrictions = [...(pet.dietaryRestrictions || [])]
  petForm.isVaccinated = pet.isVaccinated || false
  petForm.lastVetVisit = (pet.lastVetVisit ? pet.lastVetVisit.split('T')[0] : '') || ''
  petForm.nextVetVisit = (pet.nextVetVisit ? pet.nextVetVisit.split('T')[0] : '') || ''
  petForm.compatibility = {
    dogs: pet.compatibility?.dogs || 'unknown',
    cats: pet.compatibility?.cats || 'unknown',
    children: pet.compatibility?.children || 'good',
    strangers: pet.compatibility?.strangers || 'cautious'
  }
  petForm.playStyle = [...(pet.playStyle || [])]
  petForm.favoriteActivities = [...(pet.favoriteActivities || [])]
  petForm.fearsTriggers = [...(pet.fearsTriggers || [])]
  petForm.feedingSchedule = {
    times: [...(pet.feedingSchedule?.times || [])],
    amount: pet.feedingSchedule?.amount || '',
    food_type: pet.feedingSchedule?.food_type || ''
  }
  petForm.exerciseNeeds = {
    daily_minutes: pet.exerciseNeeds?.daily_minutes || 60,
    intensity: pet.exerciseNeeds?.intensity || 'moderate',
    preferred_activities: [...(pet.exerciseNeeds?.preferred_activities || [])]
  }
  petForm.careInstructions = pet.careInstructions || ''
  petForm.isPublic = pet.isPublic !== false // default to true unless explicitly false
  petForm.emergencyContact = {
    name: pet.emergencyContact?.name || '',
    phone: pet.emergencyContact?.phone || '',
    relationship: pet.emergencyContact?.relationship || ''
  }
  petForm.registrationNumber = pet.registrationNumber || ''
  petForm.pedigree = pet.pedigree || false
}

// Validate form
const validateForm = () => {
  errors.name = ''
  errors.species = ''
  errors.general = ''

  if (!petForm.name.trim()) {
    errors.name = 'Pet name is required'
    return false
  }

  if (!petForm.species) {
    errors.species = 'Species is required'
    return false
  }

  return true
}

// Create new pet
const createNewPet = async () => {
  if (!validateForm()) return

  try {
    // Prepare data for API
    const petData = {
      ...petForm,
      age: petForm.age > 0 ? petForm.age : undefined,
      weight: petForm.weight > 0 ? petForm.weight : undefined,
      height: petForm.height > 0 ? petForm.height : undefined,
      lastVetVisit: petForm.lastVetVisit ? new Date(petForm.lastVetVisit).toISOString() : undefined,
      nextVetVisit: petForm.nextVetVisit ? new Date(petForm.nextVetVisit).toISOString() : undefined,
      nickname: petForm.nickname || undefined,
      breed: petForm.breed || undefined,
      secondaryBreed: petForm.secondaryBreed || undefined,
      color: petForm.color || undefined,
      markings: petForm.markings || undefined,
      microchipId: petForm.microchipId || undefined,
      specialNeeds: petForm.specialNeeds || undefined,
      careInstructions: petForm.careInstructions || undefined,
      registrationNumber: petForm.registrationNumber || undefined,
      emergencyContact: petForm.emergencyContact.name ? petForm.emergencyContact : undefined
    }

  await createPet(petData)
    
    toast.add({
      title: 'Pet Added',
      description: `${petForm.name} has been added to your pets!`,
      color: 'success'
    })
    
    petCreateOpen.value = false
    resetForm()
  // Store already prepends the created pet; no refetch needed
  } catch (error) {
    console.error('Error creating pet:', error)
    errors.general = 'Failed to create pet. Please try again.'
    
    toast.add({
      title: 'Error',
      description: 'Failed to create pet',
      color: 'error'
    })
  }
}

// Edit pet
const editPet = (pet: Pet) => {
  selectedPet.value = pet
  loadPetIntoForm(pet)
  petEditOpen.value = true
}

// Update pet
const updateExistingPet = async () => {
  if (!validateForm() || !selectedPet.value) return

  try {
    // Prepare data for API
    const petData = {
      ...petForm,
      age: petForm.age > 0 ? petForm.age : undefined,
      weight: petForm.weight > 0 ? petForm.weight : undefined,
      height: petForm.height > 0 ? petForm.height : undefined,
      lastVetVisit: petForm.lastVetVisit ? new Date(petForm.lastVetVisit).toISOString() : undefined,
      nextVetVisit: petForm.nextVetVisit ? new Date(petForm.nextVetVisit).toISOString() : undefined,
      nickname: petForm.nickname || undefined,
      breed: petForm.breed || undefined,
      secondaryBreed: petForm.secondaryBreed || undefined,
      color: petForm.color || undefined,
      markings: petForm.markings || undefined,
      microchipId: petForm.microchipId || undefined,
      specialNeeds: petForm.specialNeeds || undefined,
      careInstructions: petForm.careInstructions || undefined,
      registrationNumber: petForm.registrationNumber || undefined,
      emergencyContact: petForm.emergencyContact.name ? petForm.emergencyContact : undefined
    }

  await updatePet(selectedPet.value.id, petData)
    
    toast.add({
      title: 'Pet Updated',
      description: `${petForm.name}'s information has been updated!`,
      color: 'success'
    })
    
    petEditOpen.value = false
    selectedPet.value = null
    resetForm()
  // Store already updates the pet in-place; no refetch needed
  } catch (error) {
    console.error('Error updating pet:', error)
    errors.general = 'Failed to update pet. Please try again.'
    
    toast.add({
      title: 'Error',
      description: 'Failed to update pet',
      color: 'error'
    })
  }
}

// Delete pet with confirmation
const deletePetWithConfirmation = async (pet: Pet) => {
  if (!confirm(`Are you sure you want to delete ${pet.name}? This action cannot be undone.`)) {
    return
  }

  try {
  await deletePet(pet.id)
    
    toast.add({
      title: 'Pet Deleted',
      description: `${pet.name} has been removed from your pets.`,
      color: 'success'
    })
    
  // Store already removes the pet; no refetch needed
  } catch (error) {
    console.error('Error deleting pet:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to delete pet',
      color: 'error'
    })
  }
}

// Helper function to toggle array items
const toggleArrayItem = (array: string[], item: string) => {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  } else {
    array.push(item)
  }
}

// Form options
const speciesOptions = [
  { label: 'Dog', value: 'DOG' },
  { label: 'Cat', value: 'CAT' },
  { label: 'Rabbit', value: 'RABBIT' },
  { label: 'Bird', value: 'BIRD' },
  { label: 'Hamster', value: 'HAMSTER' },
  { label: 'Guinea Pig', value: 'GUINEA_PIG' },
  { label: 'Ferret', value: 'FERRET' },
  { label: 'Reptile', value: 'REPTILE' },
  { label: 'Fish', value: 'FISH' },
  { label: 'Horse', value: 'HORSE' },
  { label: 'Other', value: 'OTHER' }
]

const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Unknown', value: 'UNKNOWN' }
]

const ageUnitOptions = [
  { label: 'Weeks', value: 'WEEKS' },
  { label: 'Months', value: 'MONTHS' },
  { label: 'Years', value: 'YEARS' }
]

const energyLevelOptions = [
  { label: 'Very Low', value: 'VERY_LOW' },
  { label: 'Low', value: 'LOW' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'High', value: 'HIGH' },
  { label: 'Very High', value: 'VERY_HIGH' }
]

const socialLevelOptions = [
  { label: 'Shy', value: 'SHY' },
  { label: 'Cautious', value: 'CAUTIOUS' },
  { label: 'Friendly', value: 'FRIENDLY' },
  { label: 'Very Social', value: 'VERY_SOCIAL' },
  { label: 'Overly Social', value: 'OVERLY_SOCIAL' }
]

const trainingLevelOptions = [
  { label: 'Untrained', value: 'UNTRAINED' },
  { label: 'Basic', value: 'BASIC' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
  { label: 'Professional', value: 'PROFESSIONAL' }
]

const compatibilityOptions = [
  { label: 'Great', value: 'great' },
  { label: 'Good', value: 'good' },
  { label: 'Okay', value: 'okay' },
  { label: 'Cautious', value: 'cautious' },
  { label: 'Not good', value: 'not_good' },
  { label: 'Unknown', value: 'unknown' }
]

const commonPersonalityTraits = [
  'Friendly', 'Energetic', 'Calm', 'Playful', 'Protective', 'Loyal', 'Independent', 'Affectionate', 'Alert', 'Gentle'
]

const commonBehaviorTraits = [
  'Good with kids', 'Good with dogs', 'Good with cats', 'Leash trained', 'House trained', 'Crate trained', 'Obedient', 'Socialized'
]

const commonAllergies = [
  'Grass', 'Pollen', 'Dust', 'Food allergies', 'Flea bites', 'Chicken', 'Beef', 'Grain', 'Dairy'
]

const commonPlayStyles = [
  'Gentle', 'Rough', 'Chase', 'Fetch', 'Tug-of-war', 'Wrestling', 'Solo play', 'Group play'
]

const commonActivities = [
  'Walking', 'Running', 'Swimming', 'Fetch', 'Agility', 'Training', 'Socializing', 'Hiking', 'Playing', 'Sleeping'
]

const commonFears = [
  'Thunderstorms', 'Fireworks', 'Crowds', 'Other animals', 'Car rides', 'Loud noises', 'Strangers', 'Vet visits'
]

const feedingTimes = [
  'Early morning', 'Morning', 'Midday', 'Afternoon', 'Evening', 'Night'
]

// Helper functions
const getVaccinationColor = (isVaccinated?: boolean) => {
  return isVaccinated ? 'success' : 'warning'
}

const getAgeDisplay = (pet: Pet) => {
  if (!pet.age) return 'Unknown age'
  const unit = pet.ageUnit === 'WEEKS' ? 'week' : pet.ageUnit === 'MONTHS' ? 'month' : 'year'
  return `${pet.age} ${unit}${pet.age > 1 ? 's' : ''} old`
}

// Modal state computed
const editingPet = computed(() => petEditOpen.value)

// Modal close function
const closeModal = () => {
  petCreateOpen.value = false
  petEditOpen.value = false
  selectedPet.value = null
  resetForm()
}

// Submit handler
const submitPet = () => {
  if (editingPet.value) {
    updateExistingPet()
  } else {
    createNewPet()
  }
}

// Loading states
const isSubmitting = ref(false)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
              My Pets
            </h1>
            <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Manage your beloved companions
            </p>
          </div>
          <UButton @click="petCreateOpen = true" color="primary" icon="i-heroicons-plus" size="lg">
            Add New Pet
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ClientOnly>
        <!-- Loading State -->
        <template v-if="isLoading">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </template>

        <!-- Pet Grid -->
        <template v-else-if="pets.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <UCard v-for="pet in pets" :key="pet.id" class="group overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Pet Photo -->
            <div class="relative overflow-hidden">
              <div class="aspect-w-16 aspect-h-12">
                <img v-if="pet.profilePhoto" :src="pet.profilePhoto" :alt="pet.name" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div v-else class="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <UIcon name="i-heroicons-camera" class="text-6xl text-gray-400" />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <UButton @click="editPet(pet)" color="neutral" variant="soft" icon="i-heroicons-pencil-square" size="sm" />
                <UButton @click="deletePetWithConfirmation(pet)" color="error" variant="soft" icon="i-heroicons-trash" size="sm" />
              </div>

              <!-- Vaccination Badge -->
              <div class="absolute bottom-4 left-4">
                <UBadge :color="getVaccinationColor(pet.isVaccinated)" variant="solid" size="md">
                  <UIcon :name="pet.isVaccinated ? 'i-heroicons-shield-check' : 'i-heroicons-shield-exclamation'" class="mr-1" />
                  {{ pet.isVaccinated ? 'Vaccinated' : 'Needs Vaccination' }}
                </UBadge>
              </div>
            </div>

            <!-- Pet Info -->
            <div class="p-6">
              <div class="mb-4">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ pet.name }}
                </h3>
                <p class="text-lg text-gray-600 dark:text-gray-300 capitalize">
                  {{ pet.species?.toLowerCase() || 'Unknown' }}
                </p>
              </div>

              <div class="space-y-3">
                <!-- Age -->
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <UIcon name="i-heroicons-cake" class="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ getAgeDisplay(pet) }}
                  </span>
                </div>

                <!-- Weight & Breed -->
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                    <UIcon name="i-heroicons-scale" class="text-green-600 dark:text-green-400" />
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ pet.weight ? `${pet.weight}kg` : 'Weight not set' }}
                  </span>
                  <span v-if="pet.breed" class="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    • {{ pet.breed }}
                  </span>
                </div>

                <!-- Special Needs -->
                <div v-if="pet.specialNeeds" class="flex items-start">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                    <UIcon name="i-heroicons-heart" class="text-purple-600 dark:text-purple-400" />
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-1">
                    {{ pet.specialNeeds }}
                  </p>
                </div>
              </div>
            </div>
            </UCard>
          </div>
        </template>

        <!-- Empty State -->
        <template v-else>
          <div class="text-center py-16">
            <div class="max-w-md mx-auto">
              <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-heroicons-heart" class="text-4xl text-gray-400" />
              </div>
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No pets yet
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-8">
                Add your first pet to get started with managing their profiles.
              </p>
              <UButton @click="petCreateOpen = true" color="primary" icon="i-heroicons-plus" size="lg">
                Add Your First Pet
              </UButton>
            </div>
          </div>
        </template>

        <template #fallback>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>

  <!-- Add Pet Modal -->
  <UModal v-model:open="petCreateOpen">
    <template #content>
      <UCard class="overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Pet
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                Create a profile for your beloved companion
              </p>
            </div>
            <UButton @click="closeModal" color="neutral" variant="ghost" icon="i-heroicons-x-mark" size="sm" />
          </div>
        </template>

  <UForm :validate="validatePetForm" :state="petForm" class="space-y-8" @submit="onAddSubmit">
          <div class="space-y-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Pet Name" name="name" required>
                <UInput v-model="petForm.name" placeholder="Enter your pet's name" size="lg" />
              </UFormField>

              <UFormField label="Nickname" name="nickname">
                <UInput v-model="petForm.nickname" placeholder="Enter nickname (optional)" size="lg" />
              </UFormField>

              <UFormField label="Species" name="species" required>
                <USelect v-model="petForm.species" :items="speciesOptions" placeholder="Select species" size="lg" />
              </UFormField>

              <UFormField label="Gender" name="gender">
                <USelect v-model="petForm.gender" :items="genderOptions" placeholder="Select gender" size="lg" />
              </UFormField>

              <UFormField label="Age" name="age">
                <div class="flex space-x-2">
                  <UInput v-model.number="petForm.age" type="number" placeholder="Age" size="lg" class="flex-1" />
                  <USelect v-model="petForm.ageUnit" :items="ageUnitOptions" size="lg" class="w-32" />
                </div>
              </UFormField>

              <UFormField label="Weight (kg)" name="weight">
                <UInput v-model.number="petForm.weight" type="number" placeholder="Weight in kg" size="lg" />
              </UFormField>

              <UFormField label="Breed" name="breed">
                <UInput v-model="petForm.breed" placeholder="Enter breed" size="lg" />
              </UFormField>

              <div class="space-y-4 col-span-1 md:col-span-2">
                <UCheckbox v-model="petForm.mixedBreed" label="Mixed breed" size="lg" />
                <UCheckbox v-model="petForm.isNeutered" label="Neutered/Spayed" size="lg" />
                <UCheckbox v-model="petForm.isVaccinated" label="Up to date with vaccinations" size="lg" />
                <UCheckbox v-model="petForm.isPublic" label="Public profile" size="lg" />
              </div>
            </div>
          </div>

          <div v-if="errors.general" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-700 dark:text-red-400">{{ errors.general }}</p>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <UButton type="button" @click="closeModal" color="neutral" variant="ghost" size="lg">
              Cancel
            </UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting" size="lg" icon="i-heroicons-plus" :disabled="!petForm.name || !petForm.species">
              Add Pet
            </UButton>
          </div>
  </UForm>
      </UCard>
    </template>
  </UModal>

  <!-- Edit Pet Modal -->
  <UModal v-model:open="petEditOpen">
    <template #content>
      <UCard class="overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Pet Profile
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                Update your pet's information
              </p>
            </div>
            <UButton @click="closeModal" color="neutral" variant="ghost" icon="i-heroicons-x-mark" size="sm" />
          </div>
        </template>

        <UForm :validate="validatePetForm" :state="petForm" class="space-y-8" @submit="onEditSubmit">
          <div class="space-y-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Pet Name" name="name" required>
                <UInput v-model="petForm.name" placeholder="Enter your pet's name" size="lg" />
              </UFormField>

              <UFormField label="Nickname" name="nickname">
                <UInput v-model="petForm.nickname" placeholder="Enter nickname (optional)" size="lg" />
              </UFormField>

              <UFormField label="Species" name="species" required>
                <USelect v-model="petForm.species" :items="speciesOptions" placeholder="Select species" size="lg" />
              </UFormField>

              <UFormField label="Gender" name="gender">
                <USelect v-model="petForm.gender" :items="genderOptions" placeholder="Select gender" size="lg" />
              </UFormField>

              <UFormField label="Age" name="age">
                <div class="flex space-x-2">
                  <UInput v-model.number="petForm.age" type="number" placeholder="Age" size="lg" class="flex-1" />
                  <USelect v-model="petForm.ageUnit" :items="ageUnitOptions" size="lg" class="w-32" />
                </div>
              </UFormField>

              <UFormField label="Weight (kg)" name="weight">
                <UInput v-model.number="petForm.weight" type="number" placeholder="Weight in kg" size="lg" />
              </UFormField>

              <UFormField label="Breed" name="breed">
                <UInput v-model="petForm.breed" placeholder="Enter breed" size="lg" />
              </UFormField>

              <div class="space-y-4 col-span-1 md:col-span-2">
                <UCheckbox v-model="petForm.mixedBreed" label="Mixed breed" size="lg" />
                <UCheckbox v-model="petForm.isNeutered" label="Neutered/Spayed" size="lg" />
                <UCheckbox v-model="petForm.isVaccinated" label="Up to date with vaccinations" size="lg" />
                <UCheckbox v-model="petForm.isPublic" label="Public profile" size="lg" />
              </div>
            </div>
          </div>

          <div v-if="errors.general" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-700 dark:text-red-400">{{ errors.general }}</p>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <UButton type="button" @click="closeModal" color="neutral" variant="ghost" size="lg">
              Cancel
            </UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting" size="lg" icon="i-heroicons-check" :disabled="!petForm.name || !petForm.species">
              Update Pet
            </UButton>
          </div>
        </UForm>
      </UCard>
    </template>
  </UModal>
</template>


