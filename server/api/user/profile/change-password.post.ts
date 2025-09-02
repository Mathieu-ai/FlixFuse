import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { changePasswordSchema, formatValidationErrors } from '../../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../../utils/response'
import { comparePassword, hashPassword } from '../../../services/auth.service'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  // Require authentication
  const user = await requireAuth(event)

  try {
    const body = await readBody(event)
    
    // Validate request body
    const validation = changePasswordSchema.safeParse(body)
    if (!validation.success) {
      setResponseStatus(event, 400)
      return createValidationErrorResponse(formatValidationErrors(validation.error))
    }

    const { currentPassword, newPassword } = validation.data

    // Get user's current password hash
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true }
    })

    if (!userWithPassword) {
      setResponseStatus(event, 404)
      return createErrorResponse('User not found', 'USER_NOT_FOUND')
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, userWithPassword.passwordHash)
    if (!isCurrentPasswordValid) {
      setResponseStatus(event, 400)
      return createErrorResponse('Current password is incorrect', 'INVALID_CURRENT_PASSWORD')
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    })

    return createSuccessResponse({
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Password change error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse(
      'An error occurred changing your password. Please try again.',
      'PASSWORD_CHANGE_ERROR'
    )
  }
})
