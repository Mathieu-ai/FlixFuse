import Redis from 'ioredis'

let client: Redis | null = null
let pub: Redis | null = null
let sub: Redis | null = null

function createClient() {
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  const instance = new Redis(url, {
    // maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
  })
  instance.on('error', (err: unknown) => {
    console.error('[redis] error', (err as Error)?.message)
  })
  return instance
}

export function getRedis() {
  if (!client) client = createClient()
  return client
}

export function getRedisPub() {
  if (!pub) pub = createClient()
  return pub
}

export function getRedisSub() {
  if (!sub) sub = createClient()
  return sub
}

export const CHANNELS = {
  PresenceUpdates: 'presence:updates',
  WsBroadcast: 'ws:broadcast'
}
