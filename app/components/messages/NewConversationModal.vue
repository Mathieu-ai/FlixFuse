<template>
  <UModal v-model:open="open">
    <slot />
    <template #content>
      <UCard class="max-w-lg mx-auto">
        <template #header>
          <h3 class="text-lg font-semibold">{{ isGroup ? 'Create Group' : 'Start New Conversation' }}</h3>
        </template>
        <div class="space-y-4">
          <div v-if="isGroup" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Group name</label>
            <UInput v-model="groupName" placeholder="Awesome group" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Members</label>
            <UInput v-model="memberSearch" placeholder="Search by name..." />
          </div>

          <div v-if="isGroup && selectedMembers.length" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selected members</label>
            <div class="flex flex-wrap gap-2">
              <div v-for="m in selectedMembers" :key="m.id" class="flex items-center gap-2 px-2 py-1 rounded-full border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/60 dark:bg-gray-800/60">
                <UAvatar :src="m.profilePicture || undefined" :alt="m.firstName || ''" size="2xs" />
                <span class="text-xs">{{ m.firstName }} {{ m.lastName || '' }}</span>
                <UButton size="xs" variant="ghost" color="error" @click.stop="removeSelected(m.id)"><UIcon name="i-heroicons-x-mark" /></UButton>
              </div>
            </div>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200/60 dark:border-gray-800/60 p-2">
            <div v-if="results.length === 0" class="text-sm text-gray-500 p-2">
              {{ memberSearch.length >= 2 ? 'No results' : 'Type at least 2 characters to search' }}
            </div>

            <div
              v-for="member in displayResults"
              :key="member.id"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="onResultClick(member)"
            >
              <div class="flex items-center gap-3">
                <UAvatar :src="member.profilePicture || undefined" :alt="member.firstName || ''" size="sm" />
                <div>
                  <p class="font-medium">{{ member.firstName }} {{ member.lastName }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ member.petsCount }} pets</p>
                </div>
              </div>
              <UButton v-if="isGroup" size="xs" class="rounded-full" @click.stop="addSelected(member)"><UIcon name="i-heroicons-user-plus" /></UButton>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <UButton @click="open = false" variant="outline">Cancel</UButton>
            <UButton v-if="isGroup" :disabled="!canCreate" @click="createGroup()">Create group</UButton>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
type Member = { id: string; firstName: string; lastName?: string | null; profilePicture?: string | null; petsCount?: number }
const props = defineProps<{ modelValue: boolean; group?: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'start', member: Member): void; (e: 'create-group', payload: { name: string; userIds: string[] }): void }>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const memberSearch = ref('')
const results = ref<Member[]>([])
const isGroup = computed(() => !!props.group)
const groupName = ref('')
const selectedMembers = ref<Member[]>([])
const authHeaders = computed<HeadersInit | undefined>(() => undefined)
let searchDebounce: number | undefined

watch(memberSearch, (q: string) => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(async () => {
    if ((q || '').trim().length < 2) { results.value = []; return }
    try {
      const res = await $fetch('/api/members', { query: { search: q, limit: 10 }, headers: authHeaders.value }) as any
      results.value = (res?.data?.members || []) as Member[]
    } catch { results.value = [] }
  }, 300)
})

const displayResults = computed(() => {
  if (!isGroup.value) return results.value
  const selected = new Set(selectedMembers.value.map(m => m.id))
  return results.value.filter(m => !selected.has(m.id))
})

const canCreate = computed(() => isGroup.value && groupName.value.trim().length > 0 && selectedMembers.value.length >= 2)

watch(open, (o) => {
  if (o) {
    memberSearch.value = ''
    results.value = []
    // do not reset isGroup to let user reuse last choice; but clear selections per open
    groupName.value = ''
    selectedMembers.value = []
  }
})

function start(member: Member) { emit('start', member) }
function onResultClick(member: Member) { if (isGroup.value) addSelected(member); else start(member) }
function addSelected(member: Member) {
  if (!selectedMembers.value.some(m => m.id === member.id)) selectedMembers.value.push(member)
}
function removeSelected(id: string) {
  const idx = selectedMembers.value.findIndex(m => m.id === id)
  if (idx !== -1) selectedMembers.value.splice(idx, 1)
}
function createGroup() {
  if (!canCreate.value) return
  emit('create-group', { name: groupName.value.trim(), userIds: selectedMembers.value.map(m => m.id) })
}
</script>
