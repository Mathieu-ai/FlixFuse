<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import * as v from 'valibot'
import { useValidation } from '~/composables/useValidation'

definePageMeta({
  title: 'Profile Settings',
  middleware: 'auth'
})

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName?: string
  displayName?: string
  bio?: string
  profilePicture?: string
  phoneNumber?: string
  whatsappNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY'
  location?: {
    neighborhood?: string
    city?: string
    zipCode?: string
    coordinates?: { lat: number; lng: number }
    radius?: number
  }
  timeZone?: string
  language: string
  interests: string[]
  personalityTraits: string[]
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PROFESSIONAL'
  walkPreferences?: {
    preferredTimes?: string[]
    maxDistance?: number
    groupSizePreference?: string
    pacePreference?: string
    terrainPreference?: string[]
  }
  availability?: Record<string, Array<{ start: string; end: string }>>
  privacySettings?: {
    profileVisibility?: string
    locationSharing?: string
    contactInfo?: string
    activitySharing?: string
  }
  notificationSettings?: {
    email?: Record<string, boolean>
    push?: Record<string, boolean>
    sms?: Record<string, boolean>
  }
  communicationPreferences?: {
    preferredMethod?: string
    responseTime?: string
    languages?: string[]
  }
  theme: string
  units: string
  // Read-only fields
  points: number
  level: number
  totalWalks: number
  totalDistanceKm: number
  joinDate: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  role: string
  status: string
  lastActiveAt?: string
}

const { user, isAuthenticated } = useAuth()
const toast = useToast()

const isLoading = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  displayName: '',
  bio: '',
  phoneNumber: '',
  whatsappNumber: '',
  dateOfBirth: '',
  gender: '',
  location: {
    city: '',
    zipCode: '',
    coordinates: { lat: 0, lng: 0 }
  },
  timeZone: '',
  interests: [] as string[],
  personalityTraits: [] as string[],
  experienceLevel: '',
  walkPreferences: {
    preferredTimes: [] as string[],
    maxDistance: 5,
    groupSizePreference: '',
    pacePreference: '',
    terrainPreference: [] as string[]
  },
  theme: 'light',
  language: 'en',
  units: 'metric'
})

const { errors: vErrors, validate } = useValidation<{ firstName: string }>()
const errors = reactive({ firstName: '', general: '' })

const profileData = ref<UserProfile | null>(null)

// Load user profile data
const loadProfile = async () => {
  if (!isAuthenticated.value) return
  
  isLoading.value = true
  try {
    const { data } = await $fetch<{ success: boolean; data: UserProfile }>('/api/user/profile')
    
    profileData.value = data
    
    // Populate form with profile data
    if (data) {
      form.firstName = data.firstName || ''
      form.lastName = data.lastName || ''
      form.displayName = data.displayName || ''
      form.bio = data.bio || ''
      form.phoneNumber = data.phoneNumber || ''
      form.whatsappNumber = data.whatsappNumber || ''
      form.dateOfBirth = data.dateOfBirth ? data.dateOfBirth.split('T')[0] || '' : ''
      form.gender = data.gender || ''
      form.location = {
        city: data.location?.city || '',
        zipCode: data.location?.zipCode || '',
        coordinates: data.location?.coordinates || { lat: 0, lng: 0 }
      }
      form.timeZone = data.timeZone || ''
      form.interests = data.interests || []
      form.personalityTraits = data.personalityTraits || []
      form.experienceLevel = data.experienceLevel || ''
      form.walkPreferences = {
        preferredTimes: data.walkPreferences?.preferredTimes || [],
        maxDistance: data.walkPreferences?.maxDistance || 5,
        groupSizePreference: data.walkPreferences?.groupSizePreference || '',
        pacePreference: data.walkPreferences?.pacePreference || '',
        terrainPreference: data.walkPreferences?.terrainPreference || []
      }
      form.theme = data.theme || 'light'
      form.language = data.language || 'en'
      form.units = data.units || 'metric'
    }
  } catch (error: unknown) {
    console.error('Profile load error:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load profile data',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Load profile on mount
onMounted(() => {
  if (isAuthenticated.value) {
    loadProfile()
  }
})

// Watch for authentication changes
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    loadProfile()
  }
})

