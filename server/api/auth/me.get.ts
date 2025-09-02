import { requireAuth } from '../../utils/auth.middleware'
import { createSuccessResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  // Require authentication
  const user = await requireAuth(event)

  return createSuccessResponse({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
  isPhoneVerified: user.isPhoneVerified
    }
  })
})
