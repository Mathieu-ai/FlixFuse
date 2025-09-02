<template>
  <div
    class="h-full overflow-y-auto pr-1"
    ref="messagesContainer"
    @scroll.passive="onScroll"
  >
    <div v-if="typingUsers.size" class="text-xs text-gray-500 mb-2">
      <span v-for="uid in Array.from(typingUsers)" :key="uid" class="mr-2">Someone is typing...</span>
    </div>

    <div v-if="isLoadingMessages" class="space-y-3">
      <USkeleton class="h-12 rounded-xl" v-for="i in 5" :key="i" />
    </div>

    <div v-else-if="messages.length === 0" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-300">No messages yet. Start the conversation!</p>
    </div>

    <div v-else>
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :current-user-id="currentUserId"
        :highlight-id="highlightId"
        :editing-message-id="editingMessageId"
        :editing-content="editingContent"
        :reaction-picker-for-id="reactionPickerForId"
        :quick-reactions="quickReactions"
        :reaction-counts="reactionCounts"
        :my-reaction-emoji="myReactionEmoji"
        :is-image="isImage"
        :is-video="isVideo"
        :is-audio="isAudio"
        :format-time="formatTime"
        @jump-to-message="$emit('jump-to-message', $event)"
        @cancel-edit="$emit('cancel-edit')"
        @save-edit="$emit('save-edit', $event)"
        @toggle-reaction="(message, emoji) => $emit('toggle-reaction', message, emoji)"
        @toggle-reaction-picker="$emit('toggle-reaction-picker', $event)"
        @pick-reaction="(message, emoji) => $emit('pick-reaction', message, emoji)"
        @start-reply="$emit('start-reply', $event)"
        @begin-edit="$emit('begin-edit', $event)"
        @confirm-delete="$emit('confirm-delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageBubble from './MessageBubble.vue'

interface Props {
  messages: any[]
  typingUsers: Set<string>
  isLoadingMessages: boolean
  currentUserId: string | undefined
  highlightId: string | null
  editingMessageId: string | null
  editingContent: string
  reactionPickerForId: string | null
  quickReactions: string[]
  hasMoreOlder: boolean
  reactionCounts: (message: any) => Record<string, number>
  myReactionEmoji: (message: any) => string | null
  isImage: (url: string) => boolean
  isVideo: (url: string) => boolean
  isAudio: (url: string) => boolean
  formatTime: (time: any) => string
}

interface Emits {
  (e: 'jump-to-message', id: string): void
  (e: 'cancel-edit'): void
  (e: 'save-edit', message: any): void
  (e: 'toggle-reaction', message: any, emoji: string): void
  (e: 'toggle-reaction-picker', message: any): void
  (e: 'pick-reaction', message: any, emoji: string): void
  (e: 'start-reply', message: any): void
  (e: 'begin-edit', message: any): void
  (e: 'confirm-delete', message: any): void
  (e: 'load-older'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const messagesContainer = ref<HTMLDivElement | null>(null)

// Scroll handling for infinite loading
let loadingOlder = false
async function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (loadingOlder) return
  if (el.scrollTop <= 20 && props.hasMoreOlder) {
    loadingOlder = true
    const prevHeight = el.scrollHeight
    await emit('load-older')
    await nextTick()
    // Maintain viewport by offsetting scroll after prepending
    const newHeight = el.scrollHeight
    el.scrollTop = newHeight - prevHeight
    loadingOlder = false
  }
}

// Expose the messages container for parent access
defineExpose({
  messagesContainer
})
</script>