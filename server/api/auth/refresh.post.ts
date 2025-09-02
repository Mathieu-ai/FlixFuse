import { getCookie } from 'h3'
import { createErrorResponse, createSuccessResponse } from '../../utils/response'
import { isRefreshTokenValid, generateTokens, revokeRefreshToken, storeRefreshToken } from '../../services/auth.service'
import { setAuthCookies } from '../../utils/cookies'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const refresh = getCookie(event, 'refresh_token')
  if (!refresh) {
    setResponseStatus(event, 401)
    return createErrorResponse('Missing refresh token', 'NO_REFRESH')
  }

  const payload = await isRefreshTokenValid(refresh)
  if (!payload?.userId) {
    setResponseStatus(event, 401)
    return createErrorResponse('Invalid refresh token', 'INVALID_REFRESH')
  }

  // Rotate: revoke old token, issue new, store new
  await revokeRefreshToken(refresh)
  const tokens = generateTokens(payload.userId)
  await storeRefreshToken(tokens.refreshToken)
  setAuthCookies(event, tokens)
  return createSuccessResponse({ ok: true })
})
