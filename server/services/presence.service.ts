import { prisma } from '../utils/database'
import { getRedis, getRedisPub, CHANNELS } from '../utils/redis'

const redis = getRedis()
const pub = getRedisPub()

function key(userId: string) { return `presence:count:${userId}` }

export const presence = {
  async count(userId: string) {
    const v = await redis.get(key(userId))
    return Number(v || 0)
  },
  async connect(userId: string) {
    const next = await redis.incr(key(userId))
    if (next === 1) {
      await prisma.$executeRawUnsafe(
        'UPDATE "users" SET "isOnline" = true, "lastActiveAt" = NOW() WHERE "id" = $1',
        userId
      )
      // Broadcast presence change across instances
      await pub.publish(CHANNELS.PresenceUpdates, JSON.stringify({ userId, isOnline: true, ts: Date.now() }))
      return { cameOnline: true, count: next }
    }
    return { cameOnline: false, count: next }
  },
  async disconnect(userId: string) {
    // Use Lua to avoid negative values
    const script = `
      local k = KEYS[1]
      local v = tonumber(redis.call('GET', k) or '0')
      if v <= 1 then
        redis.call('DEL', k)
        return 0
      else
        return redis.call('DECR', k)
      end
    `
    const next = Number(await redis.eval(script, 1, key(userId)))
    if (next === 0) {
      await prisma.$executeRawUnsafe(
        'UPDATE "users" SET "isOnline" = false, "lastActiveAt" = NOW() WHERE "id" = $1',
        userId
      )
      await pub.publish(CHANNELS.PresenceUpdates, JSON.stringify({ userId, isOnline: false, ts: Date.now() }))
      return { wentOffline: true, count: next }
    }
    return { wentOffline: false, count: next }
  }
}
