import { verifyToken } from '../services/auth.service'
import { prisma } from '../utils/database'
import type { H3Event } from 'h3'
import { getCookie } from 'h3'

export async function requireAuth(event: H3Event) {
  // Prefer secure HTTP-only cookie for auth
  const token = getCookie(event, 'access_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const tokenData = verifyToken(token, 'access')
  
  if (!tokenData) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }

  // Get user from database and attach to context
  const user = await prisma.user.findUnique({
    where: { id: tokenData.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      displayName: true,
      profilePicture: true,
      phoneNumber: true,
      role: true,
      status: true,
      isEmailVerified: true,
      isPhoneVerified: true
    },
    cacheStrategy: { ttl: 30 } // Cache for 30 seconds
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  if (user.status !== 'ACTIVE') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Account is not active'
    })
  }

  // Attach user to event context
  event.context.user = user
  
  return user
}

export async function optionalAuth(event: H3Event) {
  try {
    return await requireAuth(event)
  } catch {
    // If auth fails, just continue without user context
    return null
  }
}

export function requireEmailVerified(event: H3Event) {
  const user = event.context.user
  
  if (!user?.isEmailVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Email verification required'
    })
  }
}

export function requireRole(roles: string | string[]) {
  return (event: H3Event) => {
    const user = event.context.user
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    
    if (!user || !allowedRoles.includes(user.role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions'
      })
    }
  }
}
