import { getRedis } from '../../utils/redis'

export default defineEventHandler(async (event) => {
  try {
    const redis = getRedis()
    // Lightweight connectivity check: publish a message
    const receivers = await redis.publish('health:ping', 'ok')
    return { success: true, data: { ok: true, receivers } }
  } catch (e) {
    setResponseStatus(event, 500)
    return { success: false, error: { message: (e as Error).message } }
  }
})
