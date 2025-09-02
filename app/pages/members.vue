<template>
  <UContainer class="py-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Discover Members</h1>
        <p class="text-gray-600 dark:text-gray-300">Connect with pet owners in your neighborhood</p>
      </div>

      <!-- Filters -->
      <UCard class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold">Filters</h3>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <UForm label="Pet Species">
            <USelect 
              v-model="filters.species" 
              :items="speciesOptions"
              placeholder="Any species"
              @change="applyFilters"
            />
          </UForm>

          <UForm label="Experience Level">
            <USelect 
              v-model="filters.experienceLevel" 
              :items="experienceOptions"
              placeholder="Any level"
              @change="applyFilters"
            />
          </UForm>

          <UForm label="Max Distance">
            <USelect 
              v-model="filters.maxDistance" 
              :items="distanceOptions"
              placeholder="Any distance"
              @change="applyFilters"
            />
          </UForm>

          <UForm label="Interests">
            <UInput 
              v-model="filters.interests" 
              placeholder="e.g. training, hiking"
              @input="debouncedApplyFilters"
            />
          </UForm>
        </div>
      </UCard>

      <!-- Members Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <USkeleton class="h-64" v-for="i in 6" :key="i" />
      </div>

      <div v-else-if="members.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-users" class="text-6xl text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold mb-2">No members found</h3>
        <p class="text-gray-600 dark:text-gray-300">Try adjusting your filters or check back later</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MemberCard 
            v-for="member in members" 
            :key="member.id" 
            :member="member"
            @message="startConversation"
            @viewProfile="viewProfile"
          />
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="text-center mt-8">
          <UButton @click="loadMore" :loading="isLoadingMore" variant="outline">
            Load More Members
          </UButton>
        </div>
      </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Discover Members',
  middleware: 'auth'
})

// State
const members = ref<any[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)

const filters = reactive({
  species: '',
  experienceLevel: '',
  maxDistance: '',
  interests: ''
})

// Options
const speciesOptions = [
  { value: '', label: 'Any Species' },
  { value: 'DOG', label: 'Dogs' },
  { value: 'CAT', label: 'Cats' },
  { value: 'RABBIT', label: 'Rabbits' },
  { value: 'BIRD', label: 'Birds' },
  { value: 'OTHER', label: 'Other Pets' }
]

const experienceOptions = [
  { value: '', label: 'Any Level' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
  { value: 'PROFESSIONAL', label: 'Professional' }
]

const distanceOptions = [
  { value: '', label: 'Any Distance' },
  { value: '1', label: '1 km' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
  { value: '25', label: '25 km' },
  { value: '50', label: '50 km' }
]

// Methods
async function loadMembers(resetList = true) {
  try {
    if (resetList) {
      isLoading.value = true
      currentPage.value = 1
    } else {
      isLoadingMore.value = true
      currentPage.value++
    }

    const query: any = {
      page: currentPage.value,
      limit: 12
    }

    // Add filters to query
    if (filters.species) query.species = filters.species
    if (filters.experienceLevel) query.experienceLevel = filters.experienceLevel
    if (filters.maxDistance) query.maxDistance = filters.maxDistance
    if (filters.interests) query.interests = filters.interests

    const response = await $fetch('/api/members', { query }) as any
    
    if (response.success && response.data) {
      if (resetList) {
        members.value = response.data.members || []
      } else {
        members.value.push(...(response.data.members || []))
      }
      hasMore.value = response.data.pagination?.hasMore || false
    }
  } catch (error) {
    console.error('Error loading members:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load members',
      color: 'error'
    })
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

function applyFilters() {
  loadMembers(true)
}

const debouncedApplyFilters = debounce(() => {
  applyFilters()
}, 500)

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

function loadMore() {
  loadMembers(false)
}

async function startConversation(memberId: string) {
  try {
    const response = await $fetch('/api/conversations', {
      method: 'POST',
      body: {
        participantIds: [memberId],
        isGroup: false
      }
    }) as any
    
    if (response.success) {
      useToast().add({
        title: 'Success',
        description: 'Conversation started!',
        color: 'success'
      })
      // Navigate to messages page
      navigateTo('/messages')
    }
  } catch (error: any) {
    console.error('Error starting conversation:', error)
    if (error?.message?.includes('already exists')) {
      useToast().add({
        title: 'Info',
        description: 'Conversation already exists',
        color: 'info'
      })
      navigateTo('/messages')
    } else {
      useToast().add({
        title: 'Error',
        description: 'Failed to start conversation',
        color: 'error'
      })
    }
  }
}

function viewProfile(memberId: string) {
  navigateTo(`/members/${memberId}`)
}

// Lifecycle
onMounted(() => {
  loadMembers()
  try {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${location.host}/_ws`
    const sock = new WebSocket(wsUrl)
    sock.onopen = () => {
      // subscribe to presence topic
      sock.send(JSON.stringify({ type: 'subscribe', topic: 'presence' }))
    }
    sock.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data?.type === 'presence.update' && data.userId) {
          const idx = members.value.findIndex(m => m.id === data.userId)
          if (idx !== -1) {
            const m = { ...members.value[idx] } as any
            m.isOnline = !!data.isOnline
            m.lastActiveAt = data.lastActiveAt
            members.value.splice(idx, 1, m)
          }
        }
      } catch {}
    }
    // no need to keep a ref if temporary; relies on page lifetime
  } catch {}
})
</script>
