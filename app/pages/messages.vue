<template>
  <div class="min-h-screen">
    <UContainer class="py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- SIDEBAR -->
        <ChatAside
          :conversations="conversations"
          :selected-conversation="selectedConversation"
          :is-loading-conversations="isLoadingConversations"
          :search="sidebarSearch"
          :other-participant="otherParticipant"
          :conversation-name="conversationName"
          :format-time="formatTime"
          :message-preview="messagePreview"
          @update:search="sidebarSearch = $event"
          @start-conversation="startConversation"
          @create-group="createGroupFromModal"
          @select-conversation="selectConversation"
        />

        <!-- CHAT AREA -->
        <section class="lg:col-span-2">
          <!-- No conversation selected -->
          <UCard
            v-if="!selectedConversation"
            class="h-[80vh] flex items-center justify-center border border-gray-200/60 dark:border-gray-800/60 shadow-sm bg-white/70 dark:bg-gray-900/70 rounded-2xl"
          >
            <div class="text-center">
              <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 class="text-xl font-semibold mb-2">Select a conversation</h3>
              <p class="text-gray-600 dark:text-gray-300">Choose a conversation from the list to start messaging</p>
            </div>
          </UCard>

          <!-- Active conversation -->
          <UCard
            v-else
            class="relative h-[80vh] overflow-y-auto flex flex-col border border-gray-200/60 dark:border-gray-800/60 shadow-sm bg-white/80 dark:bg-gray-900/80 rounded-2xl"
          >
            <!-- Header -->
            <template #header>
              <ChatHeader
                :selected-conversation="selectedConversation"
                :current-user-id="authStore.user?.id"
                :is-online="isOnline"
                :is-reconnecting="isReconnecting"
                :saving-group="savingGroup"
                :group-form="groupForm"
                :role-options="roleOptions"
                :role-changes="roleChanges"
                :add-members-search="addMembersSearch"
                :add-members-results="addMembersResults"
                :other-participant="otherParticipant"
                :conversation-name="conversationName"
                :format-time="formatTime"
                @remove-participant="removeParticipant"
                @add-member="addMember"
                @save-group="saveGroup"
              />
            </template>

            <!-- Messages area (scrollable) -->
            <MessagesList
              ref="messagesListRef"
              :messages="messages"
              :typing-users="typingUsers"
              :is-loading-messages="isLoadingMessages"
              :current-user-id="authStore.user?.id"
              :highlight-id="highlightId"
              :editing-message-id="editingMessageId"
              :editing-content="editingContent"
              :reaction-picker-for-id="reactionPickerForId"
              :quick-reactions="quickReactions"
              :has-more-older="convStore.hasMoreOlder"
              :reaction-counts="reactionCounts"
              :my-reaction-emoji="myReactionEmoji"
              :is-image="isImage"
              :is-video="isVideo"
              :is-audio="isAudio"
              :format-time="formatTime"
              @jump-to-message="jumpToMessage"
              @cancel-edit="cancelEdit"
              @save-edit="saveEdit"
              @toggle-reaction="toggleReaction"
              @toggle-reaction-picker="toggleReactionPicker"
              @pick-reaction="pickReactionFor"
              @start-reply="startReply"
              @begin-edit="beginEdit"
              @confirm-delete="confirmDelete"
              @load-older="convStore.loadOlderMessages"
            />

            <!-- Sticky Input Bar -->
            <ChatComposer
              ref="composerRef"
              v-model:message="newMessage"
              :attachments="attachments"
              :reply-to="replyTo"
              :is-sending-message="isSendingMessage"
              :is-uploading="isUploading"
              :is-recording="isRecording"
              :dictating="dictating"
              :detected-language="detectedLanguage"
              :camera-video="cameraVideo"
              :preview-url="previewUrl"
              :file-kind="fileKind"
              @send-message="sendMessage"
              @remove-attachment="removeAttachment"
              @cancel-reply="replyTo = null"
              @trigger-image-picker="triggerImagePicker"
              @close-camera="closeCamera"
              @snap-photo="snapPhoto"
              @start-voice-record="startVoiceRecord"
              @stop-voice-record="stopVoiceRecord"
              @typing="emitTyping"
              @files-selected="onFilesSelected"
            />
          </UCard>
        </section>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import ChatAside from '~/components/messages/ChatAside.vue'
