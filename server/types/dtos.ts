// Data Transfer Objects for API requests/responses

// User DTOs
export interface UserProfileDto {
  id: string
  email: string
  firstName: string
  lastName?: string
  displayName?: string
  bio?: string
  profilePicture?: string
  phoneNumber?: string
  whatsappNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY'
  location?: {
    neighborhood?: string
    city?: string
    zipCode?: string
    coordinates?: { lat: number; lng: number }
    radius?: number
  }
  timeZone?: string
  language: string
  interests: string[]
  personalityTraits: string[]
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PROFESSIONAL'
  walkPreferences?: {
    preferredTimes?: string[]
    maxDistance?: number
    groupSizePreference?: string
    pacePreference?: string
    terrainPreference?: string[]
  }
  availability?: Record<string, Array<{ start: string; end: string }>>
  privacySettings?: {
    profileVisibility?: string
    locationSharing?: string
    contactInfo?: string
    activitySharing?: string
  }
  notificationSettings?: {
    email?: Record<string, boolean>
    push?: Record<string, boolean>
    sms?: Record<string, boolean>
  }
  communicationPreferences?: {
    preferredMethod?: string
    responseTime?: string
    languages?: string[]
  }
  theme: string
  units: string
  // Read-only fields
  points: number
  level: number
  totalWalks: number
  totalDistanceKm: number
  joinDate: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  role: string
  status: string
  lastActiveAt?: string
}

export interface UpdateUserProfileDto {
  firstName?: string
  lastName?: string
  displayName?: string
  bio?: string
  phoneNumber?: string
  whatsappNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY'
  location?: {
    neighborhood?: string
    city?: string
    zipCode?: string
    coordinates?: { lat: number; lng: number }
    radius?: number
  }
  timeZone?: string
  language?: string
  interests?: string[]
  personalityTraits?: string[]
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PROFESSIONAL'
  walkPreferences?: {
    preferredTimes?: string[]
    maxDistance?: number
    groupSizePreference?: string
    pacePreference?: string
    terrainPreference?: string[]
  }
  availability?: Record<string, Array<{ start: string; end: string }>>
  privacySettings?: {
    profileVisibility?: string
    locationSharing?: string
    contactInfo?: string
    activitySharing?: string
  }
  notificationSettings?: {
    email?: Record<string, boolean>
    push?: Record<string, boolean>
    sms?: Record<string, boolean>
  }
  communicationPreferences?: {
    preferredMethod?: string
    responseTime?: string
    languages?: string[]
  }
  theme?: string
  units?: string
}

// Pet DTOs
export interface PetDto {
  id: string
  name: string
  nickname?: string
  species: 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'HAMSTER' | 'GUINEA_PIG' | 'FERRET' | 'REPTILE' | 'FISH' | 'HORSE' | 'OTHER'
  breed?: string
  mixedBreed: boolean
  secondaryBreed?: string
  age?: number
  ageUnit: 'WEEKS' | 'MONTHS' | 'YEARS'
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  isNeutered: boolean
  weight?: number
  weightUnit: string
  height?: number
  color?: string
  markings?: string
  microchipId?: string
  photos: string[]
  videos: string[]
  profilePhoto?: string
  personalityTraits: string[]
  behaviorTraits: string[]
  energyLevel?: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  socialLevel?: 'SHY' | 'CAUTIOUS' | 'FRIENDLY' | 'VERY_SOCIAL' | 'OVERLY_SOCIAL'
  trainingLevel?: 'UNTRAINED' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
  allergies: string[]
  medicalConditions: string[]
  medications: string[]
  specialNeeds?: string
  dietaryRestrictions: string[]
  isVaccinated: boolean
  lastVetVisit?: string
  nextVetVisit?: string
  compatibility?: {
    dogs?: string
    cats?: string
    children?: string
    strangers?: string
  }
  playStyle: string[]
  favoriteActivities: string[]
  fearsTriggers: string[]
  feedingSchedule?: {
    times?: string[]
    amount?: string
    food_type?: string
  }
  exerciseNeeds?: {
    daily_minutes?: number
    intensity?: string
    preferred_activities?: string[]
  }
  careInstructions?: string
  isActive: boolean
  isPublic: boolean
  isLost: boolean
  lostDetails?: {
    date?: string
    location?: string
    description?: string
  }
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  registrationNumber?: string
  pedigree: boolean
  insuranceInfo?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreatePetDto {
  name: string
  nickname?: string
  species: 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'HAMSTER' | 'GUINEA_PIG' | 'FERRET' | 'REPTILE' | 'FISH' | 'HORSE' | 'OTHER'
  breed?: string
  mixedBreed?: boolean
  secondaryBreed?: string
  age?: number
  ageUnit?: 'WEEKS' | 'MONTHS' | 'YEARS'
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  isNeutered?: boolean
  weight?: number
  weightUnit?: string
  height?: number
  color?: string
  markings?: string
  microchipId?: string
  photos?: string[]
  videos?: string[]
  profilePhoto?: string
  personalityTraits?: string[]
  behaviorTraits?: string[]
  energyLevel?: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  socialLevel?: 'SHY' | 'CAUTIOUS' | 'FRIENDLY' | 'VERY_SOCIAL' | 'OVERLY_SOCIAL'
  trainingLevel?: 'UNTRAINED' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
  allergies?: string[]
  medicalConditions?: string[]
  medications?: string[]
  specialNeeds?: string
  dietaryRestrictions?: string[]
  isVaccinated?: boolean
  lastVetVisit?: string
  nextVetVisit?: string
  compatibility?: {
    dogs?: string
    cats?: string
    children?: string
    strangers?: string
  }
  playStyle?: string[]
  favoriteActivities?: string[]
  fearsTriggers?: string[]
  feedingSchedule?: {
    times?: string[]
    amount?: string
    food_type?: string
  }
  exerciseNeeds?: {
    daily_minutes?: number
    intensity?: string
    preferred_activities?: string[]
  }
  careInstructions?: string
  isPublic?: boolean
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  registrationNumber?: string
  pedigree?: boolean
  insuranceInfo?: Record<string, unknown>
}

export interface UpdatePetDto extends Partial<CreatePetDto> {
  isActive?: boolean
  isLost?: boolean
  lostDetails?: {
    date?: string
    location?: string
    description?: string
  }
}

// Response DTOs
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    message: string
    code: string
    details?: Record<string, unknown>
  }
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiValidationErrorResponse {
  success: false
  error: {
    message: string
    code: 'VALIDATION_ERROR'
    details: {
      validationErrors: ValidationError[]
    }
  }
}
