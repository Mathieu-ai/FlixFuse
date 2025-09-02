<template>
  <UContainer class="py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Sidebar - Quick Actions -->
        <div class="lg:col-span-1">
          <UCard class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold">Quick Actions</h3>
            </template>
            <div class="space-y-3">
              <UModal v-model:open="showCreatePost">
                <UButton color="primary" block size="md">
                  <UIcon name="i-heroicons-plus" class="mr-2" />
                  Create Post
                </UButton>
                <template #content>
                  <UCard>
                    <template #header>
                      <h3 class="text-lg font-semibold">Create a Post</h3>
                    </template>
                    <UForm :schema="createPostSchema" :state="createPostState" @submit="onCreatePost">
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What's on your mind?</label>
                          <UTextarea v-model="createPostState.content" placeholder="Share something with the community..." :rows="4" size="sm" />
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Type</label>
                          <USelect 
                            v-model="createPostState.postType" 
                            :items="postTypeOptions"
                            value-attribute="value"
                            option-attribute="label"
                            size="sm"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                          <USelect 
                            v-model="createPostState.category" 
                            :items="categoryOptions"
                            value-attribute="value"
                            option-attribute="label"
                            placeholder="Select a category..."
                            size="sm"
                          />
                        </div>

                        <div v-if="petsStore.pets.length > 0">
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Pet</label>
                          <USelect 
                            v-model="createPostState.petId" 
                            :items="petOptions"
                            value-attribute="value"
                            option-attribute="label"
                            placeholder="Select a pet (optional)..."
                            size="sm"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                          <USelect 
                            v-model="createPostState.visibility" 
                            :items="visibilityOptions"
                            value-attribute="value"
                            option-attribute="label"
                            size="sm"
                          />
                        </div>

                        <div class="flex justify-end space-x-3">
                          <UButton @click="showCreatePost = false" variant="outline" color="neutral" size="sm">Cancel</UButton>
                          <UButton type="submit" :loading="isCreatingPost" color="primary" variant="solid" size="sm">
                            <UIcon name="i-heroicons-paper-airplane" class="mr-2" />
                            Post
                          </UButton>
                        </div>
                      </div>
                    </UForm>
                  </UCard>
                </template>
              </UModal>
              <UButton to="/messages" variant="outline" color="neutral" size="sm" block>
                <UIcon name="i-heroicons-chat-bubble-left-right" class="mr-2" />
                Messages
              </UButton>
              <UButton to="/members" variant="outline" color="neutral" size="sm" block>
                <UIcon name="i-heroicons-users" class="mr-2" />
                Find Members
              </UButton>
            </div>
          </UCard>

          <!-- User Stats -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Your Activity</h3>
            </template>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Posts</span>
                <UBadge color="primary" variant="soft" size="sm">{{ userPosts.length }}</UBadge>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Level</span>
                <UBadge color="success" variant="soft" size="sm">{{ authStore.user?.level || 1 }}</UBadge>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Points</span>
                <UBadge color="warning" variant="soft" size="sm">{{ authStore.user?.points || 0 }}</UBadge>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Main Feed -->
        <div class="lg:col-span-2">
          <!-- Create Post Modal moved to Quick Actions via UModal with #content slot -->

          <!-- Your Recent Posts -->
          <UCard v-if="userPosts.length > 0" class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold">Your Recent Posts</h3>
            </template>
            <div class="space-y-4">
              <PostCard 
                v-for="post in userPosts.slice(0, 3)" 
                :key="post.id" 
                :post="post"
                @like="handleLike"
                @comment="handleComment"
              />
              <UButton v-if="userPosts.length > 3" to="/profile/posts" variant="outline" color="neutral" size="sm" block>
                View All Your Posts
              </UButton>
            </div>
          </UCard>

          <!-- Community Feed -->
          <div class="space-y-6">
            <h2 class="text-2xl font-bold">Community Feed</h2>
            
            <div v-if="isLoading" class="space-y-6">
              <USkeleton class="h-48" v-for="i in 3" :key="i" />
            </div>
            
            <div v-else-if="posts.length === 0" class="text-center py-12">
              <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 class="text-xl font-semibold mb-2">No posts yet</h3>
              <p class="text-gray-600 dark:text-gray-300">Be the first to share something with the community!</p>
            </div>
            
            <div v-else class="space-y-6">
              <PostCard 
                v-for="post in posts" 
                :key="post.id" 
                :post="post"
                @like="handleLike"
                @comment="handleComment"
              />
              
              <div v-if="hasMore" class="text-center">
                <UButton @click="loadMore" :loading="isLoadingMore" variant="outline" color="neutral" size="sm">
                  Load More Posts
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
  </UContainer>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  title: 'Community Feed',
  middleware: 'auth'
})

// Stores
const authStore = useAuthStore()
const petsStore = usePetsStore()

// State
const showCreatePost = ref(false)
const isLoading = ref(true)
const isCreatingPost = ref(false)
const isLoadingMore = ref(false)
const posts = ref<any[]>([])
const userPosts = ref<any[]>([])
const currentPage = ref(1)
const hasMore = ref(true)

