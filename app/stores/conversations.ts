import { defineStore } from 'pinia'

export interface Conversation {
  id: string
  name?: string | null
  description?: string | null
  avatar?: string | null
  isMuted?: boolean
  isArchived?: boolean
  isGroup: boolean
  participants: Array<{ id: string; role: string; user: ParticipantUser }>
  lastMessage?: Message | null
  participantsCount?: number
}

type ReactionAction = 'add' | 'remove'
type ParticipantRole = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
type ApiResponse<T> = { success: boolean; data?: T; message?: string }

export interface ParticipantUser {
  id: string
  firstName: string
  lastName?: string | null
  displayName?: string | null
  profilePicture?: string | null
  isOnline?: boolean
  lastActiveAt?: string
}

export interface Message {
  id: string
  content?: string
  messageType: string
  attachments?: string[]
  createdAt: string
  sender: ParticipantUser & { firstName: string }
  isEdited?: boolean
  editedAt?: string
  replyToId?: string | null
  replyTo?: { id: string; content?: string | null; sender: { id: string; firstName: string; displayName?: string | null } } | null
  reactions?: Array<{ userId: string; reaction: string; ts: number }>
}

export const useConversationsStore = defineStore('conversations', {
  state: () => ({
    conversations: [] as Conversation[],
    messages: [] as Message[],
    isLoadingConversations: false,
    isLoadingMessages: false,
    isSending: false,
  selectedId: null as string | null,
  olderCursor: null as string | null,
  hasMoreOlder: true
  }),
  getters: {
    selected(state) {
      return state.conversations.find(c => c.id === state.selectedId) || null
    }
  },
  actions: {
    async loadConversations() {
      this.isLoadingConversations = true
      try {
        const res = await $fetch<{ success: boolean; data?: { conversations: Conversation[] } }>('/api/conversations')
        if (res?.success && res.data) this.conversations = res.data.conversations || []
      } finally {
        this.isLoadingConversations = false
      }
    },
    async selectConversation(id: string) {
      this.selectedId = id
      this.messages = []
      this.olderCursor = null
      this.hasMoreOlder = true
      await this.loadMessages(id)
    },
    async loadMessages(id: string) {
      this.isLoadingMessages = true
      try {
        const res = await $fetch<{ success: boolean; data?: { messages: Message[]; pagination: { nextBeforeId?: string; hasMore: boolean } } }>(`/api/conversations/${id}/messages`, { query: { limit: 10 } })
        if (res?.success && res.data) {
          this.messages = res.data.messages || []
          this.olderCursor = res.data.pagination?.nextBeforeId || null
          this.hasMoreOlder = !!res.data.pagination?.hasMore
        }
      } finally {
        this.isLoadingMessages = false
      }
    },
    async loadOlderMessages() {
      if (!this.selectedId || !this.hasMoreOlder || this.isLoadingMessages) return
      this.isLoadingMessages = true
      try {
        const res = await $fetch<{ success: boolean; data?: { messages: Message[]; pagination: { nextBeforeId?: string; hasMore: boolean } } }>(`/api/conversations/${this.selectedId}/messages`, { query: { limit: 10, beforeId: this.olderCursor || undefined } })
        if (res?.success && res.data) {
          const older = res.data.messages || []
          this.messages = [...older, ...this.messages]
          this.olderCursor = res.data.pagination?.nextBeforeId || null
          this.hasMoreOlder = !!res.data.pagination?.hasMore
        }
      } finally {
        this.isLoadingMessages = false
      }
    },
    appendMessage(msg: Message) {
      if (!this.messages.some(m => m.id === msg.id)) this.messages.push(msg)
    },
    applyMessageUpdate(updated: Message) {
      const idx = this.messages.findIndex(m => m.id === updated.id)
      if (idx !== -1) this.messages[idx] = { ...this.messages[idx], ...updated }
    },
    applyMessageDelete(messageId: string) {
      const idx = this.messages.findIndex(m => m.id === messageId)
      if (idx !== -1) this.messages.splice(idx, 1)
    },
    promoteConversation(conversationId: string, message: Message) {
      const idx = this.conversations.findIndex(c => c.id === conversationId)
      if (idx !== -1) {
        const updated = { ...this.conversations[idx], lastMessage: message, lastMessageAt: message.createdAt, updatedAt: message.createdAt }
        this.conversations.splice(idx, 1)
        this.conversations.unshift(updated as Conversation)
      }
    },
    updatePresence(userId: string, isOnline: boolean, lastActiveAt?: string) {
      this.conversations = this.conversations.map((c: Conversation) => {
        if (!c?.participants?.length) return c
        const pIdx = c.participants.findIndex((p) => p?.user?.id === userId)
        if (pIdx === -1) return c
        const cloned = { ...c, participants: c.participants.slice() }
        const base = cloned.participants[pIdx]!
        const participant = { id: base.id, role: base.role, user: { ...base.user } }
        participant.user.isOnline = !!isOnline
        if (lastActiveAt) participant.user.lastActiveAt = lastActiveAt
        cloned.participants[pIdx] = participant
        return cloned as Conversation
      })
    },
    async reactToMessage(conversationId: string, messageId: string, reaction: string, action: ReactionAction = 'add') {
      await $fetch(`/api/conversations/${conversationId}/messages/${messageId}/reactions`, {
        method: 'POST',
        body: { reaction, action }
      })
    },
    async editMessage(conversationId: string, messageId: string, content: string) {
      const res = await $fetch<{ success: boolean; data?: { message: Message } }>(`/api/conversations/${conversationId}/messages/${messageId}`, {
        method: 'PATCH',
        body: { content }
      })
      return res
    },
    async deleteMessage(conversationId: string, messageId: string) {
      await $fetch<ApiResponse<unknown>>(`/api/conversations/${conversationId}/messages/${messageId}`, { method: 'DELETE' })
    },
    async updateConversation(conversationId: string, payload: Partial<{ name: string; description: string; avatar: string; isMuted: boolean; isArchived: boolean }>) {
      return await $fetch<ApiResponse<{ conversation: Conversation }>>(`/api/conversations/${conversationId}`, { method: 'PATCH', body: payload })
    },
    async addParticipants(conversationId: string, userIds: string[]) {
      return await $fetch<ApiResponse<unknown>>(`/api/conversations/${conversationId}/participants`, { method: 'POST', body: { userIds } })
    },
    async removeParticipant(conversationId: string, participantId: string) {
      return await $fetch<ApiResponse<unknown>>(`/api/conversations/${conversationId}/participants/${participantId}`, { method: 'DELETE' })
    },
    async updateParticipantRole(conversationId: string, participantId: string, role: ParticipantRole) {
      return await $fetch<ApiResponse<unknown>>(`/api/conversations/${conversationId}/participants/${participantId}`, { method: 'PATCH', body: { role } })
    },
    async createGroup(name: string, userIds: string[]) {
      const res = await $fetch<{ success: boolean; data?: { conversation: Conversation } }>(`/api/conversations`, { method: 'POST', body: { participantIds: userIds, isGroup: true, name } })
      if (res?.success && res.data?.conversation) this.conversations.unshift(res.data.conversation)
      return res
    },
  async sendMessage(conversationId: string, content: string | undefined, attachments: string[], messageType: string, replyToId?: string) {
      this.isSending = true
      try {
        const res = await $fetch<{ success: boolean; data?: { message: Message } }>(`/api/conversations/${conversationId}/messages`, {
          method: 'POST',
      body: { content, attachments, messageType, ...(replyToId ? { replyToId } : {}) }
        })
        return res
      } finally {
        this.isSending = false
      }
    },
    async createConversation(participantId: string) {
      const res = await $fetch<{ success: boolean; data?: { conversation: Conversation } }>('/api/conversations', { method: 'POST', body: { participantIds: [participantId], isGroup: false } })
      if (res?.success && res.data) this.conversations.unshift(res.data.conversation)
      return res
    }
  }
})
