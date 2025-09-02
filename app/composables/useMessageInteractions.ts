import type { ComputedRef } from 'vue'
import type { Message } from '~/stores/conversations'

type ToggleAction = 'add' | 'remove'

type Reaction = { userId: string; reaction: string; ts: number }

export function useMessageInteractions(opts: { selectedConversation: ComputedRef<{ id: string } | null> }) {
  const authStore = useAuthStore()
  const convStore = useConversationsStore()

  // UI state
  const reactionPickerForId = ref<string | null>(null)
  const editingMessageId = ref<string | null>(null)
  const editingContent = ref('')

  function reactionCounts(message: Pick<Message, 'reactions'>) {
    const m: Record<string, number> = {}
    const list: Reaction[] = Array.isArray(message?.reactions) ? (message.reactions as Reaction[]) : []
    for (const r of list) { const e = r?.reaction || ''; if (!e) continue; m[e] = (m[e] || 0) + 1 }
    return m
  }

  function myReactionEmoji(message: Pick<Message, 'reactions'>): string | null {
    const uid = authStore.user?.id
    if (!uid) return null
    const list: Reaction[] = Array.isArray(message?.reactions) ? (message.reactions as Reaction[]) : []
    const mine = list.find((r: Reaction) => String(r.userId) === String(uid))
    return mine?.reaction || null
  }

  async function toggleReaction(message: Pick<Message, 'id' | 'reactions'>, emoji: string) {
    const uid = authStore.user?.id
    const conv = opts.selectedConversation.value
    if (!uid || !conv) return
    const original: Reaction[] = Array.isArray(message.reactions) ? ([...message.reactions] as Reaction[]) : []
    const mineSame = original.find((r: Reaction) => String(r.userId) === String(uid) && r.reaction === emoji)
    const action: ToggleAction = mineSame ? 'remove' : 'add'
    // Optimistic update
    try {
      let next: Reaction[] = [...original]
      if (action === 'add') {
        next = next.filter((r: Reaction) => String(r.userId) !== String(uid))
        next.push({ userId: String(uid), reaction: emoji, ts: Date.now() })
      } else {
        next = next.filter((r: Reaction) => !(String(r.userId) === String(uid) && r.reaction === emoji))
      }
      convStore.applyMessageUpdate({ id: message.id, reactions: next } as Message)
      await convStore.reactToMessage(conv.id, message.id, emoji, action)
    } catch {
      // Revert on error
      convStore.applyMessageUpdate({ id: message.id, reactions: original } as Message)
      useToast().add({ title: 'Reaction failed', description: 'Could not update reaction.', color: 'error' })
    }
  }

  function toggleReactionPicker(message: Pick<Message, 'id'>) {
    reactionPickerForId.value = reactionPickerForId.value === message.id ? null : message.id
  }

  function onReactionOpenChange(open: boolean, message: Pick<Message, 'id'>) {
    if (open) reactionPickerForId.value = message.id
    else if (reactionPickerForId.value === message.id) reactionPickerForId.value = null
  }

  function pickReactionFor(message: Pick<Message, 'id' | 'reactions'>, emoji: string) {
    void toggleReaction(message, emoji)
    if (reactionPickerForId.value === message.id) reactionPickerForId.value = null
  }

  function beginEdit(message: Pick<Message, 'id' | 'content'> & { content?: string }) {
    editingMessageId.value = message.id
    editingContent.value = message.content || ''
  }
  function cancelEdit() { editingMessageId.value = null; editingContent.value = '' }

  async function saveEdit(message: Pick<Message, 'id'>) {
    const conv = opts.selectedConversation.value
    if (!conv) return
    try {
      const content = editingContent.value.trim()
      if (!content) return
      const res = await convStore.editMessage(conv.id, message.id, content)
      if (res?.success && res.data?.message) {
        convStore.applyMessageUpdate(res.data.message as Message)
        editingMessageId.value = null
        editingContent.value = ''
      }
    } catch {
      useToast().add({ title: 'Edit failed', description: 'Could not edit message.', color: 'error' })
    }
  }

  async function confirmDelete(message: Pick<Message, 'id'>) {
    const conv = opts.selectedConversation.value
    if (!conv) return
    try {
      const ok = window.confirm('Delete this message for everyone?')
      if (!ok) return
      await convStore.deleteMessage(conv.id, message.id)
    } catch {
      useToast().add({ title: 'Delete failed', description: 'Could not delete message.', color: 'error' })
    }
  }

  return {
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
  }
}