import ChatHeader from '~/components/messages/ChatHeader.vue'
import MessagesList from '~/components/messages/MessagesList.vue'
import ChatComposer from '~/components/messages/ChatComposer.vue'
import { useChatUtils } from '~/composables/useChatUtils'
import { useVoiceRecorder } from '~/composables/useVoiceRecorder'
import { useDictation } from '~/composables/useDictation'
import { useCamera } from '~/composables/useCamera'
import { useConversationEvents } from '~/composables/useConversationEvents'
import { useGroupSettings } from '~/composables/useGroupSettings'
import { useMessageInteractions } from '~/composables/useMessageInteractions'

definePageMeta({
  title: 'Messages',
  middleware: 'auth'
})

// Stores
const authStore = useAuthStore()
const wsStore = useWsStore()
const convStore = useConversationsStore()

// Cookies carry auth; no Authorization headers required
const authHeaders = computed<HeadersInit | undefined>(() => undefined)

// Chat helpers
const { otherParticipant, conversationName, formatTime, isImage, isVideo, isAudio, inferMessageType, messagePreview } = useChatUtils()

// State
const conversations = computed(() => convStore.conversations)
const sidebarSearch = ref('')
const selectedConversation = computed(() => convStore.selected)
const messages = computed(() => convStore.messages)
const newMessage = ref('')
const replyTo = ref<any | null>(null)
const quickReactions = ['👍','❤️','😂','😮','😢','🙌']
const highlightId = ref<string | null>(null)

// Message interactions (reactions, edit/delete)
const {
  reactionPickerForId,
  reactionCounts,
  myReactionEmoji,
  toggleReaction,
  toggleReactionPicker,
  onReactionOpenChange,
  pickReactionFor,
  editingMessageId,
  editingContent,
  beginEdit,
  cancelEdit,
  saveEdit,
  confirmDelete,
} = useMessageInteractions({ selectedConversation })

const {
  openGroupSettings,
  savingGroup,
  groupForm,
  roleOptions,
  roleChanges,
  addMembersSearch,
  addMembersResults,
  saveGroup,
  removeParticipant,
  addMember,
} = useGroupSettings({ selectedConversation })

const isLoadingConversations = computed(() => convStore.isLoadingConversations)
const isLoadingMessages = computed(() => convStore.isLoadingMessages)
const isSendingMessage = computed(() => convStore.isSending)
const isOnline = computed(() => wsStore.isOnline)
const isReconnecting = computed(() => wsStore.isReconnecting)

const messagesListRef = ref<any>(null)
const composerRef = ref<any>(null)

// Close reaction card on outside click
function onDocumentClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null
  if (!t) return
  // if clicking the trigger or inside the card, ignore
  if (t.closest('.reaction-card') || t.closest('.reaction-trigger')) return
  reactionPickerForId.value = null
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

// Typing indicators
const typingUsers = ref<Set<string>>(new Set())
let lastTypingSentAt = 0
function emitTyping() {
  if (!wsStore.currentTopic || !authStore.user?.id) return
  const now = Date.now()
  if (now - lastTypingSentAt < 1500) return
  lastTypingSentAt = now
  wsStore.publish(wsStore.currentTopic, { type: 'conversation.typing', conversationId: selectedConversation.value?.id, userId: authStore.user.id, action: 'start' })
  // Auto send stop event after 3s of inactivity
  setTimeout(() => {
    if (wsStore.currentTopic) wsStore.publish(wsStore.currentTopic, { type: 'conversation.typing', conversationId: selectedConversation.value?.id, userId: authStore.user?.id, action: 'stop' })
  }, 3000)
}

