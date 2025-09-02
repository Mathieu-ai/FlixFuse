<template>
  <div
    :id="'msg-' + message.id"
    class="flex group"
    :class="message.sender.id === currentUserId ? 'justify-end' : 'justify-start'"
  >
    <div
      class="relative max-w-[78%] lg:max-w-[68%] px-3 py-2 rounded-2xl shadow-sm border transition ring-0"
      :class="message.sender.id === currentUserId
        ? ['bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-500/20 rounded-br-md', highlightId === message.id ? 'ring-2 ring-white/60' : '']
        : ['bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-200/60 dark:border-gray-700/60 rounded-bl-md', highlightId === message.id ? 'ring-2 ring-primary-300/50 dark:ring-primary-700/50' : '']"
    >
      <p v-if="message.sender.id !== currentUserId" class="text-[11px] font-medium mb-1 text-gray-600 dark:text-gray-300">{{ message.sender.firstName }}</p>
      
      <!-- Reply preview inside bubble (click to jump) -->
      <button v-if="message.replyTo" type="button" class="mb-2 text-left w-full text-xs rounded-md border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/60 dark:bg-gray-900/40 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        @click.stop="$emit('jump-to-message', message.replyTo.id)">
        <p class="font-medium truncate">↪︎ {{ message.replyTo.sender.displayName || message.replyTo.sender.firstName }}</p>
        <p class="truncate opacity-80">{{ (message.replyTo.content || '').slice(0, 120) }}</p>
      </button>

      <!-- Content or edit form -->
      <div v-if="editingMessageId === message.id" class="space-y-2">
        <UTextarea v-model="editingContent" :rows="2" autofocus />
        <div class="flex gap-2 justify-end">
          <UButton size="xs" variant="outline" @click="$emit('cancel-edit')">Cancel</UButton>
          <UButton size="xs" @click="$emit('save-edit', message)">Save</UButton>
        </div>
      </div>
      <p v-else-if="message.content" class="text-sm whitespace-pre-wrap">{{ message.content }}</p>

      <!-- Attachments -->
      <div v-if="message.attachments && message.attachments.length" class="mt-2 space-y-2">
        <div v-for="(url, idx) in message.attachments" :key="idx">
          <img v-if="isImage(url)" :src="url" alt="image" class="rounded-md max-h-52 object-cover" />
          <video v-else-if="isVideo(url)" :src="url" controls class="rounded-md max-h-56" />
          <AudioMessage v-else-if="isAudio(url)" :src="url" :mine="message.sender.id === currentUserId" />
          <a v-else :href="url" target="_blank" class="underline">Attachment</a>
        </div>
      </div>

      <!-- Reactions summary -->
      <div v-if="message.reactions && message.reactions.length" class="mt-1 flex flex-wrap gap-1">
        <button
          v-for="(count, emoji) in reactionCounts(message)"
          :key="emoji"
          type="button"
          class="px-1.5 py-0.5 rounded-full text-[11px] border transition"
          :class="[
            'border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800',
            myReactionEmoji(message) === emoji ? 'ring-1 ring-primary-400/60 dark:ring-primary-600/60' : ''
          ]"
          @click.stop="$emit('toggle-reaction', message, emoji)"
          :title="myReactionEmoji(message) === emoji ? 'Remove my reaction' : 'React with ' + emoji"
        >
          {{ emoji }} {{ count }}
        </button>
      </div>

      <!-- Footer: time + actions -->
      <div class="mt-1 flex items-center justify-between">
        <p class="text-[10px] opacity-70">{{ formatTime(message.createdAt) }}<span v-if="message.isEdited"> · edited</span></p>
        <div class="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
          <div class="relative">
            <UButton size="xs" variant="ghost" class="reaction-trigger rounded-full px-2 py-1" title="React" @click.stop="$emit('toggle-reaction-picker', message)">
              <UIcon name="i-heroicons-face-smile" />
            </UButton>
            <div
              v-if="reactionPickerForId === message.id"
              class="reaction-card absolute bottom-full mb-1 z-20"
              :class="message.sender.id === currentUserId ? 'right-0' : 'left-0'"
            >
              <UCard class="rounded-2xl shadow-md border border-gray-200/60 dark:border-gray-700/60" :ui="{ body: 'p-1', header: 'hidden', footer: 'hidden' }">
                <div class="flex items-center gap-1 text-xl">
                  <button
                    v-for="emoji in quickReactions"
                    :key="emoji"
                    class="px-1 py-0.5 hover:scale-110 transition"
                    @click.stop="$emit('pick-reaction', message, emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </UCard>
            </div>
          </div>
          <UButton size="xs" variant="ghost" class="rounded-full px-2 py-1" title="Reply" @click="$emit('start-reply', message)">
            <UIcon name="i-heroicons-arrow-uturn-left" />
          </UButton>
          <UButton v-if="message.sender.id === currentUserId && message.content" size="xs" variant="ghost" class="rounded-full px-2 py-1" title="Edit" @click="$emit('begin-edit', message)">
            <UIcon name="i-heroicons-pencil-square" />
          </UButton>
          <UButton v-if="message.sender.id === currentUserId" size="xs" variant="ghost" color="error" class="rounded-full px-2 py-1" title="Delete" @click="$emit('confirm-delete', message)">
            <UIcon name="i-heroicons-trash" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AudioMessage from '~/components/AudioMessage.vue'

interface Props {
  message: any
  currentUserId: string | undefined
  highlightId: string | null
  editingMessageId: string | null
  editingContent: string
  reactionPickerForId: string | null
  quickReactions: string[]
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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>