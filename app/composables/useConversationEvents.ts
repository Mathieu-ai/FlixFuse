import type { Ref } from 'vue'
import type { Message, Conversation, ParticipantUser } from '~/stores/conversations'

type Participant = { id: string; role: string; user: ParticipantUser }

export function useConversationEvents(opts: { typingUsers: Ref<Set<string>>; onSelectedMessageAppended?: () => void }) {
  const authStore = useAuthStore()
  const convStore = useConversationsStore()
  const wsStore = useWsStore()
  const selectedConversation = computed(() => convStore.selected)

  function subscribeToConversation(id: string) {
    const topic = `conversation:${id}`
    wsStore.setCurrentTopic(topic)
    wsStore.subscribe(topic)
    if (authStore.user?.id) wsStore.subscribe(`user:${authStore.user.id}:conversations`)
  }

  function subscribeToConversationsList() {
    const topics = (convStore.conversations || []).map((c: Conversation) => `conversation:${c.id}`)
    for (const t of topics) wsStore.subscribe(t)
  }

  function init() {
    wsStore.connect((data: unknown) => {
      const evt = data as {
        type?: string
        message?: Message
        conversation?: Conversation
        conversationId?: string
        messageId?: string
        reactions?: Array<{ userId: string; reaction: string; ts: number }>
        participant?: { id: string; role: string; user: unknown }
        userId?: string
        isOnline?: boolean
        lastActiveAt?: string
        action?: 'start' | 'stop'
      }
      if (evt?.type === 'pong') return

      if (evt?.type === 'conversation.message') {
        const incoming: Message | undefined = evt.message
        const cid: string | undefined = evt.conversationId
        if (!incoming?.id || !cid) return
        convStore.promoteConversation(cid, incoming)
        if (cid === selectedConversation.value?.id) {
          convStore.appendMessage(incoming)
          opts.onSelectedMessageAppended?.()
        }
        return
      }

      if (evt?.type === 'conversation.message.update' && evt.conversationId === selectedConversation.value?.id) {
        const updated: Message | undefined = evt.message
        if (updated?.id) convStore.applyMessageUpdate(updated)
        return
      }

      if (evt?.type === 'conversation.message.delete' && evt.conversationId === selectedConversation.value?.id) {
        if (evt.messageId) convStore.applyMessageDelete(String(evt.messageId))
        return
      }

      if (evt?.type === 'conversation.reaction' && evt.conversationId === selectedConversation.value?.id) {
        const msgId = evt.messageId
        const reactions = evt.reactions
        if (msgId) convStore.applyMessageUpdate({ id: String(msgId), reactions } as unknown as Message)
        return
      }

      if (evt?.type === 'conversation.updated' && evt.conversation) {
        const conv = evt.conversation
        const idx = convStore.conversations.findIndex((c: Conversation) => c.id === conv.id)
        if (idx !== -1) convStore.conversations[idx] = { ...convStore.conversations[idx], ...conv }
        return
      }

      if (evt?.type?.startsWith('conversation.participant.') && evt.conversationId && evt.participant) {
        const cidx = convStore.conversations.findIndex((c: Conversation) => c.id === evt.conversationId)
        if (cidx !== -1) {
          const conv = convStore.conversations[cidx] as Conversation
          const participants: Participant[] = Array.isArray(conv.participants) ? [...(conv.participants as Participant[])] : []
          if (evt.type === 'conversation.participant.added') {
            participants.push(evt.participant as Participant)
          } else if (evt.type === 'conversation.participant.removed') {
            const pid = String((evt.participant as Participant).id)
            convStore.conversations[cidx] = { ...(conv as Conversation), participants: participants.filter((p: Participant) => String(p.id) !== pid) }
            return
          } else if (evt.type === 'conversation.participant.role') {
            const pid = String((evt.participant as Participant).id)
            const pidx = participants.findIndex((p: Participant) => String(p.id) === pid)
            if (pidx !== -1) participants[pidx] = { ...(participants[pidx] as Participant), role: (evt.participant as Participant).role }
          }
          convStore.conversations[cidx] = { ...(conv as Conversation), participants } as Conversation
        }
        return
      }

      if (evt?.type === 'conversation.typing' && evt.conversationId === selectedConversation.value?.id) {
        const uid = String(evt.userId)
        if (evt.action === 'start') {
          opts.typingUsers.value.add(uid)
          setTimeout(() => opts.typingUsers.value.delete(uid), 4000)
        } else if (evt.action === 'stop') {
          opts.typingUsers.value.delete(uid)
        }
        return
      }

      if (evt?.type === 'presence.update' && evt.userId) {
        convStore.updatePresence(String(evt.userId), !!evt.isOnline, evt.lastActiveAt)
        return
      }

      if (evt?.type === 'conversation.created' && evt.conversation) {
        const conv = evt.conversation
        const exists = convStore.conversations.some((c: Conversation) => c.id === conv.id)
        if (!exists) {
          convStore.conversations.unshift(conv)
          subscribeToConversation(conv.id)
        }
        return
      }
    })

    // base subscriptions
    wsStore.subscribe('presence')
    if (authStore.user?.id) {
      wsStore.subscribe(`user:${authStore.user.id}:conversations`)
      wsStore.subscribe(`user:${authStore.user.id}:presence`)
    }
  }

  function teardown() { wsStore.teardown() }

  return { init, teardown, subscribeToConversation, subscribeToConversationsList }
}
