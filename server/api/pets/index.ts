import { requireAuth } from '../../utils/auth.middleware'
import { prisma } from '../../utils/database'
import { createPetSchema, formatValidationErrors } from '../../utils/validation'
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '../../utils/response'
import type { CreatePetDto } from '../../types/dtos'

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

  if (getMethod(event) === 'GET') {
    try {
      // Get user's pets with optional filtering
      const query = getQuery(event)
      const includeInactive = query.includeInactive === 'true'
      
      const pets = await prisma.pet.findMany({
        where: { 
          ownerId: user.id,
          ...(includeInactive ? {} : { isActive: true })
        },
        select: SAFE_PET_SELECT,
        orderBy: { createdAt: 'desc' },
        cacheStrategy: { ttl: 60 } // Cache for 60 seconds
      })

      return createSuccessResponse({
        pets,
        total: pets.length,
        message: `Found ${pets.length} pet${pets.length !== 1 ? 's' : ''}`
      })
    } catch (error) {
      console.error('Pets fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching your pets. Please try again.',
        'PETS_FETCH_ERROR'
      )
    }
  }

  if (getMethod(event) === 'POST') {
    try {
      const body = await readBody(event)
      
      // Validate request body
      const validation = createPetSchema.safeParse(body)
      if (!validation.success) {
        setResponseStatus(event, 400)
        return createValidationErrorResponse(formatValidationErrors(validation.error))
      }

      const petData = validation.data as CreatePetDto

      // Set default values
      const processedData = {
        ...petData,
        ownerId: user.id,
        isActive: true,
        isPublic: petData.isPublic ?? true,
        mixedBreed: petData.mixedBreed ?? false,
        isNeutered: petData.isNeutered ?? false,
        isVaccinated: petData.isVaccinated ?? false,
        pedigree: petData.pedigree ?? false,
        isLost: false,
        ageUnit: petData.ageUnit ?? 'YEARS',
        weightUnit: petData.weightUnit ?? 'kg',
        photos: petData.photos ?? [],
        videos: petData.videos ?? [],
        personalityTraits: petData.personalityTraits ?? [],
        behaviorTraits: petData.behaviorTraits ?? [],
        allergies: petData.allergies ?? [],
        medicalConditions: petData.medicalConditions ?? [],
        medications: petData.medications ?? [],
        dietaryRestrictions: petData.dietaryRestrictions ?? [],
        playStyle: petData.playStyle ?? [],
        favoriteActivities: petData.favoriteActivities ?? [],
        fearsTriggers: petData.fearsTriggers ?? []
      }

      // Handle date fields - convert to Date objects for Prisma
      const petDataForDb = { ...processedData }
      if (petDataForDb.lastVetVisit) {
        petDataForDb.lastVetVisit = new Date(petDataForDb.lastVetVisit).toISOString()
      }
      if (petDataForDb.nextVetVisit) {
        petDataForDb.nextVetVisit = new Date(petDataForDb.nextVetVisit).toISOString()
      }

      // Create pet
      const pet = await prisma.pet.create({
        data: petDataForDb,
        select: SAFE_PET_SELECT
      })

      setResponseStatus(event, 201)
      return createSuccessResponse({
        pet,
        message: 'Pet profile created successfully'
      })

    } catch (error) {
      console.error('Pet creation error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred creating the pet profile. Please try again.',
        'PET_CREATION_ERROR'
      )
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
