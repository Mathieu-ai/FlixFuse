import type { Conversation, Message, ParticipantUser } from '~/stores/conversations'

type Participant = { id: string; role: string; user: ParticipantUser }

export function useChatUtils() {
  const authStore = useAuthStore()

  function otherParticipant(conversation: Conversation | null | undefined): Participant | null {
    if (!conversation?.isGroup) {
      return (conversation?.participants || []).find((p: Participant) => p?.user?.id !== authStore.user?.id) || null
    }
    return null
  }

  function conversationName(conversation: Conversation | null | undefined) {
    if (!conversation) return 'Unknown'
    if (conversation.name) return conversation.name
    if (conversation.isGroup) return 'Group Chat'
    const other = otherParticipant(conversation)
    if (other) return other.user.displayName || `${other.user.firstName} ${other.user.lastName || ''}`.trim()
    return 'Unknown'
  }

  function formatTime(dateString?: string) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}m`
    } else if (diffHours < 24) {
      return `${diffHours}h`
    }
    return date.toLocaleDateString()
  }

  function isImage(url: string) { return /\.(png|jpe?g|gif|webp|avif)$/i.test(url) }
  function isVideo(url: string) { return /\.(mp4|webm|mov|m4v|avi)$/i.test(url) }
  function isAudio(url: string) { return /(\.mp3|\.wav|\.ogg|\.m4a|\.aac|\.webm)$/i.test(url) }

  function inferMessageType(files: File[], urls: string[]): 'TEXT'|'IMAGE'|'VIDEO'|'AUDIO'|'FILE'|undefined {
    const types = files.map(f => f.type).concat(urls.map(u => {
      if (isImage(u)) return 'image/'
      if (isVideo(u)) return 'video/'
      if (isAudio(u)) return 'audio/'
      return 'application/octet-stream'
    }))
    if (types.some(t => t.startsWith('audio/'))) return 'AUDIO'
    if (types.some(t => t.startsWith('video/'))) return 'VIDEO'
    if (types.some(t => t.startsWith('image/'))) return 'IMAGE'
    if (types.length) return 'FILE'
    return undefined
  }

  function messagePreview(msg: Message | null | undefined) {
    if (!msg) return ''
    const c = (msg.content || '').trim()
    if (c) return c
    const type = String(msg.messageType || '').toUpperCase()
    if (type === 'IMAGE') return '📷 Photo'
    if (type === 'VIDEO') return '🎬 Video'
    if (type === 'AUDIO') return '🎤 Voice message'
    if (Array.isArray(msg.attachments) && msg.attachments.length) return '📎 Attachment'
    return 'Message'
  }

  return { otherParticipant, conversationName, formatTime, isImage, isVideo, isAudio, inferMessageType, messagePreview }
}