// Media & uploads
const attachments = ref<File[]>([])
const isUploading = ref(false)
const dictating = ref(false)
const whisperMode = ref(true)
let whisperAbort: AbortController | null = null

// Voice recorder
const { isRecording, start: startRecord, stop: stopRecord, cancel: cancelRecord } = useVoiceRecorder()

// Dictation
const { start: startSR, stop: stopSR, detectedLanguage, interimTranscript } = useDictation()

// Camera
const { open: openCameraModal, videoEl: cameraVideo, start: startCameraC, stop: stopCameraC, capture: capturePhoto } = useCamera()

watch(openCameraModal, async (open) => { if (open) await startCameraC(); else stopCameraC() })

function closeCamera() { openCameraModal.value = false }

function snapPhoto() {
  const file = capturePhoto()
  if (file) { attachments.value.push(file); closeCamera() }
}

// Methods
const { init: initEvents, teardown: teardownEvents, subscribeToConversation, subscribeToConversationsList } = useConversationEvents({
  typingUsers,
  onSelectedMessageAppended: () => scrollToBottom()
})

async function loadConversations() { try { await convStore.loadConversations(); subscribeToConversationsList() } catch { /* ignore */ } }

async function selectConversation(conversation: any) {
  await convStore.selectConversation(conversation.id)
  subscribeToConversation(conversation.id)
}

async function sendMessage() {
  if (dictating.value) stopDictation()
  if ((!newMessage.value.trim() && attachments.value.length === 0) || !selectedConversation.value) return

  try {
    // Upload attachments if any
    let uploadedUrls: string[] = []
    if (attachments.value.length) {
      isUploading.value = true
      const form = new FormData()
      for (const file of attachments.value) form.append('file', file, file.name)
      const uploadRes = await $fetch('/api/uploads', {
        method: 'POST',
        body: form,
        headers: authHeaders.value as any
      }) as any
      uploadedUrls = uploadRes?.data?.urls || []
      isUploading.value = false
    }

    const resolvedType = inferMessageType(attachments.value, uploadedUrls) || 'TEXT'

    const response = await convStore.sendMessage(selectedConversation.value.id, newMessage.value.trim() || undefined, uploadedUrls, resolvedType, replyTo.value?.id)
    if (response?.success && response.data) {
      const incoming = response.data.message
      const id = incoming?.id
      const exists = id ? convStore.messages.some((m: any) => m?.id === id) : false
      if (!exists) convStore.appendMessage(incoming)
      newMessage.value = ''
      attachments.value = []
      replyTo.value = null
      scrollToBottom()
    }
  } catch (error) {
    console.error('Error sending message:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to send message',
      color: 'error'
    })
  } finally {
    // sending state handled by store
  }
}

async function startConversation(member: any) {
  try {
    const response = await convStore.createConversation(member.id)
    if (response.success && response.data) {
      await selectConversation(response.data.conversation)
    }
  } catch (error: any) {
    console.error('Error starting conversation:', error)
    if (error?.message?.includes('already exists')) {
      useToast().add({
        title: 'Info',
        description: 'Conversation already exists',
        color: 'info'
      })
    } else {
      useToast().add({
        title: 'Error',
        description: 'Failed to start conversation',
        color: 'error'
      })
    }
  }
}

async function createGroupFromModal(payload: { name: string; userIds: string[] }) {
  try {
    const res = await convStore.createGroup(payload.name, payload.userIds)
    if (res?.success && res.data?.conversation) {
      await selectConversation(res.data.conversation)
    }
  } catch {
    useToast().add({ title: 'Error', description: 'Failed to create group', color: 'error' })
  }
}

function scrollToBottom(force = false) {
  nextTick(() => {
    const el = messagesListRef.value?.messagesContainer
    if (!el) return
    // Defer to next frame to ensure layout (especially after images/videos render)
    requestAnimationFrame(() => {
      // Only auto-scroll if near bottom or forced (on open / after send)
      const nearBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) < 120
      if (force || nearBottom) el.scrollTop = el.scrollHeight
    })
  })
}

