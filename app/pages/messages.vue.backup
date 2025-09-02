<template>
  <div class="min-h-screen">
    <UContainer class="py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- SIDEBAR -->
        <aside class="lg:col-span-1">
          <UCard class="border border-gray-200/60 dark:border-gray-800/60 shadow-sm rounded-2xl overflow-hidden">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Messages</h2>

                <!-- New conversation (header) -->
                <div class="flex items-center gap-2">
                  <NewConversationModal v-model="openNewConversationHeader" @start="startConversation">
                    <UButton size="sm" class="rounded-full">
                      <UIcon name="i-heroicons-user-plus" class="mr-1" /> Direct
                    </UButton>
                  </NewConversationModal>
                  <NewConversationModal v-model="openNewConversationEmpty" group @create-group="createGroupFromModal">
                    <UButton size="sm" variant="outline" class="rounded-full">
                      <UIcon name="i-heroicons-users" class="mr-1" /> Group
                    </UButton>
                  </NewConversationModal>
                </div>
              </div>
            </template>

            <!-- Sidebar search -->
            <div class="p-3">
              <UInput v-model="sidebarSearch" placeholder="Search conversations" icon="i-heroicons-magnifying-glass" class="w-full rounded-full" />
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
                <NewConversationModal v-model="openNewConversationEmpty" @start="startConversation">
                  <UButton class="rounded-full">Start direct chat</UButton>
                </NewConversationModal>
                <NewConversationModal v-model="openNewConversationHeader" group @create-group="createGroupFromModal">
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
                  @click="selectConversation(conversation)"
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
            class="relative h-[80vh]  overflow-y-auto flex flex-col border border-gray-200/60 dark:border-gray-800/60 shadow-sm bg-white/80 dark:bg-gray-900/80 rounded-2xl"
          >
            <!-- Header -->
            <template #header>
              <div class="flex items-center gap-3">
                <div v-if="!selectedConversation.isGroup && otherParticipant(selectedConversation)" class="relative">
                  <UAvatar :src="otherParticipant(selectedConversation)?.user.profilePicture || undefined" :alt="otherParticipant(selectedConversation)?.user.firstName || ''" size="sm" />
                  <span
                    class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900"
                    :class="otherParticipant(selectedConversation)?.user.isOnline ? 'bg-emerald-500' : 'bg-amber-400'"
                  />
                </div>
                <UIcon v-else name="i-heroicons-users" class="text-xl text-gray-400" />
                <div>
                  <h3 class="font-semibold">{{ conversationName(selectedConversation) }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <span>{{ selectedConversation.participantsCount }} participants</span>
                    <span class="opacity-40">•</span>
                    <span v-if="!selectedConversation.isGroup && otherParticipant(selectedConversation)">
                      <span v-if="otherParticipant(selectedConversation)?.user.isOnline" class="text-emerald-600 dark:text-emerald-400">Online</span>
                      <span v-else class="text-gray-500">Last seen {{ formatTime(otherParticipant(selectedConversation)?.user.lastActiveAt) }}</span>
                    </span>
                    <span class="ml-2"></span>
                    <span v-if="!isOnline" class="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">Offline</span>
                    <span v-else-if="isReconnecting" class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">Reconnecting…</span>
                  </div>
                </div>
                <div class="ml-auto" v-if="selectedConversation.participants.find(p => p.role === 'ADMIN')?.user?.id === authStore.user?.id">
                  <UModal v-if="selectedConversation?.isGroup" v-model:open="openGroupSettings">
                    <UButton variant="ghost" size="sm" class="rounded-full"><UIcon name="i-heroicons-cog-6-tooth" class="mr-1" />Settings</UButton>
                    <template #content>
                      <UCard class="max-w-2xl">
                        <template #header>
                          <h3 class="text-lg font-semibold">Group Settings</h3>
                        </template>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="col-span-1 md:col-span-2 space-y-3">
                            <UFormGroup label="Name">
                              <UInput v-model="groupForm.name" placeholder="Group name" />
                            </UFormGroup>
                            <UFormGroup label="Description">
                              <UTextarea v-model="groupForm.description" :rows="3" placeholder="Short description" />
                            </UFormGroup>
                            <UFormGroup label="Avatar URL">
                              <UInput v-model="groupForm.avatar" placeholder="https://..." />
                            </UFormGroup>
                            <div class="flex items-center gap-3">
                              <UToggle v-model="groupForm.isMuted" /> <span class="text-sm">Muted</span>
                              <UToggle v-model="groupForm.isArchived" /> <span class="text-sm">Archived</span>
                            </div>
                          </div>
                          <div class="col-span-1 md:col-span-2">
                            <h4 class="font-medium mb-2">Participants</h4>
                            <div class="space-y-2 max-h-60 overflow-auto pr-1">
                              <div v-for="p in (selectedConversation?.participants || [])" :key="p.id" class="flex items-center justify-between p-2 rounded-md border border-gray-200/60 dark:border-gray-800/60">
                                <div class="flex items-center gap-2">
                                  <UAvatar :src="p.user.profilePicture || undefined" :alt="p.user.firstName || ''" size="xs" />
                                  <div>
                                    <p class="text-sm font-medium">{{ p.user.displayName || p.user.firstName }}</p>
                                    <p class="text-[11px] text-gray-500">{{ p.role }}</p>
                                  </div>
                                </div>
                                <div class="flex items-center gap-2">
                                  <USelect :items="roleOptions" v-model="roleChanges[p.id]" size="xs" class="min-w-[120px]" />
                                  <UButton size="xs" variant="outline" color="error" @click="removeParticipant(p)"><UIcon name="i-heroicons-user-minus"/></UButton>
                                </div>
                              </div>
                            </div>
                            <div class="mt-3">
                              <label class="block text-sm font-medium mb-1">Add members by search</label>
                              <UInput v-model="addMembersSearch" placeholder="Search by name" />
                              <div class="mt-2 space-y-1 max-h-40 overflow-auto">
                                <div v-if="addMembersResults.length === 0" class="text-xs text-gray-500">{{ addMembersSearch.length < 2 ? 'Type 2+ chars to search' : 'No results' }}</div>
                                <div v-for="m in addMembersResults" :key="m.id" class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <div class="flex items-center gap-2">
                                    <UAvatar :src="m.profilePicture || undefined" :alt="m.firstName || ''" size="xs" />
                                    <span class="text-sm">{{ m.firstName }} {{ m.lastName || '' }}</span>
                                  </div>
                                  <UButton size="xs" @click="addMember(m)"><UIcon name="i-heroicons-user-plus"/></UButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="flex justify-end gap-2">
                            <UButton variant="outline" @click="openGroupSettings = false">Close</UButton>
                            <UButton :loading="savingGroup" @click="saveGroup">Save</UButton>
                          </div>
                        </template>
                      </UCard>
                    </template>
                  </UModal>
                </div>
              </div>
            </template>

            <!-- Messages area (scrollable) -->
            <div
              class="h-full overflow-y-auto pr-1"
              ref="messagesContainer"
              @scroll.passive="onMessagesScroll"
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
                <div
                  v-for="message in messages"
                  :key="message.id"
                  :id="'msg-' + message.id"
                  class="flex group"
                  :class="message.sender.id === authStore.user?.id ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="relative max-w-[78%] lg:max-w-[68%] px-3 py-2 rounded-2xl shadow-sm border transition ring-0"
                    :class="message.sender.id === authStore.user?.id
                      ? ['bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-500/20 rounded-br-md', highlightId === message.id ? 'ring-2 ring-white/60' : '']
                      : ['bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-200/60 dark:border-gray-700/60 rounded-bl-md', highlightId === message.id ? 'ring-2 ring-primary-300/50 dark:ring-primary-700/50' : '']"
                  >
                    <p v-if="message.sender.id !== authStore.user?.id" class="text-[11px] font-medium mb-1 text-gray-600 dark:text-gray-300">{{ message.sender.firstName }}</p>
                    <!-- Reply preview inside bubble (click to jump) -->
                    <button v-if="message.replyTo" type="button" class="mb-2 text-left w-full text-xs rounded-md border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/60 dark:bg-gray-900/40 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                      @click.stop="jumpToMessage(message.replyTo.id)">
                      <p class="font-medium truncate">↪︎ {{ message.replyTo.sender.displayName || message.replyTo.sender.firstName }}</p>
                      <p class="truncate opacity-80">{{ (message.replyTo.content || '').slice(0, 120) }}</p>
                    </button>

                    <!-- Content or edit form -->
                    <div v-if="editingMessageId === message.id" class="space-y-2">
                      <UTextarea v-model="editingContent" :rows="2" autofocus />
                      <div class="flex gap-2 justify-end">
                        <UButton size="xs" variant="outline" @click="cancelEdit()">Cancel</UButton>
                        <UButton size="xs" @click="saveEdit(message)">Save</UButton>
                      </div>
                    </div>
                    <p v-else-if="message.content" class="text-sm whitespace-pre-wrap">{{ message.content }}</p>

                    <!-- Attachments -->
          <div v-if="message.attachments && message.attachments.length" class="mt-2 space-y-2">
                      <div v-for="(url, idx) in message.attachments" :key="idx">
            <img v-if="isImage(url)" :src="url" alt="image" class="rounded-md max-h-52 object-cover" />
            <video v-else-if="isVideo(url)" :src="url" controls class="rounded-md max-h-56" />
            <AudioMessage v-else-if="isAudio(url)" :src="url" :mine="message.sender.id === authStore.user?.id" />
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
                        @click.stop="toggleReaction(message, emoji)"
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
                          <UButton size="xs" variant="ghost" class="reaction-trigger rounded-full px-2 py-1" title="React" @click.stop="toggleReactionPicker(message)">
                            <UIcon name="i-heroicons-face-smile" />
                          </UButton>
                          <div
                            v-if="reactionPickerForId === message.id"
                            class="reaction-card absolute bottom-full mb-1 z-20"
                            :class="message.sender.id === authStore.user?.id ? 'right-0' : 'left-0'"
                          >
                            <UCard class="rounded-2xl shadow-md border border-gray-200/60 dark:border-gray-700/60" :ui="{ body: 'p-1', header: 'hidden', footer: 'hidden' }">
                              <div class="flex items-center gap-1 text-xl">
                                <button
                                  v-for="emoji in quickReactions"
                                  :key="emoji"
                                  class="px-1 py-0.5 hover:scale-110 transition"
                                  @click.stop="pickReactionFor(message, emoji)"
                                >
                                  {{ emoji }}
                                </button>
                              </div>
                            </UCard>
                          </div>
                        </div>
                        <UButton size="xs" variant="ghost" class="rounded-full px-2 py-1" title="Reply" @click="startReply(message)">
                          <UIcon name="i-heroicons-arrow-uturn-left" />
                        </UButton>
                        <UButton v-if="message.sender.id === authStore.user?.id && message.content" size="xs" variant="ghost" class="rounded-full px-2 py-1" title="Edit" @click="beginEdit(message)">
                          <UIcon name="i-heroicons-pencil-square" />
                        </UButton>
                        <UButton v-if="message.sender.id === authStore.user?.id" size="xs" variant="ghost" color="error" class="rounded-full px-2 py-1" title="Delete" @click="confirmDelete(message)">
                          <UIcon name="i-heroicons-trash" />
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sticky Input Bar: safe from overlap, WhatsApp-like -->
            <div
              class="sticky bottom-0 z-10 border-t border-gray-200/60 dark:border-gray-800/60 px-3 sm:px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
            >
              <!-- Attachments preview -->
              <div v-if="attachments.length" class="flex flex-wrap gap-2 max-h-32 overflow-y-auto mb-2">
                <div v-for="(file, idx) in attachments" :key="idx" class="relative">
                  <img v-if="file.type.startsWith('image/')" :src="previewUrl(file)" class="h-16 w-16 object-cover rounded-lg" />
                  <video v-else-if="file.type.startsWith('video/')" :src="previewUrl(file)" class="h-16 w-16 object-cover rounded-lg" muted />
                  <div v-else class="h-16 w-16 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg text-xs">{{ fileKind(file) }}</div>
                  <UButton size="xs" variant="soft" color="error" class="absolute -top-2 -right-2" @click.prevent="removeAttachment(idx)">
                    <UIcon name="i-heroicons-x-mark" />
                  </UButton>
                </div>
              </div>

              <!-- Replying to chip -->
              <div v-if="replyTo" class="mb-2 text-xs flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/60 dark:bg-gray-900/40">
                <span class="font-medium">Replying to {{ replyTo.sender?.displayName || replyTo.sender?.firstName }}</span>
                <span class="opacity-70 truncate">“{{ (replyTo.content || '').slice(0, 60) }}”</span>
                <UButton size="xs" variant="ghost" color="error" @click="replyTo = null"><UIcon name="i-heroicons-x-mark" /></UButton>
              </div>

              <form @submit.prevent="sendMessage" class="flex items-center gap-2">
                <!-- Left actions -->
                <div class="flex items-center gap-1">
                  <UButton variant="ghost" size="sm" class="rounded-full" :disabled="isSendingMessage || isUploading" @click.prevent="triggerImagePicker" title="Attach image">
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
                            <UButton variant="outline" @click="closeCamera()">Cancel</UButton>
                            <UButton @click="snapPhoto()">Capture</UButton>
                          </div>
                        </div>
                      </UCard>
                    </template>
                  </UModal>

                  <UButton v-if="!isRecording" variant="ghost" size="sm" class="rounded-full" :disabled="isSendingMessage || isUploading" @pointerdown.prevent="startVoiceRecord" title="Hold to record">
                    <UIcon name="i-heroicons-microphone" />
                  </UButton>
                  <UButton v-else variant="soft" color="error" @click.prevent="stopVoiceRecord" title="Release to send">
                    <UIcon name="i-heroicons-stop-circle" />
                  </UButton>

                  <UButton variant="ghost" size="sm" class="rounded-full" title="Emoji picker">
                    <UIcon name="i-heroicons-face-smile" />
                  </UButton>
                </div>

                <!-- Text input + language indicator -->
                <div class="flex-1 flex items-center gap-2">
                  <UInput
                    v-model="newMessage"
                    placeholder="Type a message"
                    class="flex-1 rounded-full px-4 py-2 text-sm"
                    :disabled="isSendingMessage || isUploading"
                    @input="emitTyping()"
                  />
                  <span v-if="dictating && detectedLanguage" class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700/60" :title="'Detected language: ' + detectedLanguage">
                    {{ detectedLanguage }}
                  </span>
                </div>

                <!-- Send button (WhatsApp-like: mic if empty, send if text) -->
                <UButton
                  v-if="newMessage && newMessage.trim().length"
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
                  @pointerdown.prevent="startVoiceRecord"
                >
                  <UIcon name="i-heroicons-microphone" />
                </UButton>

                <!-- Hidden pickers -->
                <input ref="imageInput" type="file" accept="image/*" multiple capture="environment" class="hidden" @change="onFilesSelected($event, 'image')" />
                <input ref="videoInput" type="file" accept="video/*" multiple capture="environment" class="hidden" @change="onFilesSelected($event, 'video')" />
              </form>

              <!-- Safe area inset for iOS -->
              <div class="pt-[max(env(safe-area-inset-bottom),0px)]" />
            </div>
          </UCard>
        </section>
      </div>
    </UContainer>
  </div>
</template>


<script setup lang="ts">
import AudioMessage from '~/components/AudioMessage.vue'
import NewConversationModal from '~/components/messages/NewConversationModal.vue'
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
const filteredConversations = computed(() => {
  const q = sidebarSearch.value.trim().toLowerCase()
  if (!q) return conversations.value
  return conversations.value.filter((c: any) => {
    const name = conversationName(c).toLowerCase()
    const last = c?.lastMessage?.content?.toLowerCase?.() || ''
    return name.includes(q) || last.includes(q)
  })
})
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
// moved to NewConversationModal component
// Modal open states (pattern: inline trigger inside UModal)
const openNewConversationHeader = ref(false)
const openNewConversationEmpty = ref(false)

const isLoadingConversations = computed(() => convStore.isLoadingConversations)
const isLoadingMessages = computed(() => convStore.isLoadingMessages)
const isSendingMessage = computed(() => convStore.isSending)
const isOnline = computed(() => wsStore.isOnline)
const isReconnecting = computed(() => wsStore.isReconnecting)

const messagesContainer = ref<HTMLDivElement | null>(null)
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
// WebSocket is handled by wsStore; remove unused local vars
// Track typing users per selected conversation
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
const imageInput = ref<HTMLInputElement>()
const videoInput = ref<HTMLInputElement>()
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

async function loadMessages(conversationId: string) { await convStore.loadMessages(conversationId); scrollToBottom(true) }

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
      openNewConversationHeader.value = false
      openNewConversationEmpty.value = false
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
      openNewConversationHeader.value = false
      openNewConversationEmpty.value = false
      await selectConversation(res.data.conversation)
    }
  } catch {
    useToast().add({ title: 'Error', description: 'Failed to create group', color: 'error' })
  }
}

