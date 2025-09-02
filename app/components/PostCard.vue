<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <!-- Post Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <UAvatar 
            :src="post.author.profilePicture" 
            :alt="authorName"
            size="md"
          />
          <div>
            <h4 class="font-semibold">{{ authorName }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ formatDate(post.createdAt) }}
              <span v-if="post.pet" class="ml-2">
                • about <span class="font-medium">{{ post.pet.name }}</span>
              </span>
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <UBadge v-if="post.category" :label="formatCategory(post.category)" size="sm" />
          <UBadge v-if="post.postType !== 'TEXT'" :label="post.postType" variant="outline" size="sm" />
          <UBadge v-if="post.isUrgent" label="Urgent" color="error" size="sm" />
        </div>
      </div>
    </template>

    <!-- Post Content -->
  <div class="space-y-4">
      <!-- Title (if exists) -->
      <h3 v-if="post.title" class="text-lg font-semibold">{{ post.title }}</h3>
      
      <!-- Content -->
      <p class="whitespace-pre-wrap">{{ post.content }}</p>
      
      <!-- Images -->
      <div v-if="post.images && post.images.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <img 
          v-for="(image, index) in post.images.slice(0, 4)" 
          :key="index"
          :src="image" 
          :alt="`Post image ${index + 1}`"
          class="rounded-lg object-cover w-full h-48 cursor-pointer"
          @click="openImageModal(image)"
        />
        <div 
          v-if="post.images.length > 4"
          class="relative rounded-lg bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center cursor-pointer"
          @click="openImagesModal()"
        >
          <span class="text-lg font-semibold">+{{ post.images.length - 4 }} more</span>
        </div>
      </div>
      
      <!-- Location -->
  <div v-if="post.location" class="flex items-center text-sm text-gray-600 dark:text-gray-300">
        <UIcon name="i-heroicons-map-pin" class="mr-1" />
        {{ formatLocation(post.location) }}
      </div>
      
      <!-- Hashtags -->
      <div v-if="post.hashtags && post.hashtags.length > 0" class="flex flex-wrap gap-1">
        <UBadge 
          v-for="tag in post.hashtags" 
          :key="tag"
          :label="`#${tag}`"
          variant="soft"
          size="sm"
        />
      </div>
    </div>

    <!-- Post Actions -->
    <template #footer>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <!-- Like Button -->
          <UButton
            :color="post.isLiked ? 'error' : 'neutral'"
            :variant="post.isLiked ? 'solid' : 'ghost'"
            size="sm"
            @click="$emit('like', post.id)"
          >
            <UIcon :name="post.isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="mr-1" />
            {{ post.likesCount || 0 }}
          </UButton>
          
          <!-- Comment Button -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="$emit('comment', post.id)"
          >
            <UIcon name="i-heroicons-chat-bubble-left" class="mr-1" />
            {{ post.commentsCount || 0 }}
          </UButton>
          
          <!-- Share Button -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="sharePost"
          >
            <UIcon name="i-heroicons-arrow-up-tray" class="mr-1" />
            {{ post.sharesCount || 0 }}
          </UButton>
        </div>
        
        <!-- Visibility Badge -->
        <UBadge 
          :label="formatVisibility(post.visibility)" 
          variant="outline" 
          size="xs"
        />
      </div>
    </template>

    <!-- Image Modal -->
    <UModal v-model="showImageModal">
      <div class="p-4">
        <img :src="selectedImage" :alt="'Full size image'" class="w-full h-auto rounded-lg" />
      </div>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
interface PostAuthor {
  id: string
  firstName: string
  lastName?: string
  displayName?: string
  profilePicture?: string
}

interface PostPet {
  id: string
  name: string
  species: string
  breed?: string
  profilePhoto?: string
}

interface Post {
  id: string
  content: string
  title?: string
  images?: string[]
  videos?: string[]
  postType: string
  category?: string
  hashtags?: string[]
  visibility: string
  location?: any
  isUrgent?: boolean
  createdAt: string
  updatedAt: string
  author: PostAuthor
  pet?: PostPet
  isLiked: boolean
  likesCount: number
  commentsCount: number
  sharesCount: number
  savesCount?: number
}

interface Props {
  post: Post
}

defineEmits<{
  like: [postId: string]
  comment: [postId: string]
}>()

// State
const showImageModal = ref(false)
const selectedImage = ref('')

// Computed
const authorName = computed(() => {
  const { author } = props.post
  return author.displayName || `${author.firstName} ${author.lastName || ''}`.trim()
})

// Methods
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

function formatCategory(category: string) {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function formatVisibility(visibility: string) {
  const visibilityMap: Record<string, string> = {
    'PUBLIC': 'Public',
    'NEIGHBORHOOD': 'Neighborhood',
    'FRIENDS_ONLY': 'Friends',
    'FOLLOWERS_ONLY': 'Followers',
    'PRIVATE': 'Private',
    'MEMBERS_ONLY': 'Members'
  }
  return visibilityMap[visibility] || visibility
}

function formatLocation(location: any) {
  if (typeof location === 'string') return location
  if (location && typeof location === 'object') {
    return location.name || location.address || 'Unknown location'
  }
  return 'Unknown location'
}

function openImageModal(imageUrl: string) {
  selectedImage.value = imageUrl
  showImageModal.value = true
}

function openImagesModal() {
  // In a real app, you'd open a gallery modal
  console.log('Open gallery with all images')
}

async function sharePost() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.post.title || 'Check out this post!',
        text: props.post.content.substring(0, 100) + (props.post.content.length > 100 ? '...' : ''),
        url: window.location.origin + `/posts/${props.post.id}`
      })
    } catch (error) {
      console.log('Share cancelled or failed')
    }
  } else {
    // Fallback - copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.origin + `/posts/${props.post.id}`)
      useToast().add({
        title: 'Link copied!',
        description: 'Post link copied to clipboard',
        color: 'success'
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }
}

// Props
const props = defineProps<Props>()
</script>