const formSchema = v.object({ firstName: v.pipe(v.string(), v.minLength(1, 'First name is required')) })
const validateForm = () => {
  errors.firstName = ''
  errors.general = ''
  const res = validate(formSchema, { firstName: form.firstName })
  if (!res.ok) {
    if (vErrors.value.firstName) errors.firstName = vErrors.value.firstName
    return false
  }
  return true
}

const saveProfile = async () => {
  if (!validateForm()) return
  
  isSaving.value = true
  
  try {
    // Prepare update data
    const updateData = {
      firstName: form.firstName,
      lastName: form.lastName || null,
      displayName: form.displayName || null,
      bio: form.bio || null,
      phoneNumber: form.phoneNumber || null,
      whatsappNumber: form.whatsappNumber || null,
      dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
      gender: form.gender || null,
      location: form.location.city || form.location.zipCode ? form.location : null,
      timeZone: form.timeZone || null,
      interests: form.interests,
      personalityTraits: form.personalityTraits,
      experienceLevel: form.experienceLevel || null,
      walkPreferences: form.walkPreferences.maxDistance > 0 ? form.walkPreferences : null,
      theme: form.theme,
      language: form.language,
      units: form.units
    }
    
    const response = await $fetch<{ success: boolean; data: { user: UserProfile; message: string } }>('/api/user/profile', {
      method: 'PUT',
      body: updateData
    })
    
    if (response.success) {
      profileData.value = response.data.user
      
      toast.add({
        title: 'Profile Updated',
        description: response.data.message,
        color: 'success'
      })
      
      isEditing.value = false
    }
  } catch (error: unknown) {
    console.error('Profile update error:', error)
    errors.general = error instanceof Error ? error.message : 'Failed to update profile'
    
    toast.add({
      title: 'Update Failed',
      description: errors.general,
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

// Options for form selects
const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Non-binary', value: 'NON_BINARY' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' }
]

const experienceLevelOptions = [
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
  { label: 'Expert', value: 'EXPERT' },
  { label: 'Professional', value: 'PROFESSIONAL' }
]

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Auto', value: 'auto' }
]

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Nederlands', value: 'nl' },
  { label: '中文', value: 'cn' },
  { label: '日本語', value: 'jp' }
]

const unitsOptions = [
  { label: 'Metric (km, kg)', value: 'metric' },
  { label: 'Imperial (mi, lbs)', value: 'imperial' }
]

const commonInterests = [
  'Walking', 'Running', 'Hiking', 'Training', 'Photography', 
  'Socializing', 'Dog Parks', 'Beach', 'Agility', 'Obedience',
  'Puppy Training', 'Therapy Dogs', 'Rescue Work', 'Camping'
]

const personalityOptions = [
  'Patient', 'Active', 'Social', 'Calm', 'Energetic', 
  'Responsible', 'Caring', 'Experienced', 'Gentle', 'Playful',
  'Reliable', 'Flexible', 'Understanding', 'Encouraging'
]

const timeSlots = [
  'Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-3 PM)', 
  'Late Afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (9 PM+)'
]

