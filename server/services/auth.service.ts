import crypto from 'crypto'
import type { AuthTokens } from '../types/api'
import { getRedis } from '../utils/redis'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err: Error | null, derivedKey: Buffer) => {
      if (err) reject(err)
      else resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':')
  if (!salt || !key) return false
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err: Error | null, derivedKey: Buffer) => {
      if (err) reject(err)
      else resolve(key === derivedKey.toString('hex'))
    })
  })
}

export function generateTokens(userId: string): AuthTokens {
  // Simple JWT implementation for demo - use proper JWT library in production
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const accessPayload = Buffer.from(JSON.stringify({ 
    userId, 
    type: 'access', 
    exp: Math.floor(Date.now() / 1000) + 900 // 15 minutes
  })).toString('base64url')
  
  const refreshPayload = Buffer.from(JSON.stringify({ 
    userId, 
    type: 'refresh', 
    exp: Math.floor(Date.now() / 1000) + 604800 // 7 days
  })).toString('base64url')

  const accessSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${accessPayload}`)
    .digest('base64url')
    
  const refreshSignature = crypto
    .createHmac('sha256', JWT_REFRESH_SECRET)
    .update(`${header}.${refreshPayload}`)
    .digest('base64url')

  return {
    accessToken: `${header}.${accessPayload}.${accessSignature}`,
    refreshToken: `${header}.${refreshPayload}.${refreshSignature}`,
    expiresIn: 900
  }
}

export function verifyToken(token: string, type: 'access' | 'refresh' = 'access'): { userId: string } | null {
  try {
    const [header, payload, signature] = token.split('.')
    if (!header || !payload || !signature) return null

    const secret = type === 'access' ? JWT_SECRET : JWT_REFRESH_SECRET
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url')

    if (signature !== expectedSignature) return null

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString())
    
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) return null
    if (decodedPayload.type !== type) return null

    return { userId: decodedPayload.userId }
  } catch {
    return null
  }
}

// Refresh token storage/rotation (Redis)
const redis = getRedis()
function refreshKey(userId: string, tokenId: string) { return `auth:rt:${userId}:${tokenId}` }

export function extractTokenId(refreshToken: string): string | null {
  try {
    const parts = refreshToken.split('.')
    if (parts.length < 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    // Derive a token identifier from signature to avoid storing raw token
    const id = crypto.createHash('sha256').update(parts[2]).digest('hex')
    if (!payload?.userId) return null
    return `${payload.userId}:${id}`
  } catch {
    return null
  }
}

export async function storeRefreshToken(refreshToken: string) {
  const id = extractTokenId(refreshToken)
  if (!id) return
  const [userId, tokenId] = id.split(':')
  const key = refreshKey(userId, tokenId)
  // 7 days TTL
  await redis.set(key, '1', 'EX', 60 * 60 * 24 * 7)
}

export async function revokeRefreshToken(refreshToken: string) {
  const id = extractTokenId(refreshToken)
  if (!id) return
  const [userId, tokenId] = id.split(':')
  await redis.del(refreshKey(userId, tokenId))
}

export async function isRefreshTokenValid(refreshToken: string): Promise<{ userId: string } | null> {
  try {
    const payload = verifyToken(refreshToken, 'refresh')
    if (!payload?.userId) return null
    const parts = refreshToken.split('.')
    const tokenId = crypto.createHash('sha256').update(parts[2]).digest('hex')
    const exists = await redis.get(refreshKey(payload.userId, tokenId))
    return exists ? { userId: payload.userId } : null
  } catch {
    return null
  }
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function verifyEmailVerificationToken(token: string): Promise<boolean> {
  // In a real app, you'd verify this against your database
  // For now, we'll just check if it's a valid hex string
  return /^[a-f0-9]{64}$/.test(token)
}

export async function verifyPasswordResetToken(token: string): Promise<boolean> {
  // In a real app, you'd verify this against your database and check expiration
  // For now, we'll just check if it's a valid hex string
  return /^[a-f0-9]{64}$/.test(token)
}
