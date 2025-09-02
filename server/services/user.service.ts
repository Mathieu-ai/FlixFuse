import { prisma } from '../database/client'
import type { 
  CreateUserRequest, 
  UserProfile, 
  CreatePetRequest,
  PaginationQuery,
  LocationQuery 
} from '../types/api'
import { 
  NotFoundError, 
  ConflictError, 
  ValidationError 
} from '../utils/errors'
import { 
  validatePagination, 
  calculateDistance, 
  isValidEmail,
  sanitizeString 
} from '../utils/helpers'
import { hashPassword } from './auth.service'

export async function createUser(data: CreateUserRequest): Promise<UserProfile> {
  if (!isValidEmail(data.email)) {
    throw new ValidationError('Invalid email format')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() }
  })

  if (existingUser) {
    throw new ConflictError('User with this email already exists')
  }

  const passwordHash = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      firstName: sanitizeString(data.firstName),
      lastName: data.lastName ? sanitizeString(data.lastName) : null,
      passwordHash,
      location: data.location,
      role: 'MEMBER',
      status: 'ACTIVE'
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profilePicture: true,
      location: true,
      preferences: true,
      privacySettings: true,
      createdAt: true
    }
  })

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName || undefined,
    profilePicture: user.profilePicture || undefined,
    location: user.location as UserProfile['location'],
    preferences: user.preferences as UserProfile['preferences'],
    privacySettings: user.privacySettings as UserProfile['privacySettings']
  }
}

export async function getUserById(id: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profilePicture: true,
      location: true,
      preferences: true,
      privacySettings: true,
      createdAt: true,
      pets: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          gender: true,
          photos: true
        }
      }
    }
  })

  if (!user) {
    throw new NotFoundError('User')
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName || undefined,
    profilePicture: user.profilePicture || undefined,
    location: user.location as UserProfile['location'],
    preferences: user.preferences as UserProfile['preferences'],
    privacySettings: user.privacySettings as UserProfile['privacySettings']
  }
}

export async function updateUser(
  id: string, 
  data: Partial<CreateUserRequest>
): Promise<UserProfile> {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  })

  if (!existingUser) {
    throw new NotFoundError('User')
  }

  const updateData: Record<string, unknown> = {}

  if (data.firstName) {
    updateData.firstName = sanitizeString(data.firstName)
  }

  if (data.lastName) {
    updateData.lastName = sanitizeString(data.lastName)
  }

  if (data.location) {
    updateData.location = data.location
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profilePicture: true,
      location: true,
      preferences: true,
      privacySettings: true
    }
  })

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName || undefined,
    profilePicture: user.profilePicture || undefined,
    location: user.location as UserProfile['location'],
    preferences: user.preferences as UserProfile['preferences'],
    privacySettings: user.privacySettings as UserProfile['privacySettings']
  }
}

export async function addPet(userId: string, data: CreatePetRequest) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new NotFoundError('User')
  }

  const pet = await prisma.pet.create({
    data: {
      name: sanitizeString(data.name),
      species: data.species as 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'HAMSTER' | 'GUINEA_PIG' | 'FERRET' | 'OTHER',
      breed: data.breed ? sanitizeString(data.breed) : null,
      age: data.age,
      gender: data.gender as 'MALE' | 'FEMALE' | 'UNKNOWN' | null,
      photos: data.photos || [],
      description: data.description ? sanitizeString(data.description) : null,
      personality: data.personality ? sanitizeString(data.personality) : null,
      allergies: data.allergies ? sanitizeString(data.allergies) : null,
      specialNeeds: data.specialNeeds ? sanitizeString(data.specialNeeds) : null,
      isVaccinated: data.isVaccinated || false,
      isNeutered: data.isNeutered || false,
      weight: data.weight,
      microchipId: data.microchipId,
      compatibility: data.compatibility,
      ownerId: userId
    }
  })

  return pet
}

export async function getUsersNearby(
  currentUserId: string,
  location: Required<LocationQuery>,
  pagination: PaginationQuery = {}
) {
  const { page, limit, skip } = validatePagination(pagination.page, pagination.limit)
  const radius = location.radius || 5 // default 5km radius

  // Get current user's privacy settings
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { location: true }
  })

  if (!currentUser) {
    throw new NotFoundError('User')
  }

  // Find users in the area (simplified - in production use PostGIS or similar)
  const users = await prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      status: 'ACTIVE'
    },
    select: {
      id: true,
      firstName: true,
      profilePicture: true,
      location: true,
      pets: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          species: true,
          photos: true
        }
      }
    },
    skip,
    take: limit
  })

  // Filter by distance (in production, do this in the database)
  const nearbyUsers = users.filter((user: typeof users[0]) => {
    if (!user.location || typeof user.location !== 'object') return false
    
    const userLocation = user.location as { coordinates?: { lat: number; lng: number } }
    if (!userLocation.coordinates) return false

    const distance = calculateDistance(
      location.lat,
      location.lng,
      userLocation.coordinates.lat,
      userLocation.coordinates.lng
    )

    return distance <= radius
  })

  const total = nearbyUsers.length

  return {
    users: nearbyUsers.slice(0, limit),
    total,
    page,
    limit
  }
}

export async function deleteUser(id: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id }
  })

  if (!user) {
    throw new NotFoundError('User')
  }

  // Soft delete by updating status
  await prisma.user.update({
    where: { id },
    data: {
      status: 'DELETED',
      email: `deleted_${Date.now()}_${user.email}` // Prevent email conflicts
    }
  })
}
