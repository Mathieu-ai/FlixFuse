import { requireAuth } from '../../utils/auth.middleware'
import { prisma } from '../../utils/database'
import { createSuccessResponse, createErrorResponse } from '../../utils/response'

// Safe user fields for discovery
const SAFE_USER_DISCOVERY_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  displayName: true,
  profilePicture: true,
  isOnline: true,
  lastActiveAt: true,
  bio: true,
  location: true,
  interests: true,
  personalityTraits: true,
  experienceLevel: true,
  joinDate: true,
  points: true,
  level: true,
  totalWalks: true,
  pets: {
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      profilePhoto: true,
      age: true,
      ageUnit: true,
      energyLevel: true,
      socialLevel: true,
      personalityTraits: true
    },
    where: {
      isActive: true,
      isPublic: true
    }
  }
} as const

export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)

  if (getMethod(event) === 'GET') {
    try {
      const query = getQuery(event)
      const page = parseInt(query.page as string) || 1
      const limit = Math.min(parseInt(query.limit as string) || 20, 50)
      const skip = (page - 1) * limit

      // Filters
      const species = query.species as string
      const experienceLevel = query.experienceLevel as string
      const interests = query.interests ? (query.interests as string).split(',') : []
      const neighborhood = query.neighborhood as string
      const maxDistance = parseInt(query.maxDistance as string) || 10

      // Get current user location for distance filtering
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { location: true }
      })

      // const whereClause = {
      //       id: { not: user.id }, // Exclude current user
      //       status: 'ACTIVE' as const,
      //       privacySettings: {
      //         path: ['profileVisibility'],
      //         not: 'PRIVATE'
      //       }
      //     }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const additionalFilters: any = {}

      // Add species filter (looking for users with pets of specific species)
      if (species) {
        additionalFilters.pets = {
          some: {
            species: species,
            isActive: true,
            isPublic: true
          }
        }
      }

      // Add experience level filter
      if (experienceLevel) {
        additionalFilters.experienceLevel = experienceLevel
      }

      // Add interests filter
      if (interests.length > 0) {
        additionalFilters.interests = {
          hasSome: interests
        }
      }

      // Add neighborhood filter
      if (neighborhood) {
        additionalFilters.location = {
          path: ['neighborhood'],
          string_contains: neighborhood
        }
      }

      // Text search across basic identity fields
      const search = (query.search as string | undefined)?.trim()
      if (search && search.length >= 2) {
        additionalFilters.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } }
        ]
      }

      // const finalWhereClause = { ...whereClause, ...additionalFilters }

      // Get nearby members
      const members = await prisma.user.findMany({
        where: {
          firstName: { contains: search, mode: 'insensitive' }
        },
        select: SAFE_USER_DISCOVERY_SELECT,
        skip,
        take: limit
      })
      // Calculate distance and compatibility score for each member
      const membersWithStats = members.map(member => {
        let distance = null
        let compatibilityScore = 0

        // Calculate distance if both users have location
        if (currentUser?.location && member.location) {
          const currentLoc = currentUser.location as { coordinates?: { lat: number; lng: number } }
          const memberLoc = member.location as { coordinates?: { lat: number; lng: number } }

          if (currentLoc.coordinates && memberLoc.coordinates) {
            distance = calculateDistance(
              currentLoc.coordinates.lat,
              currentLoc.coordinates.lng,
              memberLoc.coordinates.lat,
              memberLoc.coordinates.lng
            )
          }
        }

        // Calculate compatibility score based on shared interests
        if (member.interests && currentUser) {
          // For now, we'll use a simple scoring system
          compatibilityScore = 50 // Base score
        }

        // Type assertion to access pets
        const memberWithPets = member as typeof member & { pets: Array<{ id: string; name: string; species: string }> }

        return {
          ...member,
          distance,
          compatibilityScore,
          petsCount: memberWithPets.pets?.length || 0,
        }
      })

      // Filter by distance if specified and location is available
      const filteredMembers = maxDistance && currentUser?.location
        ? membersWithStats.filter(m => m.distance === null || m.distance <= maxDistance)
        : membersWithStats

      return createSuccessResponse({
        members: filteredMembers,
        pagination: {
          page,
          limit,
          hasMore: members.length === limit
        },
        filters: {
          species,
          experienceLevel,
          interests,
          neighborhood,
          maxDistance
        }
      })
    } catch (error) {
      console.error('Members fetch error:', error)
      setResponseStatus(event, 500)
      return createErrorResponse(
        'An error occurred fetching members. Please try again.',
        'MEMBERS_FETCH_ERROR'
      )
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance (lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}
