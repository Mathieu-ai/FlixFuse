import { prisma } from '../../utils/database'
import { verifyEmailSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    
    // Validate request body
    const validation = verifyEmailSchema.safeParse(body)
    if (!validation.success) {
      setResponseStatus(event, 400)
      return createValidationErrorResponse(formatValidationErrors(validation.error))
    }

    const { token } = validation.data

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: { 
        emailVerificationToken: token,
        isEmailVerified: false
      }
    })

    if (!user) {
      setResponseStatus(event, 400)
      return createErrorResponse(
        'Invalid or expired verification token',
        'INVALID_TOKEN'
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        status: 'ACTIVE' // Activate account upon email verification
      }
    })

    return createSuccessResponse({
      message: 'Email verified successfully! Your account is now active.'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred during email verification. Please try again.',
      'VERIFICATION_ERROR'
    )
  }
})
