<template>
  <div class="sticky bottom-0 z-10 border-t border-gray-200/60 dark:border-gray-800/60 px-3 sm:px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
    <!-- Attachments preview -->
    <div v-if="attachments.length" class="flex flex-wrap gap-2 max-h-32 overflow-y-auto mb-2">
      <div v-for="(file, idx) in attachments" :key="idx" class="relative">
        <img v-if="file.type.startsWith('image/')" :src="previewUrl(file)" class="h-16 w-16 object-cover rounded-lg" />
        <video v-else-if="file.type.startsWith('video/')" :src="previewUrl(file)" class="h-16 w-16 object-cover rounded-lg" muted />
        <div v-else class="h-16 w-16 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg text-xs">{{ fileKind(file) }}</div>
        <UButton size="xs" variant="soft" color="error" class="absolute -top-2 -right-2" @click.prevent="$emit('remove-attachment', idx)">
          <UIcon name="i-heroicons-x-mark" />
        </UButton>
      </div>
    </div>

    <!-- Replying to chip -->
    <div v-if="replyTo" class="mb-2 text-xs flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/60 dark:bg-gray-900/40">
      <span class="font-medium">Replying to {{ replyTo.sender?.displayName || replyTo.sender?.firstName }}</span>
      <span class="opacity-70 truncate">"{{ (replyTo.content || '').slice(0, 60) }}"</span>
      <UButton size="xs" variant="ghost" color="error" @click="$emit('cancel-reply')"><UIcon name="i-heroicons-x-mark" /></UButton>
    </div>

    <form @submit.prevent="$emit('send-message')" class="flex items-center gap-2">
      <!-- Left actions -->
      <div class="flex items-center gap-1">
        <UButton variant="ghost" size="sm" class="rounded-full" :disabled="isSendingMessage || isUploading" @click.prevent="$emit('trigger-image-picker')" title="Attach image">
          <UIcon name="i-heroicons-paper-clip" />
        </UButton>

        <UModal v-model:open="openCameraModal">
          <UButton variant="ghost" size="sm" class="rounded-full" :disabled="isSendingMessage || isUploading" title="Open camera" @click="openCameraModal = true">
            <UIcon name="i-heroicons-camera" />
          </UButton>
          <template #content>
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Take a photo</h3>
              </template>
              <div class="space-y-4">
                <video ref="cameraVideo" autoplay playsinline muted class="w-full rounded-lg bg-black" />
                <div class="flex justify-end gap-2">
                  <UButton variant="outline" @click="$emit('close-camera')">Cancel</UButton>
                  <UButton @click="$emit('snap-photo')">Capture</UButton>
                </div>
              </div>
            </UCard>
          </template>
        </UModal>

        <UButton v-if="!isRecording" variant="ghost" size="sm" class="rounded-full" :disabled="isSendingMessage || isUploading" @pointerdown.prevent="$emit('start-voice-record')" title="Hold to record">
          <UIcon name="i-heroicons-microphone" />
        </UButton>
        <UButton v-else variant="soft" color="error" @click.prevent="$emit('stop-voice-record')" title="Release to send">
          <UIcon name="i-heroicons-stop-circle" />
        </UButton>

        <UButton variant="ghost" size="sm" class="rounded-full" title="Emoji picker">
          <UIcon name="i-heroicons-face-smile" />
        </UButton>
      </div>

      <!-- Text input + language indicator -->
      <div class="flex-1 flex items-center gap-2">
        <UInput
          v-model="message"
          placeholder="Type a message"
          class="flex-1 rounded-full px-4 py-2 text-sm"
          :disabled="isSendingMessage || isUploading"
          @input="$emit('typing')"
        />
        <span v-if="dictating && detectedLanguage" class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700/60" :title="'Detected language: ' + detectedLanguage">
          {{ detectedLanguage }}
        </span>
      </div>

      <!-- Send button (WhatsApp-like: mic if empty, send if text) -->
      <UButton
        v-if="message && message.trim().length"
        type="submit"
        size="md"
        class="rounded-full p-2 bg-primary-500 hover:bg-primary-600 text-white"
        :disabled="isSendingMessage || isUploading"
        :loading="isSendingMessage || isUploading"
      >
        <UIcon name="i-heroicons-paper-airplane" />
      </UButton>
      <UButton
        v-else
        variant="solid"
        size="md"
        class="rounded-full p-2"
        :disabled="isSendingMessage || isUploading"
        @pointerdown.prevent="$emit('start-voice-record')"
      >
        <UIcon name="i-heroicons-microphone" />
      </UButton>

      <!-- Hidden pickers -->
      <input ref="imageInput" type="file" accept="image/*" multiple capture="environment" class="hidden" @change="$emit('files-selected', $event, 'image')" />
      <input ref="videoInput" type="file" accept="video/*" multiple capture="environment" class="hidden" @change="$emit('files-selected', $event, 'video')" />
    </form>

    <!-- Safe area inset for iOS -->
    <div class="pt-[max(env(safe-area-inset-bottom),0px)]" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  attachments: File[]
  replyTo: any | null
  isSendingMessage: boolean
  isUploading: boolean
  isRecording: boolean
  dictating: boolean
  detectedLanguage: string | null
  cameraVideo: HTMLVideoElement | null
  previewUrl: (file: File) => string
  fileKind: (file: File) => string
}

interface Emits {
  (e: 'update:message', value: string): void
  (e: 'send-message'): void
  (e: 'remove-attachment', index: number): void
  (e: 'cancel-reply'): void
  (e: 'trigger-image-picker'): void
  (e: 'close-camera'): void
  (e: 'snap-photo'): void
  (e: 'start-voice-record'): void
  (e: 'stop-voice-record'): void
  (e: 'typing'): void
  (e: 'files-selected', event: Event, kind: 'image' | 'video'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for camera modal
const openCameraModal = ref(false)
const imageInput = ref<HTMLInputElement>()
const videoInput = ref<HTMLInputElement>()
const cameraVideo = ref<HTMLVideoElement>()

// Computed for v-model on message
const message = computed({
  get: () => props.message,
  set: (value: string) => emit('update:message', value)
})

// Expose refs for parent access
defineExpose({
  imageInput,
  videoInput,
  cameraVideo,
  openCameraModal
})
</script>