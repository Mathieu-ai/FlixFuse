import type { Peer } from 'crossws'
import { verifyToken } from '../services/auth.service'
import { presence } from '../services/presence.service'
import { getRedisSub, CHANNELS, getRedis } from '../utils/redis'

// Ensure a single Redis subscription for presence updates across HMR reloads
declare global { var __presenceSubReady: boolean | undefined }
if (!globalThis.__presenceSubReady) {
  try {
    const sub = getRedisSub()
    sub.subscribe(CHANNELS.PresenceUpdates)
    sub.subscribe(CHANNELS.WsBroadcast)
    sub.on('message', (channel: string, msg: string) => {
      try {
        if (channel === CHANNELS.PresenceUpdates) {
          const data = JSON.parse(msg)
          const payload = {
            type: 'presence.update',
            userId: data.userId as string,
            isOnline: !!data.isOnline,
            lastActiveAt: new Date().toISOString()
          }
          const msgStr = JSON.stringify(payload)
          for (const p of activePeers) {
            try { p.publish('presence', msgStr); p.publish(`user:${payload.userId}:presence`, msgStr) } catch { /* ignore */ }
          }
        } else if (channel === CHANNELS.WsBroadcast) {
          const parsed = JSON.parse(msg) as { topic: string; payload: unknown }
          const msgStr = JSON.stringify(parsed.payload ?? {})
          for (const p of activePeers) {
            try { p.publish(parsed.topic, msgStr) } catch { /* ignore */ }
          }
        }
      } catch {
        // ignore parse errors
      }
    })
    globalThis.__presenceSubReady = true
  } catch {
    // ignore subscription errors
  }
}

// Track active peers and publish via all connected ones (safer than a single arbitrary peer)
const activePeers = new Set<Peer>()
const peerUserMap = new Map<Peer, string>()
export function wsPublish(topic: string, payload: unknown) {
  try {
  if (!topic) return
    const msg = JSON.stringify(payload ?? {})
    // Publish via all peers to ensure delivery regardless of which peer initiated the publish
    for (const p of activePeers) {
      try { p.publish(topic, msg) } catch { /* ignore individual peer errors */ }
    }
    // Also publish on Redis so other instances can mirror
    try {
      const redis = getRedis()
      redis.publish(CHANNELS.WsBroadcast, JSON.stringify({ topic, payload }))
    } catch { /* ignore redis publish errors */ }
  } catch {
    // noop
  }
}

type Incoming =
  | { type: 'subscribe'; topic: string }
  | { type: 'unsubscribe'; topic: string }
  | { type: 'message'; topic: string; payload: unknown }
  | { type: 'auth'; token: string }
  | { type: 'ping' }

export default defineWebSocketHandler({
  message(peer: Peer, message) {
    try {
      const msgStr = typeof message === 'string' ? message : String(message)
      const data = JSON.parse(msgStr) as Incoming

      switch (data.type) {
        case 'auth': {
          if (!data.token) break
          const payload = verifyToken(data.token, 'access')
          const userId = payload?.userId as string | undefined
          if (userId) {
            peerUserMap.set(peer, userId)
            presence.connect(userId).catch(() => {})
          }
          break
        }
        case 'subscribe':
          if (data.topic) peer.subscribe(data.topic)
          break
        case 'unsubscribe':
          if (data.topic) peer.unsubscribe(data.topic)
          break
        case 'message':
          if (data.topic) peer.publish(data.topic, JSON.stringify(data.payload ?? {}))
          break
        case 'ping':
          peer.send(JSON.stringify({ type: 'pong' }))
          break
        default:
          // Fallback broadcast to 'chat' for plain strings
          peer.publish('chat', msgStr)
      }
    } catch {
      // Non-JSON message: broadcast to default topic
      const msgStr = typeof message === 'string' ? message : String(message)
      peer.publish('chat', msgStr)
    }
  },

  open(peer: Peer) {
    // Default room for simple tests
    peer.subscribe('chat')
  // Register peer for cross-module publish
  activePeers.add(peer)
    // Authenticate peer via Authorization header for presence
  try {
      // @ts-expect-error headers is available on peer in Nitro crossws
      const authHeader: string | undefined = peer?.headers?.authorization || peer?.headers?.Authorization
      // @ts-expect-error cookies is available on peer in Nitro crossws
      const cookieHeader: string | undefined = peer?.headers?.cookie
      const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
      const cookieToken = (() => {
        try {
          if (!cookieHeader) return undefined
          // Parse access_token from cookie string
          const parts = cookieHeader.split(/;\s*/)
          for (const p of parts) {
            const [k, v] = p.split('=')
            if (k === 'access_token' && v) return decodeURIComponent(v)
          }
        } catch {
          // ignore cookie parse errors
        }
        return undefined
      })()
      const token = bearer || cookieToken
      const payload = token ? verifyToken(token, 'access') : null
      const userId = payload?.userId as string | undefined
      if (userId) {
        peerUserMap.set(peer, userId)
        presence.connect(userId).catch(() => {})
      }
  } catch {
      // ignore auth errors on ws open
    }
  },

  close(_peer: Peer) {
    // Remove from active peers
    if (activePeers.has(_peer)) activePeers.delete(_peer)
    // Mark user offline and update lastActiveAt
  const userId = peerUserMap.get(_peer)
  if (userId) peerUserMap.delete(_peer)
    if (userId) {
      presence.disconnect(userId).catch(() => {})
    }
  },

  error(_peer: Peer, _error) {
    // noop
  }
})