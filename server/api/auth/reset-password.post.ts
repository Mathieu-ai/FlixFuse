import { prisma } from '../../utils/database'
import { resetPasswordConfirmSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'
import { hashPassword } from '../../services/auth.service'

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
    const validation = resetPasswordConfirmSchema.safeParse(body)
    if (!validation.success) {
      setResponseStatus(event, 400)
      return createValidationErrorResponse(formatValidationErrors(validation.error))
    }

    const { token, newPassword } = validation.data

    // Find user with this reset token that hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      setResponseStatus(event, 400)
      return createErrorResponse(
        'Invalid or expired reset token',
        'INVALID_TOKEN'
      )
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    return createSuccessResponse({
      message: 'Password reset successfully. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred resetting your password. Please try again.',
      'RESET_ERROR'
    )
  }
})
