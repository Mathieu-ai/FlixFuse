<template>
  <aside class="lg:col-span-1">
    <UCard class="border border-gray-200/60 dark:border-gray-800/60 shadow-sm rounded-2xl overflow-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Messages</h2>

          <!-- New conversation buttons -->
          <div class="flex items-center gap-2">
            <NewConversationModal v-model="openNewConversationHeader" @start="$emit('start-conversation', $event)">
              <UButton size="sm" class="rounded-full">
                <UIcon name="i-heroicons-user-plus" class="mr-1" /> Direct
              </UButton>
            </NewConversationModal>
            <NewConversationModal v-model="openNewConversationEmpty" group @create-group="$emit('create-group', $event)">
              <UButton size="sm" variant="outline" class="rounded-full">
                <UIcon name="i-heroicons-users" class="mr-1" /> Group
              </UButton>
            </NewConversationModal>
          </div>
        </div>
      </template>

      <!-- Sidebar search -->
      <div class="p-3">
        <UInput v-model="search" placeholder="Search conversations" icon="i-heroicons-magnifying-glass" class="w-full rounded-full" />
      </div>

      <!-- Loading skeletons -->
      <div v-if="isLoadingConversations" class="space-y-3 p-3">
        <USkeleton class="h-16 rounded-xl" v-for="i in 5" :key="i" />
      </div>

      <!-- Empty state -->
      <div v-else-if="conversations.length === 0" class="text-center py-10 px-6">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="text-4xl text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-300">No conversations yet</p>

        <div class="flex items-center justify-center gap-2 mt-3">
          <NewConversationModal v-model="openNewConversationEmpty" @start="$emit('start-conversation', $event)">
            <UButton class="rounded-full">Start direct chat</UButton>
          </NewConversationModal>
          <NewConversationModal v-model="openNewConversationHeader" group @create-group="$emit('create-group', $event)">
            <UButton variant="outline" class="rounded-full">Create group</UButton>
          </NewConversationModal>
        </div>
      </div>

      <!-- Conversation list -->
      <div v-else class="px-3 pb-3">
        <div class="h-[72vh] overflow-y-auto space-y-2 pr-1">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="p-3 rounded-xl cursor-pointer transition shadow-sm border"
            :class="selectedConversation?.id === conversation.id
              ? 'bg-primary-50/70 dark:bg-primary-950/40 border-primary-200/60 dark:border-primary-900/40 ring-1 ring-primary-300/50 dark:ring-primary-800/50'
              : 'bg-white/70 dark:bg-gray-900/70 hover:bg-gray-50/70 dark:hover:bg-gray-800/70 border-gray-200/60 dark:border-gray-800/60'"
            @click="$emit('select-conversation', conversation)"
          >
            <div class="flex items-center gap-3">
              <div v-if="!conversation.isGroup && otherParticipant(conversation)" class="relative">
                <UAvatar :src="otherParticipant(conversation)?.user.profilePicture || undefined" :alt="otherParticipant(conversation)?.user.firstName || ''" size="md" />
                <span
                  class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900"
                  :class="otherParticipant(conversation)?.user.isOnline ? 'bg-emerald-500' : 'bg-amber-400'"
                  :title="otherParticipant(conversation)?.user.isOnline ? 'Online' : ('Last seen ' + formatTime(otherParticipant(conversation)?.user.lastActiveAt))"
                />
              </div>
              <UIcon v-else name="i-heroicons-users" class="text-2xl text-gray-400" />

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h4 class="font-medium truncate">{{ conversationName(conversation) }}</h4>
                  <span v-if="conversation.lastMessage" class="text-xs text-gray-500">{{ formatTime(conversation.lastMessage.createdAt) }}</span>
                </div>
                <p v-if="conversation.lastMessage" class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ messagePreview(conversation.lastMessage) }}</p>
                <p v-else class="text-sm text-gray-400 italic">No messages yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </aside>
</template>

<script setup lang="ts">
import NewConversationModal from '~/components/messages/NewConversationModal.vue'

interface Props {
  conversations: any[]
  selectedConversation: any | null
  isLoadingConversations: boolean
  search: string
  otherParticipant: (conversation: any) => any
  conversationName: (conversation: any) => string
  formatTime: (time: any) => string
  messagePreview: (message: any) => string
}

interface Emits {
  (e: 'start-conversation', member: any): void
  (e: 'create-group', payload: { name: string; userIds: string[] }): void
  (e: 'select-conversation', conversation: any): void
  (e: 'update:search', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for modals
const openNewConversationHeader = ref(false)
const openNewConversationEmpty = ref(false)

// Search model with sync to parent
const search = computed({
  get: () => props.search || '',
  set: (value: string) => emit('update:search', value)
})

// Computed for filtered conversations
const filteredConversations = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.conversations
  return props.conversations.filter((c: any) => {
    const name = props.conversationName(c).toLowerCase()
    const last = c?.lastMessage?.content?.toLowerCase?.() || ''
    return name.includes(q) || last.includes(q)
  })
})
</script>