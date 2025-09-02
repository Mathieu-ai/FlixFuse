import { createSuccessResponse } from '../../utils/response'
import { clearAuthCookies } from '../../utils/cookies'
import { getCookie } from 'h3'
import { revokeRefreshToken } from '../../services/auth.service'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }
  const rt = getCookie(event, 'refresh_token')
  if (rt) {
    try { await revokeRefreshToken(rt) } catch { /* ignore */ }
  }
  clearAuthCookies(event)
  return createSuccessResponse({ ok: true })
})
