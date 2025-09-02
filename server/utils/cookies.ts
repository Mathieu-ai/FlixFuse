import { setCookie, deleteCookie } from 'h3'
import type { H3Event } from 'h3'

export function setAuthCookies(event: H3Event, tokens: { accessToken: string; refreshToken: string; expiresIn: number }) {
  const isProd = process.env.NODE_ENV === 'production'
  setCookie(event, 'access_token', tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: tokens.expiresIn
  })
  setCookie(event, 'refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearAuthCookies(event: H3Event) {
  const opts = { path: '/' }
  try {
    deleteCookie(event, 'access_token', opts)
    deleteCookie(event, 'refresh_token', opts)
  } catch {
    // ignore
  }
}