// Create post form
const createPostSchema = v.object({
  content: v.pipe(v.string(), v.minLength(1, 'Content is required'), v.maxLength(2000, 'Content too long')),
  postType: v.picklist(['TEXT', 'PHOTO', 'VIDEO', 'QUESTION', 'TIP_ADVICE'], 'Invalid post type'),
  category: v.optional(v.string()),
  petId: v.optional(v.string()),
  visibility: v.picklist(['PUBLIC', 'NEIGHBORHOOD', 'FRIENDS_ONLY'], 'Invalid visibility')
})

type CreatePostSchema = v.InferOutput<typeof createPostSchema>

const createPostState = reactive<{
  content: string
  postType: 'TEXT' | 'PHOTO' | 'VIDEO' | 'QUESTION' | 'TIP_ADVICE'
  category?: string
  petId?: string
  visibility: 'PUBLIC' | 'NEIGHBORHOOD' | 'FRIENDS_ONLY'
}>({
  content: '',
  postType: 'TEXT',
  category: undefined,
  petId: undefined,
  visibility: 'NEIGHBORHOOD'
})

// Options
const postTypeOptions = [
  { value: 'TEXT', label: 'Text Post' },
  { value: 'PHOTO', label: 'Photo' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'QUESTION', label: 'Question' },
  { value: 'TIP_ADVICE', label: 'Tip & Advice' }
]

const categoryOptions = [
  { value: 'HEALTH_MEDICAL', label: 'Health & Medical' },
  { value: 'TRAINING_BEHAVIOR', label: 'Training & Behavior' },
  { value: 'NUTRITION_DIET', label: 'Nutrition & Diet' },
  { value: 'GROOMING_CARE', label: 'Grooming & Care' },
  { value: 'EXERCISE_ACTIVITY', label: 'Exercise & Activity' },
  { value: 'SOCIAL_MEETUPS', label: 'Social Meetups' },
  { value: 'FUNNY_CUTE', label: 'Funny & Cute' },
  { value: 'EDUCATIONAL', label: 'Educational' }
]

const visibilityOptions = [
  { value: 'NEIGHBORHOOD', label: 'Neighborhood' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'FRIENDS_ONLY', label: 'Friends Only' }
]

const petOptions = computed(() => (
  petsStore.pets.map(pet => ({
    value: pet.id,
    label: pet.name
  }))
))

// Cookies carry auth, no Authorization header needed

// Methods
async function loadFeed() {
  try {
    isLoading.value = true
    const response = await $fetch('/api/posts', {
      query: { page: 1, limit: 20 }
    }) as any
    
    if (response.success && response.data) {
      posts.value = response.data.posts || []
      userPosts.value = response.data.userPosts || []
      hasMore.value = response.data.pagination?.hasMore || false
    }
  } catch (error) {
    console.error('Error loading feed:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load feed',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

async function loadMore() {
  try {
    isLoadingMore.value = true
    currentPage.value++
    
    const response = await $fetch('/api/posts', {
      query: { page: currentPage.value, limit: 20 }
    }) as any
    
    if (response.success && response.data) {
      posts.value.push(...(response.data.posts || []))
      hasMore.value = response.data.pagination?.hasMore || false
    }
  } catch (error) {
    console.error('Error loading more posts:', error)
    currentPage.value-- // Revert page increment
  } finally {
    isLoadingMore.value = false
  }
}

async function onCreatePost(event: FormSubmitEvent<CreatePostSchema>) {
  try {
    isCreatingPost.value = true
    
    const response = await $fetch('/api/posts', {
      method: 'POST',
      body: {
        ...event.data,
        petId: event.data.petId || undefined,
        category: event.data.category || undefined
      }
    }) as any
    
    if (response.success && response.data) {
      // Add new post to the beginning of user posts
      userPosts.value.unshift(response.data.post)
      
      // Reset form
      Object.assign(createPostState, {
        content: '',
        postType: 'TEXT',
        category: undefined,
        petId: undefined,
        visibility: 'NEIGHBORHOOD'
      })
      
      showCreatePost.value = false
      
      useToast().add({
        title: 'Success',
        description: 'Post created successfully!',
        color: 'success'
      })
    }
  } catch (error) {
    console.error('Error creating post:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to create post',
      color: 'error'
    })
  } finally {
    isCreatingPost.value = false
  }
}

async function handleLike(postId: string) {
  try {
    const post = posts.value.find(p => p.id === postId) || userPosts.value.find(p => p.id === postId)
    if (!post) return
    
    const method = post.isLiked ? 'DELETE' : 'POST'
    
  const response = await $fetch(`/api/posts/${postId}/like`, { method })
    
    if (response.success && response.data) {
      post.isLiked = response.data.isLiked
      post.likesCount = response.data.likesCount
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to update like',
      color: 'error'
    })
  }
}

function handleComment(postId: string) {
  // Navigate to post detail page for commenting
  navigateTo(`/posts/${postId}`)
}

// Lifecycle
onMounted(async () => {
  try {
    await petsStore.fetchPets()
  } catch (e) {
    console.warn('Unable to fetch pets (possibly not authenticated yet):', e)
  }
  await loadFeed()
})
</script>
