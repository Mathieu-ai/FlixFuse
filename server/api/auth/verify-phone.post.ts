import { prisma } from '../../utils/database'
import { verifyPhoneSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'
import { requireAuth } from '../../utils/auth.middleware'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Require authentication to verify phone
    const currentUser = await requireAuth(event)
    
    const body = await readBody(event)
    
    // Validate request body
    const validation = verifyPhoneSchema.safeParse(body)
    if (!validation.success) {
      setResponseStatus(event, 400)
      return createValidationErrorResponse(formatValidationErrors(validation.error))
    }

    const { code } = validation.data

    // Find user with this verification code
    const user = await prisma.user.findFirst({
      where: { 
        id: currentUser.id,
        phoneVerificationToken: code,
        isPhoneVerified: false
      }
    })

    if (!user) {
      setResponseStatus(event, 400)
      return createErrorResponse(
        'Invalid or expired verification code',
        'INVALID_CODE'
      )
    }

    // Update user as phone verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        phoneVerificationToken: null,
        status: 'ACTIVE' // Activate account upon phone verification
      }
    })

    return createSuccessResponse({
      message: 'Phone verified successfully! Your account is now active.'
    })

  } catch (error) {
    console.error('Phone verification error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred during phone verification. Please try again.',
      'VERIFICATION_ERROR'
    )
  }
})