const paceOptions = [
  { label: 'Leisurely', value: 'leisurely' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Brisk', value: 'brisk' },
  { label: 'Varies', value: 'varies' }
]

const groupSizeOptions = [
  { label: 'Solo', value: 'solo' },
  { label: 'Small (2-3)', value: 'small' },
  { label: 'Medium (4-6)', value: 'medium' },
  { label: 'Large (7+)', value: 'large' },
  { label: 'Any size', value: 'any' }
]

const terrainOptions = [
  'Urban streets', 'Parks', 'Trails', 'Beach', 'Forest', 
  'Hills', 'Flat paths', 'Dog parks', 'Neighborhoods'
]

const toggleArrayItem = (array: string[], item: string) => {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  } else {
    array.push(item)
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
    </div>
    
    <UCard v-else class="max-w-4xl mx-auto">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold flex items-center gap-2">
              Profile Settings <UIcon name="i-heroicons-user" class="text-primary" />
            </h1>
            <p class="text-gray-600 dark:text-gray-300 mt-1">Manage your personal information and preferences</p>
          </div>
          <div class="flex gap-2">
            <UButton v-if="!isEditing" @click="isEditing = true" icon="i-heroicons-pencil" variant="soft" size="lg">
              Edit Profile
            </UButton>
            <template v-else>
              <UButton @click="isEditing = false" variant="ghost" :disabled="isSaving" size="lg">
                Cancel
              </UButton>
              <UButton @click="saveProfile" icon="i-heroicons-check" :loading="isSaving" size="lg">
                Save Changes
              </UButton>
            </template>
          </div>
        </div>
      </template>

      <UAlert 
        v-if="errors.general" 
        color="error" 
        variant="soft" 
        :description="errors.general" 
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }" 
        @close="errors.general = ''" 
        class="mb-6" 
      />

      <ClientOnly>
        <UForm :state="form" class="space-y-8">
        <!-- Personal Information -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-identification" class="text-primary" />
              Personal Information
            </h2>
          </template>
          <div class="space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UFormField label="First Name *" name="firstName" :error="errors.firstName">
                <UInput v-model="form.firstName" :disabled="!isEditing" size="lg" />
              </UFormField>
              <UFormField label="Last Name" name="lastName">
                <UInput v-model="form.lastName" :disabled="!isEditing" size="lg" />
              </UFormField>
            </div>
            
            <UFormField label="Display Name" name="displayName">
              <UInput v-model="form.displayName" :disabled="!isEditing" placeholder="How others will see your name" size="lg" />
            </UFormField>
            
            <UFormField label="Bio" name="bio">
              <UTextarea v-model="form.bio" :disabled="!isEditing" placeholder="Tell others about yourself and your pets..." :maxlength="500" :rows="3" />
            </UFormField>
            
            <!-- Contact Info -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UFormField label="Phone Number" name="phoneNumber">
                <UInput v-model="form.phoneNumber" :disabled="!isEditing" type="tel" size="lg" />
              </UFormField>
              <UFormField label="WhatsApp Number" name="whatsappNumber">
                <UInput v-model="form.whatsappNumber" :disabled="!isEditing" type="tel" size="lg" />
              </UFormField>
            </div>
            
            <!-- Personal Details -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UFormField label="Date of Birth" name="dateOfBirth">
                <UInput v-model="form.dateOfBirth" :disabled="!isEditing" type="date" size="lg" />
              </UFormField>
              <UFormField label="Gender" name="gender">
                <USelect v-model="form.gender" :items="genderOptions" :disabled="!isEditing" size="lg" placeholder="Select gender" />
              </UFormField>
            </div>
            
            <!-- Location -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UFormField label="City" name="city">
                <UInput v-model="form.location.city" :disabled="!isEditing" size="lg" />
              </UFormField>
              <UFormField label="Zip Code" name="zipCode">
                <UInput v-model="form.location.zipCode" :disabled="!isEditing" size="lg" />
              </UFormField>
            </div>
          </div>
        </UCard>

        <!-- Preferences & Settings -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-cog-6-tooth" class="text-primary" />
              Preferences & Settings
            </h2>
          </template>
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UFormField label="Experience Level" name="experienceLevel">
                <USelect v-model="form.experienceLevel" :items="experienceLevelOptions" :disabled="!isEditing" size="lg" placeholder="Select experience level" />
              </UFormField>
              <UFormField label="Time Zone" name="timeZone">
                <UInput v-model="form.timeZone" :disabled="!isEditing" placeholder="e.g., Europe/Paris" size="lg" />
              </UFormField>
            </div>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UFormField label="Theme" name="theme">
                <USelect v-model="form.theme" :items="themeOptions" :disabled="!isEditing" size="lg" />
              </UFormField>
              <UFormField label="Units" name="units">
                <USelect v-model="form.units" :items="unitsOptions" :disabled="!isEditing" size="lg" />
              </UFormField>
            </div>
            
            <UFormField label="Language" name="language">
              <USelect v-model="form.language" :items="languageOptions" :disabled="!isEditing" size="lg" />
            </UFormField>
          </div>
        </UCard>

        <!-- Interests -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-heart" class="text-primary" />
              Interests
            </h2>
          </template>
          <UFormField label="Select your interests" name="interests">
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="interest in commonInterests" 
                :key="interest" 
                :class="[
                  'cursor-pointer transition-colors', 
                  form.interests.includes(interest) 
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                ]" 
                @click="isEditing && toggleArrayItem(form.interests, interest)"
                :variant="form.interests.includes(interest) ? 'solid' : 'soft'"
              >
                {{ interest }}
              </UBadge>
            </div>
          </UFormField>
        </UCard>

        <!-- Personality Traits -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-face-smile" class="text-primary" />
              Personality Traits
            </h2>
          </template>
          <UFormField label="Describe yourself" name="personalityTraits">
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="trait in personalityOptions" 
                :key="trait" 
                :class="[
                  'cursor-pointer transition-colors', 
                  form.personalityTraits.includes(trait) 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                ]" 
                @click="isEditing && toggleArrayItem(form.personalityTraits, trait)"
                :variant="form.personalityTraits.includes(trait) ? 'solid' : 'soft'"
              >
                {{ trait }}
              </UBadge>
            </div>
          </UFormField>
        </UCard>

        <!-- Walk Preferences -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-map" class="text-primary" />
              Walk Preferences
            </h2>
          </template>
          <div class="space-y-6">
            <UFormField label="Preferred Times" name="preferredTimes">
              <div class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="time in timeSlots" 
                  :key="time" 
                  :class="[
                    'cursor-pointer transition-colors', 
                    form.walkPreferences.preferredTimes.includes(time) 
                      ? 'bg-purple-100 text-purple-800 border-purple-300' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  ]" 
                  @click="isEditing && toggleArrayItem(form.walkPreferences.preferredTimes, time)"
                  :variant="form.walkPreferences.preferredTimes.includes(time) ? 'solid' : 'soft'"
                >
                  {{ time }}
                </UBadge>
              </div>
            </UFormField>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <UFormField label="Max Distance (km)" name="maxDistance">
                <UInput v-model.number="form.walkPreferences.maxDistance" :disabled="!isEditing" type="number" min="1" max="50" size="lg" />
              </UFormField>
              <UFormField label="Group Size Preference" name="groupSizePreference">
                <USelect v-model="form.walkPreferences.groupSizePreference" :items="groupSizeOptions" :disabled="!isEditing" size="lg" placeholder="Any size" />
              </UFormField>
              <UFormField label="Walking Pace" name="pacePreference">
                <USelect v-model="form.walkPreferences.pacePreference" :items="paceOptions" :disabled="!isEditing" size="lg" placeholder="Any pace" />
              </UFormField>
            </div>
            
            <UFormField label="Preferred Terrain" name="terrainPreference">
              <div class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="terrain in terrainOptions" 
                  :key="terrain" 
                  :class="[
                    'cursor-pointer transition-colors', 
                    form.walkPreferences.terrainPreference.includes(terrain) 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  ]" 
                  @click="isEditing && toggleArrayItem(form.walkPreferences.terrainPreference, terrain)"
                  :variant="form.walkPreferences.terrainPreference.includes(terrain) ? 'solid' : 'soft'"
                >
                  {{ terrain }}
                </UBadge>
              </div>
            </UFormField>
          </div>
        </UCard>

        <!-- Account Stats (Read-only) -->
        <UCard v-if="profileData">
          <template #header>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="text-primary" />
              Account Statistics
            </h2>
          </template>
          <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ profileData.points }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Points</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ profileData.level }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Level</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ profileData.totalWalks }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Walks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ profileData.totalDistanceKm.toFixed(1) }}km</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Distance</div>
            </div>
          </div>
        </UCard>
        </UForm>
        <template #fallback>
          <div class="space-y-6">
            <USkeleton class="h-8 w-1/3" />
            <USkeleton class="h-24 w-full" />
            <USkeleton class="h-24 w-full" />
          </div>
        </template>
      </ClientOnly>
    </UCard>
  </UContainer>
</template>
