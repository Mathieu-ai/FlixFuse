import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export interface ChatMessage {
  id: number
  text: string
  isSelf: boolean
}

export const usePlaygroundStore = defineStore('playground', () => {
  const messages: Ref<ChatMessage[]> = ref([])
  const socket: Ref<WebSocket | null> = ref(null)
  const isConnected = ref(false)

  function initSocket() {
    if (socket.value) return 
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${location.host}/_ws`
    socket.value = new WebSocket(wsUrl)

    socket.value.onopen = () => {
      isConnected.value = true
    }
    socket.value.onmessage = (event) => {
      messages.value.push({
        id: Date.now() + Math.random(),
        text: event.data,
        isSelf: false
      })
    }
    socket.value.onclose = () => {
      isConnected.value = false
      socket.value = null
    }
  }

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (socket.value && trimmed) {
      messages.value.push({
        id: Date.now() + Math.random(),
        text: trimmed,
        isSelf: true
      })
      socket.value.send(trimmed)
    }
  }

  function closeSocket() {
    socket.value?.close()
    socket.value = null
    isConnected.value = false
  }

  return {
    messages,
    socket,
    isConnected,
    initSocket,
    sendMessage,
    closeSocket
  }
})