// moved to useChatUtils: otherParticipant, conversationName, formatTime

function scrollToBottom(force = false) {
  nextTick(() => {
    const el = messagesContainer.value
    if (!el) return
    // Defer to next frame to ensure layout (especially after images/videos render)
    requestAnimationFrame(() => {
      // Only auto-scroll if near bottom or forced (on open / after send)
      const nearBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) < 120
      if (force || nearBottom) el.scrollTop = el.scrollHeight
    })
  })
}

let loadingOlder = false
async function onMessagesScroll(e: Event) {
  const el = e.target as HTMLElement
  if (loadingOlder) return
  if (el.scrollTop <= 20 && convStore.hasMoreOlder) {
    loadingOlder = true
    const prevHeight = el.scrollHeight
    await convStore.loadOlderMessages()
    await nextTick()
    // Maintain viewport by offsetting scroll after prepending
    const newHeight = el.scrollHeight
    el.scrollTop = newHeight - prevHeight
    loadingOlder = false
  }
}

// Attachments helpers
function triggerImagePicker() { imageInput.value?.click() }
function triggerVideoPicker() { videoInput.value?.click() }
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
// moved to useChatUtils: isImage, isVideo, isAudio, inferMessageType, messagePreview

function startReply(message: any) { replyTo.value = { id: message.id, content: message.content, sender: message.sender } }