// Attachments helpers
function triggerImagePicker() { composerRef.value?.imageInput?.click() }
function onFilesSelected(e: Event, kind: 'image'|'video') {
  const input = e.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  const filtered = files.filter(f => kind === 'image' ? f.type.startsWith('image/') : f.type.startsWith('video/'))
  attachments.value.push(...filtered)
  input.value = ''
}
function removeAttachment(index: number) { attachments.value.splice(index, 1) }
function previewUrl(file: File) { return URL.createObjectURL(file) }
function fileKind(file: File) {
  try {
    const t = (file as any)?.type as string | undefined
    const kind = (t && typeof t === 'string' ? t.split('/')[0] : 'FILE')
    return (kind ?? 'FILE').toUpperCase()
  } catch {
    return 'FILE'
  }
}

function startReply(message: any) { replyTo.value = { id: message.id, content: message.content, sender: message.sender } }

// Speech dictation helpers
function stopDictation() {
  dictating.value = false
  whisperAbort?.abort(); whisperAbort = null
  stopSR()
  interimTranscript.value = ''
  detectedLanguage.value = null
}

async function startVoiceRecord() {
  try {
    if (dictating.value) stopDictation()
    await startRecord()
    window.addEventListener('pointerup', stopVoiceRecordOnce, { once: true })
    window.addEventListener('keyup', escCancelOnce)
  } catch {
    useToast().add({ title: 'Voice', description: 'Microphone permission is required.', color: 'warning' })
  }
}

async function stopVoiceRecord() {
  if (!isRecording.value) return
  const file = await stopRecord()
  cleanupRecordListeners()
  if (file) await sendVoice(file)
}

function stopVoiceRecordOnce() { stopVoiceRecord() }
function escCancelOnce(e: KeyboardEvent) { if (e.key === 'Escape') { cancelRecord(); cleanupRecordListeners() } }
function cleanupRecordListeners() {
  try { window.removeEventListener('pointerup', stopVoiceRecordOnce as any) } catch {}
  try { window.removeEventListener('keyup', escCancelOnce as any) } catch {}
}

async function sendVoice(file: File) {
  if (!selectedConversation.value) return
  try {
    isUploading.value = true
    const form = new FormData()
    form.append('file', file, file.name)
    const uploadRes = await $fetch('/api/uploads', {
      method: 'POST',
      body: form,
      headers: authHeaders.value as any
    }) as any
    const urls: string[] = uploadRes?.data?.urls || []
    isUploading.value = false
    if (urls.length) {
      const response = await convStore.sendMessage(selectedConversation.value.id, undefined, urls, 'AUDIO')
      if (response?.success && response.data) {
        const msg = response.data.message
        const id = msg?.id
        const exists = id ? convStore.messages.some((m: any) => m?.id === id) : false
        if (!exists) convStore.appendMessage(msg)
        scrollToBottom(true)
      }
    }
  } catch (e) {
    isUploading.value = false
    useToast().add({ title: 'Voice', description: 'Failed to send voice message.', color: 'error' })
  }
}

// Lifecycle
onMounted(async () => {
  await loadConversations()
  // init ws routing
  initEvents()
})

onBeforeUnmount(() => { teardownEvents() })

// Jump to a specific message by id (loads older pages if needed)
async function jumpToMessage(id?: string) {
  if (!id) return
  const messagesContainer = messagesListRef.value?.messagesContainer
  const findEl = () => messagesContainer?.querySelector(`#msg-${CSS.escape(id)}`) as HTMLElement | null
  let el = findEl()
  let safety = 0
  while (!el && convStore.hasMoreOlder && safety < 50) {
    await convStore.loadOlderMessages()
    await nextTick()
    el = findEl()
    safety += 1
  }
  if (el) {
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch { /* fallback */ }
    highlightId.value = id
    setTimeout(() => { if (highlightId.value === id) highlightId.value = null }, 1600)
  } else {
    useToast().add({ title: 'Message not loaded', description: 'Unable to find the replied message.', color: 'warning' })
  }
}
</script>