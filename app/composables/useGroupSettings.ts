import type { ComputedRef } from 'vue'
import type { Conversation, ParticipantUser } from '~/stores/conversations'

type Role = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
type ParticipantLike = { id: string; role: string; user: ParticipantUser }
type MemberSummary = { id: string; firstName: string; lastName?: string | null; profilePicture?: string | null }

export function useGroupSettings(opts: { selectedConversation: ComputedRef<Conversation | null> }) {
  const convStore = useConversationsStore()
  const openGroupSettings = ref(false)
  const savingGroup = ref(false)
  const groupForm = reactive({ name: '', description: '', avatar: '', isMuted: false, isArchived: false })
  const roleOptions = [
    { label: 'Owner', value: 'OWNER' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Moderator', value: 'MODERATOR' },
    { label: 'Member', value: 'MEMBER' },
  ]
  const roleChanges = reactive<Record<string, Role | ''>>({})
  const addMembersSearch = ref('')
  const addMembersResults = ref<MemberSummary[]>([])
  const allowedRoles = new Set<Role>(['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'])
  const toRole = (r: string): Role => (allowedRoles.has(r as Role) ? (r as Role) : 'MEMBER')

  // Prefill when opening modal
  watch(openGroupSettings, (open) => {
    if (!open) return
    const c = opts.selectedConversation.value
    if (!c) return
    groupForm.name = c.name || ''
    groupForm.description = c.description || ''
    groupForm.avatar = c.avatar || ''
    groupForm.isMuted = !!c.isMuted
    groupForm.isArchived = !!c.isArchived
  // reset roleChanges without deleting keys (satisfies lint rule)
  for (const k of Object.keys(roleChanges)) { roleChanges[k] = '' }
  for (const p of (c.participants || [] as ParticipantLike[])) roleChanges[p.id] = toRole(p.role)
  })

  async function saveGroup() {
    const c = opts.selectedConversation.value
    if (!c) return
    try {
      savingGroup.value = true
      await convStore.updateConversation(c.id, {
        name: groupForm.name || undefined,
        description: groupForm.description || undefined,
        avatar: groupForm.avatar || undefined,
        isMuted: groupForm.isMuted,
        isArchived: groupForm.isArchived,
      })
  for (const p of (c.participants || [] as ParticipantLike[])) {
        const nextRole = roleChanges[p.id]
    if (nextRole && nextRole !== p.role) {
      await convStore.updateParticipantRole(c.id, p.id, nextRole as Role)
        }
      }
      useToast().add({ title: 'Saved', description: 'Group updated', color: 'success' })
      openGroupSettings.value = false
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save group'
      useToast().add({ title: 'Error', description: message, color: 'error' })
    } finally {
      savingGroup.value = false
    }
  }

  async function removeParticipant(p: ParticipantLike) {
    const c = opts.selectedConversation.value
    if (!c) return
    const ok = window.confirm(`Remove ${p.user?.firstName || 'member'}?`)
    if (!ok) return
    try { await convStore.removeParticipant(c.id, p.id) } catch { /* ignore */ }
  }

  async function addMember(m: MemberSummary) {
    const c = opts.selectedConversation.value
    if (!c) return
    try { await convStore.addParticipants(c.id, [m.id]) } catch { /* ignore */ }
  }

  // Member search for adding
  watch(addMembersSearch, async (q) => {
    if ((q || '').length < 2) { addMembersResults.value = []; return }
    const c = opts.selectedConversation.value
    try {
      const res = await $fetch<{ success: boolean; data?: { members: MemberSummary[] } }>('/api/members', { query: { search: q, limit: 10 } })
  const exclude = new Set((c?.participants || [] as ParticipantLike[]).map((p) => String(p.user.id)))
      addMembersResults.value = (res?.data?.members || []).filter((m: MemberSummary) => !exclude.has(String(m.id)))
    } catch { addMembersResults.value = [] }
  })

  return { openGroupSettings, savingGroup, groupForm, roleOptions, roleChanges, addMembersSearch, addMembersResults, saveGroup, removeParticipant, addMember }
}
