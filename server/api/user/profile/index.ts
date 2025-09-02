import { requireAuth } from '../../../utils/auth.middleware'
import { prisma } from '../../../utils/database'
import { updateUserProfileSchema, formatValidationErrors } from '../../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../../utils/response'
import type { Prisma } from '@prisma/client'

// Safe user profile fields that can be returned to the client
const SAFE_USER_PROFILE_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  bio: true,
  profilePicture: true,
  phoneNumber: true,
  whatsappNumber: true,
  dateOfBirth: true,
  gender: true,
  location: true,
  timeZone: true,
  language: true,
  interests: true,
  personalityTraits: true,
  experienceLevel: true,
  walkPreferences: true,
  availability: true,
  privacySettings: true,
  notificationSettings: true,
  communicationPreferences: true,
  theme: true,
  units: true,
  // Read-only fields
  points: true,
  level: true,
  totalWalks: true,
  totalDistanceKm: true,
  joinDate: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  role: true,
  status: true,
  lastActiveAt: true,
  updatedAt: true
} as const

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)

  if (getMethod(event) === 'GET') {
    try {
      // Get user profile with safe fields only
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: SAFE_USER_PROFILE_SELECT
      })

      if (!userProfile) {
        setResponseStatus(event, 404)
        return createErrorResponse('User profile not found', 'USER_NOT_FOUND')
      }

      return createSuccessResponse(userProfile)
    } catch (error) {
      console.error('Profile fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching your profile. Please try again.',
        'PROFILE_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'PUT') {
    try {
      const body = await readBody(event)

      // Validate request body
      const validation = updateUserProfileSchema.safeParse(body)
      if (!validation.success) {
        setResponseStatus(event, 400)
        return createValidationErrorResponse(formatValidationErrors(validation.error))
      }

      const updateData = validation.data

      // Convert null values to Prisma's DbNull for JSON fields
      const processedData = { ...updateData }

      // Handle JSON fields that can be null
      const jsonFields = ['location', 'walkPreferences', 'availability', 'privacySettings', 'notificationSettings', 'communicationPreferences']
      for (const field of jsonFields) {
        if (processedData[field as keyof typeof processedData] === null) {
          processedData[field as keyof typeof processedData] = undefined
        }
      }

      // Convert dateOfBirth string to Date if provided
      if (processedData.dateOfBirth && typeof processedData.dateOfBirth === 'string') {
        processedData.dateOfBirth = new Date(processedData.dateOfBirth).toISOString()
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: processedData as Prisma.UserUpdateInput,
        select: SAFE_USER_PROFILE_SELECT
      })

      return createSuccessResponse({
        user: updatedUser,
        message: 'Profile updated successfully'
      })

    } catch (error) {
      console.error('Profile update error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred updating your profile. Please try again.',
        'PROFILE_UPDATE_ERROR'
      )
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
