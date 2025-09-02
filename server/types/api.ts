// API Types for PawGo Phase 1
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, unknown>
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// Auth Types
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName?: string
  phoneNumber?: string
  acceptTerms: boolean
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordConfirmRequest {
  token: string
  newPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// User Profile Types
export interface UpdateUserProfileRequest {
  firstName?: string
  lastName?: string
  displayName?: string
  bio?: string
  phoneNumber?: string
  whatsappNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY'
  interests?: string[]
  personalityTraits?: string[]
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PROFESSIONAL'
  location?: {
    neighborhood?: string
    city?: string
    zipCode?: string
    coordinates?: { lat: number; lng: number }
    radius?: number
  }
  walkPreferences?: {
    preferredTimes?: string[]
    maxDistance?: number
    groupSizePreference?: string
    pacePreference?: string
    terrainPreference?: string[]
  }
  availability?: {
    [key: string]: Array<{ start: string; end: string }>
  }
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
  theme?: 'light' | 'dark' | 'auto'
  language?: string
}

// Pet Profile Types
export interface CreatePetRequest {
  name: string
  nickname?: string
  species: 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'HAMSTER' | 'GUINEA_PIG' | 'FERRET' | 'REPTILE' | 'FISH' | 'HORSE' | 'OTHER'
  breed?: string
  mixedBreed?: boolean
  secondaryBreed?: string
  age?: number
  ageUnit?: 'MONTHS' | 'YEARS'
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  isNeutered?: boolean
  weight?: number
  weightUnit?: string
  height?: number
  color?: string
  markings?: string
  microchipId?: string
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
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {
  id: string
}

// Upload Types
export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}

// Validation Error Types
export interface ValidationError {
  field: string
  message: string
  code: string
}
