<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <!-- Member Header -->
    <template #header>
      <div class="flex items-center space-x-3">
        <UAvatar 
          :src="member.profilePicture" 
          :alt="memberName"
          size="lg"
        />
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold text-lg">{{ memberName }}</h4>
            <UTooltip v-if="member" :text="member.isOnline ? 'Online' : ('Last seen ' + formatLastSeen(member.lastActiveAt))">
              <span
                class="inline-block h-2 w-2 rounded-full"
                :class="member.isOnline ? 'bg-emerald-500' : 'bg-gray-400'"
                aria-hidden="true"
              />
            </UTooltip>
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <UBadge :label="formatExperience(member.experienceLevel)" size="sm" />
            <span v-if="member.distance" class="flex items-center">
              <UIcon name="i-heroicons-map-pin" class="w-3 h-3 mr-1" />
              {{ member.distance }}km away
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Member Info -->
    <div class="space-y-4">
      <!-- Bio -->
      <p v-if="member.bio" class="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
        {{ member.bio }}
      </p>

      <!-- Pets -->
      <div v-if="member.pets && member.pets.length > 0">
        <h5 class="font-medium mb-2">Pets ({{ member.petsCount }})</h5>
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <div 
            v-for="pet in member.pets.slice(0, 3)" 
            :key="pet.id"
            class="flex-shrink-0 text-center"
          >
            <UAvatar 
              :src="pet.profilePhoto" 
              :alt="pet.name"
              size="md"
              class="mb-1"
            />
            <p class="text-xs font-medium">{{ pet.name }}</p>
            <p class="text-xs text-gray-500">{{ formatSpecies(pet.species) }}</p>
          </div>
          <div 
            v-if="member.petsCount > 3"
            class="flex-shrink-0 text-center flex items-center justify-center"
          >
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-xs font-medium">+{{ member.petsCount - 3 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interests -->
      <div v-if="member.interests && member.interests.length > 0">
        <h5 class="font-medium mb-2">Interests</h5>
        <div class="flex flex-wrap gap-1">
          <UBadge 
            v-for="interest in member.interests.slice(0, 5)" 
            :key="interest"
            :label="interest"
            variant="soft"
            size="sm"
          />
          <UBadge 
            v-if="member.interests.length > 5"
            :label="`+${member.interests.length - 5} more`"
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 pt-4 border-t">
        <div class="text-center">
          <p class="text-lg font-semibold">{{ member.level || 1 }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-300">Level</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold">{{ member.totalWalks || 0 }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-300">Walks</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold">{{ member.points || 0 }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-300">Points</p>
        </div>
      </div>

      <!-- Compatibility Score -->
      <div v-if="member.compatibilityScore > 0" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-green-800 dark:text-green-200">
            Compatibility
          </span>
          <span class="text-sm font-bold text-green-800 dark:text-green-200">
            {{ Math.round(member.compatibilityScore) }}%
          </span>
        </div>
        <div class="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-1">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all"
            :style="{ width: `${member.compatibilityScore}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <template #footer>
      <div class="flex gap-2">
        <UButton @click="$emit('viewProfile', member.id)" color="neutral" variant="outline" size="sm" class="flex-1">
          <UIcon name="i-heroicons-user" class="mr-1" />
          View Profile
        </UButton>
        <UButton @click="$emit('message', member.id)" color="primary" variant="solid" size="sm" class="flex-1">
          <UIcon name="i-heroicons-chat-bubble-left" class="mr-1" />
          Message
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface MemberPet {
  id: string
  name: string
  species: string
  breed?: string
  profilePhoto?: string
}

interface Member {
  id: string
  firstName: string
  lastName?: string
  displayName?: string
  profilePicture?: string
  isOnline?: boolean
  lastActiveAt?: string
  bio?: string
  experienceLevel?: string
  location?: any
  interests?: string[]
  pets?: MemberPet[]
  petsCount: number
  distance?: number
  compatibilityScore: number
  level?: number
  totalWalks?: number
  points?: number
}

interface Props {
  member: Member
}


defineEmits<{
  viewProfile: [memberId: string]
  message: [memberId: string]
}>()

// Computed
const memberName = computed(() => {
  const { member } = props
  return member.displayName || `${member.firstName} ${member.lastName || ''}`.trim()
})

// Methods
function formatExperience(level?: string) {
  if (!level) return 'Beginner'
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
}

function formatSpecies(species: string) {
  const speciesMap: Record<string, string> = {
    'DOG': 'Dog',
    'CAT': 'Cat',
    'RABBIT': 'Rabbit',
    'BIRD': 'Bird',
    'HAMSTER': 'Hamster',
    'GUINEA_PIG': 'Guinea Pig',
    'FERRET': 'Ferret',
    'REPTILE': 'Reptile',
    'FISH': 'Fish',
    'HORSE': 'Horse',
    'OTHER': 'Other'
  }
  return speciesMap[species] || species
}

function formatLastSeen(date?: string) {
  if (!date) return 'unknown'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Props
const props = defineProps<Props>()
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
