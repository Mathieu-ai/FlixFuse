import { requireAuth } from '../../utils/auth.middleware'
import { prisma } from '../../utils/database'
import { updatePetSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'
import type { UpdatePetDto } from '../../types/dtos'

// Safe pet fields that can be returned to the client
const SAFE_PET_SELECT = {
  id: true,
  name: true,
  nickname: true,
  species: true,
  breed: true,
  mixedBreed: true,
  secondaryBreed: true,
  age: true,
  ageUnit: true,
  gender: true,
  isNeutered: true,
  weight: true,
  weightUnit: true,
  height: true,
  color: true,
  markings: true,
  microchipId: true,
  photos: true,
  videos: true,
  profilePhoto: true,
  personalityTraits: true,
  behaviorTraits: true,
  energyLevel: true,
  socialLevel: true,
  trainingLevel: true,
  allergies: true,
  medicalConditions: true,
  medications: true,
  specialNeeds: true,
  dietaryRestrictions: true,
  isVaccinated: true,
  lastVetVisit: true,
  nextVetVisit: true,
  compatibility: true,
  playStyle: true,
  favoriteActivities: true,
  fearsTriggers: true,
  feedingSchedule: true,
  exerciseNeeds: true,
  careInstructions: true,
  isActive: true,
  isPublic: true,
  isLost: true,
  lostDetails: true,
  emergencyContact: true,
  registrationNumber: true,
  pedigree: true,
  insuranceInfo: true,
  createdAt: true,
  updatedAt: true
} as const

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)
  const petId = getRouterParam(event, 'id')

  if (!petId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pet ID is required'
    })
  }

  // Check if pet belongs to user
  const existingPet = await prisma.pet.findFirst({
    where: {
      id: petId,
      ownerId: user.id
    }
  })

  if (!existingPet) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pet not found or access denied'
    })
  }

  if (getMethod(event) === 'GET') {
    try {
      // Get individual pet
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
        select: SAFE_PET_SELECT
      })

      if (!pet) {
        setResponseStatus(event, 404)
        return createErrorResponse('Pet not found', 'PET_NOT_FOUND')
      }

      return createSuccessResponse(pet)
    } catch (error) {
      console.error('Pet fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching the pet profile. Please try again.',
        'PET_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'PUT') {
    try {
      const body = await readBody(event)
      
      // Remove id and ownerId from body if present (they shouldn't be updated)
      const { id, ownerId, ...updateData } = body

      // Validate request body
      const validation = updatePetSchema.safeParse({ id: petId, ...updateData })
      if (!validation.success) {
        setResponseStatus(event, 400)
        return createValidationErrorResponse(formatValidationErrors(validation.error))
      }

      // Remove id from the validation data for update
      const { id: validatedId, ...validatedUpdateData } = validation.data as UpdatePetDto & { id: string }

      // Handle date fields - convert to Date objects for Prisma
      const petDataForDb = { ...validatedUpdateData }
      if (petDataForDb.lastVetVisit) {
        petDataForDb.lastVetVisit = new Date(petDataForDb.lastVetVisit).toISOString()
      }
      if (petDataForDb.nextVetVisit) {
        petDataForDb.nextVetVisit = new Date(petDataForDb.nextVetVisit).toISOString()
      }

      // Update pet
      const updatedPet = await prisma.pet.update({
        where: { id: petId },
        data: petDataForDb,
        select: SAFE_PET_SELECT
      })

      return createSuccessResponse({
        pet: updatedPet,
        message: 'Pet profile updated successfully'
      })

    } catch (error) {
      console.error('Pet update error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred updating the pet profile. Please try again.',
        'PET_UPDATE_ERROR'
      )
    }
  }

  if (getMethod(event) === 'DELETE') {
    try {
      // Soft delete - set isActive to false
      await prisma.pet.update({
        where: { id: petId },
        data: { isActive: false }
      })

      return createSuccessResponse({
        message: 'Pet profile deleted successfully'
      })

    } catch (error) {
      console.error('Pet deletion error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred deleting the pet profile. Please try again.',
        'PET_DELETE_ERROR'
      )
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
