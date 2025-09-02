<template>
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
    <div class="ml-auto" v-if="selectedConversation.participants.find(p => p.role === 'ADMIN')?.user?.id === currentUserId">
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
                      <UButton size="xs" variant="outline" color="error" @click="$emit('remove-participant', p)"><UIcon name="i-heroicons-user-minus"/></UButton>
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
                      <UButton size="xs" @click="$emit('add-member', m)"><UIcon name="i-heroicons-user-plus"/></UButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton variant="outline" @click="openGroupSettings = false">Close</UButton>
                <UButton :loading="savingGroup" @click="$emit('save-group')">Save</UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedConversation: any
  currentUserId: string | undefined
  isOnline: boolean
  isReconnecting: boolean
  savingGroup: boolean
  groupForm: any
  roleOptions: any[]
  roleChanges: Record<string, any>
  addMembersSearch: string
  addMembersResults: any[]
  otherParticipant: (conversation: any) => any
  conversationName: (conversation: any) => string
  formatTime: (time: any) => string
}

interface Emits {
  (e: 'remove-participant', participant: any): void
  (e: 'add-member', member: any): void
  (e: 'save-group'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for group settings modal
const openGroupSettings = ref(false)
</script>