import { prisma } from '../../utils/database'
import { resetPasswordSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'
import { generatePasswordResetToken } from '../../services/auth.service'
import { sendPasswordResetEmail } from '../../services/email.service'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  const csrfHeader = getHeader(event, 'x-csrf-token')
  const csrfCookie = getCookie(event, 'csrf_token')
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    setResponseStatus(event, 403)
    return createErrorResponse('Invalid CSRF token', 'CSRF_INVALID')
  }

  try {
    const body = await readBody(event)
    
    // Validate request body
    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      setResponseStatus(event, 400)
      return createValidationErrorResponse(formatValidationErrors(validation.error))
    }

    const { email } = validation.data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we return success
    if (!user) {
      return createSuccessResponse({
        message: 'If an account with this email exists, you will receive a password reset link.'
      })
    }

    // Generate reset token and expiration (1 hour from now)
    const resetToken = generatePasswordResetToken()
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, user.firstName, resetToken)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return createSuccessResponse({
      message: 'If an account with this email exists, you will receive a password reset link.'
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred processing your request. Please try again.',
      'RESET_REQUEST_ERROR'
    )
  }
})
