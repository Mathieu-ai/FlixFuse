import { defineStore } from 'pinia'

type WSMessage = unknown

export const useWsStore = defineStore('ws', {
  state: () => ({
    socket: null as WebSocket | null,
    isOnline: true,
    isReconnecting: false,
    subscribed: new Set<string>(),
    currentTopic: null as string | null,
    reconnectTimer: null as number | null,
    reconnectAttempts: 0,
    heartbeatTimer: null as number | null
  }),
  actions: {
    connect(onMessage?: (msg: WSMessage) => void) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) return
      try {
        const wsUrl = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/_ws'
        const socket = new WebSocket(wsUrl)
        this.socket = socket

        socket.onopen = () => {
          this.reconnectAttempts = 0
          if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null }
          if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null }
          this.heartbeatTimer = window.setInterval(() => {
            try {
              if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'ping' }))
              }
            } catch {
              // ignore
            }
          }, 25000) as unknown as number
          this.isOnline = true
          const wasReconnecting = this.isReconnecting
          this.isReconnecting = false
          if (wasReconnecting) {
            useToast().add({ title: 'Connected', description: 'Real-time connection restored', color: 'success' })
          }
          // resubscribe
          for (const t of this.subscribed) {
            try { this.socket!.send(JSON.stringify({ type: 'subscribe', topic: t })) } catch { /* ignore */ }
          }
        }

        socket.onmessage = (ev) => {
          try {
            const parsed = JSON.parse((ev as MessageEvent).data)
            if (onMessage) onMessage(parsed)
          } catch {
            // ignore non-JSON
          }
        }

        const onDown = () => {
          if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null }
          if (this.isOnline) {
            this.isOnline = false
            this.isReconnecting = true
            useToast().add({ title: 'Reconnecting…', description: 'Trying to restore real-time connection', color: 'warning' })
          }
          this.scheduleReconnect(onMessage)
        }
        socket.onclose = onDown
        socket.onerror = onDown
      } catch (e) {
        console.error('WS connect error', e)
      }
    },
    scheduleReconnect(onMessage?: (msg: WSMessage) => void) {
      if (this.reconnectTimer) return
      const delay = Math.min(30000, 1000 * Math.pow(2, Math.min(this.reconnectAttempts, 5)))
  this.reconnectTimer = window.setTimeout(() => {
        this.reconnectTimer = null
        this.reconnectAttempts += 1
        this.connect(onMessage)
  }, delay) as unknown as number
    },
    subscribe(topic: string) {
      this.subscribed.add(topic)
      if (this.socket?.readyState === WebSocket.OPEN) {
        try { this.socket!.send(JSON.stringify({ type: 'subscribe', topic })) } catch { /* ignore */ }
      }
    },
    unsubscribe(topic: string) {
      if (this.subscribed.has(topic)) this.subscribed.delete(topic)
      if (this.socket?.readyState === WebSocket.OPEN) {
        try { this.socket!.send(JSON.stringify({ type: 'unsubscribe', topic })) } catch { /* ignore */ }
      }
    },
    setCurrentTopic(topic: string | null) {
      this.currentTopic = topic
      if (topic) this.subscribe(topic)
    },
    publish(topic: string, payload: unknown) {
      if (this.socket?.readyState === WebSocket.OPEN) {
        try { this.socket!.send(JSON.stringify({ type: 'message', topic, payload })) } catch { /* ignore */ }
      }
    },
    teardown() {
      try {
        if (this.socket && this.subscribed.size) {
          for (const t of this.subscribed) {
            try { this.socket.send(JSON.stringify({ type: 'unsubscribe', topic: t })) } catch { /* ignore */ }
          }
        }
        this.subscribed.clear()
        this.currentTopic = null
        if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.close()
      } catch {
        // ignore
      }
      if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null }
      if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null }
      this.socket = null
      this.isOnline = false
      this.isReconnecting = false
    }
  }
})
