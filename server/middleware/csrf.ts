import { getCookie, setCookie } from 'h3'
import crypto from 'crypto'

export default defineEventHandler((event) => {
  // Issue a CSRF token cookie if not present
  const existing = getCookie(event, 'csrf_token')
  if (!existing) {
    const token = crypto.randomBytes(24).toString('hex')
    setCookie(event, 'csrf_token', token, {
      httpOnly: false, // must be readable by client to send header
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
  }
})
