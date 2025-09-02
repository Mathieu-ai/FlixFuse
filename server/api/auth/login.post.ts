import { prisma } from '../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../utils/response'
import { comparePassword, generateTokens, storeRefreshToken } from '../../services/auth.service'
import { setAuthCookies } from '../../utils/cookies'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }
  // CSRF check: require header to match cookie on state-changing requests
  const csrfHeader = getHeader(event, 'x-csrf-token')
  const csrfCookie = getCookie(event, 'csrf_token')
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    setResponseStatus(event, 403)
    return createErrorResponse('Invalid CSRF token', 'CSRF_INVALID')
  }

  try {
    const body = await readBody(event)
    // Accept client-validated data; only minimal presence checks
    const { identifier, password } = body as { identifier?: string; password?: string }
    if (!identifier || !password) {
      setResponseStatus(event, 400)
      return createErrorResponse('Missing credentials')
    }

    // Find user by email or phone number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNumber: identifier }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        profilePicture: true,
        phoneNumber: true,
        passwordHash: true,
        role: true,
        status: true,
        isEmailVerified: true,
  isPhoneVerified: true,
  lastLoginAt: true
      }
    })

    if (!user) {
      setResponseStatus(event, 401)
      return createErrorResponse(
        'Invalid email or password',
        'INVALID_CREDENTIALS'
      )
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      setResponseStatus(event, 401)
      return createErrorResponse(
        'Invalid email or password',
        'INVALID_CREDENTIALS'
      )
    }

    // Check account status
    if (user.status === 'BANNED') {
      setResponseStatus(event, 403)
      return createErrorResponse(
        'Your account has been banned. Please contact support.',
        'ACCOUNT_BANNED'
      )
    }

    if (user.status === 'SUSPENDED') {
      setResponseStatus(event, 403)
      return createErrorResponse(
        'Your account has been suspended. Please contact support.',
        'ACCOUNT_SUSPENDED'
      )
    }

    if (user.status === 'PENDING_VERIFICATION') {
      setResponseStatus(event, 403)
      return createErrorResponse(
        'Your account requires verification. Please check your email or phone for verification instructions.',
        'VERIFICATION_REQUIRED'
      )
    }

    // Update last login
  await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
    lastActiveAt: new Date()
      }
    })

    // Generate auth tokens
  const tokens = generateTokens(user.id)
  await storeRefreshToken(tokens.refreshToken)
  setAuthCookies(event, tokens)

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user

    return createSuccessResponse({
  user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred during login. Please try again.',
      'LOGIN_ERROR'
    )
  }
})