// Speech dictation (Web Speech API)
// Dictation handled via useDictation (Web Speech) or Whisper streaming

async function startDictation() {
  try {
    detectedLanguage.value = null
    if (!whisperMode.value) {
      await startSR((text) => { newMessage.value = text; }, () => emitTyping())
      dictating.value = true
      return
    }
    await startWhisperStreaming()
  } catch (e) {
    console.error('Dictation start error', e)
    useToast().add({ title: 'Dictation', description: 'Unable to start dictation.', color: 'error' })
  }
}

function stopDictation() {
  dictating.value = false
  whisperAbort?.abort(); whisperAbort = null
  stopSR()
  interimTranscript.value = ''
  detectedLanguage.value = null
}

// removed getAudioMimeAndExt: handled in useVoiceRecorder

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

function cancelVoiceRecord() { if (!isRecording.value) return; cancelRecord(); cleanupRecordListeners() }

function stopVoiceRecordOnce() { stopVoiceRecord() }
function escCancelOnce(e: KeyboardEvent) { if (e.key === 'Escape') { cancelVoiceRecord() } }
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

async function startWhisperStreaming() {
  let stream: MediaStream
  try {
    // Ensure mic permission and stream
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    useToast().add({ title: 'Dictation', description: 'Microphone permission is required.', color: 'warning' })
    return
  }
  interimTranscript.value = ''
  dictating.value = true
  const chunks: Blob[] = []
  whisperAbort = new AbortController()

  const mimeType = 'audio/webm;codecs=opus'
  const hasMime = MediaRecorder.isTypeSupported ? MediaRecorder.isTypeSupported(mimeType) : true
  const recType = hasMime ? mimeType : undefined
  const recorder = new MediaRecorder(stream, recType ? { mimeType: recType } : undefined)

  recorder.ondataavailable = async (e: BlobEvent) => {
    if (!e.data || e.data.size === 0 || !dictating.value) return
    chunks.push(e.data)
    // Build a self-contained blob including header + data
    const blob = new Blob(chunks, { type: (recType || 'audio/webm') as string })
  const form = new FormData()
  form.append('audio', blob, `chunk-${Date.now()}.webm`)
  const lang = ((navigator.language || 'en').toLowerCase().split(/[-_]/)[0]) || 'en'
  form.append('language', /^[a-z]{2}$/.test(lang) ? (lang as string) : 'en')
    try {
      const res = await fetch('/api/speech/whisper', {
        method: 'POST',
        body: form,
        signal: whisperAbort?.signal
      })
      if (!res.ok) return
      const json = await res.json() as { success: boolean; text?: string; language?: string }
      if (json?.success && typeof json.text === 'string') {
        // Append only the delta to avoid repetition
        const incoming = json.text.trim()
        const current = newMessage.value.trim()
        const delta = incoming.startsWith(current) ? incoming.slice(current.length).trimStart() : incoming
        const next = (current + (current && delta ? ' ' : '') + delta).trim()
        newMessage.value = next
        if (json.language) detectedLanguage.value = json.language.toUpperCase()
        emitTyping()
      }
    } catch { /* request aborted or network issue */ }
  }

  recorder.onstop = () => {
    // cleanup happens in stopDictation
  }

  recorder.start(1000) // emit data every 1s
}

// WS subscriptions come from composable
// Search moved into NewConversationModal

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
  const findEl = () => messagesContainer.value?.querySelector(`#msg-${CSS.escape(id)}`) as HTMLElement | null
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
