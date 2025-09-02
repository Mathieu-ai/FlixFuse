import { z } from 'zod'

// Auth Validation Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
  lastName: z.string().max(50, 'Last name too long').optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Invalid phone number format').optional().or(z.literal('')),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).refine((data) => {
  // At least one of email or phone number must be provided and not empty
  const hasEmail = data.email && data.email.trim() !== ''
  const hasPhone = data.phoneNumber && data.phoneNumber.trim() !== ''
  return hasEmail || hasPhone
}, {
  message: 'Please provide either an email address or phone number',
  path: ['email'] // This will show the error on the email field
})

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
})

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

export const verifyPhoneSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Verification code must contain only numbers')
})

export const resendVerificationSchema = z.object({
  type: z.enum(['email', 'phone']),
  identifier: z.string().min(1, 'Email or phone number is required')
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
})

// User Profile Validation Schemas
export const updateUserProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long').optional(),
  lastName: z.string().max(50, 'Last name too long').nullable().optional(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name too long').nullable().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').nullable().optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Invalid phone number format').nullable().optional(),
  whatsappNumber: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Invalid WhatsApp number format').nullable().optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).nullable().optional(),
  interests: z.array(z.string()).max(20, 'Too many interests').optional(),
  personalityTraits: z.array(z.string()).max(15, 'Too many personality traits').optional(),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PROFESSIONAL']).optional(),
  location: z.object({
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180)
    }).optional(),
    radius: z.number().positive().max(100).optional()
  }).nullable().optional(),
  timeZone: z.string().min(1).max(50).nullable().optional(),
  walkPreferences: z.object({
    preferredTimes: z.array(z.string()).optional(),
    maxDistance: z.number().positive().max(50).optional(),
    groupSizePreference: z.string().optional(),
    pacePreference: z.string().optional(),
    terrainPreference: z.array(z.string()).optional()
  }).nullable().optional(),
  availability: z.record(z.string(), z.array(z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
  }))).nullable().optional(),
  privacySettings: z.object({
    profileVisibility: z.string().optional(),
    locationSharing: z.string().optional(),
    contactInfo: z.string().optional(),
    activitySharing: z.string().optional()
  }).nullable().optional(),
  notificationSettings: z.object({
    email: z.record(z.string(), z.boolean()).optional(),
    push: z.record(z.string(), z.boolean()).optional(),
    sms: z.record(z.string(), z.boolean()).optional()
  }).nullable().optional(),
  communicationPreferences: z.object({
    preferredMethod: z.string().optional(),
    responseTime: z.string().optional(),
    languages: z.array(z.string()).optional()
  }).nullable().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.string().min(2).max(5).optional(),
  units: z.enum(['metric', 'imperial']).optional()
})

// Pet Profile Validation Schemas
export const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50, 'Pet name too long'),
  nickname: z.string().max(50, 'Nickname too long').nullable().optional(),
  species: z.enum(['DOG', 'CAT', 'RABBIT', 'BIRD', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'HORSE', 'OTHER']),
  breed: z.string().max(100, 'Breed name too long').nullable().optional(),
  mixedBreed: z.boolean().optional(),
  secondaryBreed: z.string().max(100, 'Secondary breed name too long').nullable().optional(),
  age: z.number().int().min(0).max(50).nullable().optional(),
  ageUnit: z.enum(['WEEKS', 'MONTHS', 'YEARS']).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).nullable().optional(),
  isNeutered: z.boolean().optional(),
  weight: z.number().positive().max(200).nullable().optional(),
  weightUnit: z.string().max(10).optional(),
  height: z.number().positive().max(300).nullable().optional(),
  color: z.string().max(100).nullable().optional(),
  markings: z.string().max(200).nullable().optional(),
  microchipId: z.string().max(50).nullable().optional(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  profilePhoto: z.string().nullable().optional(),
  personalityTraits: z.array(z.string()).max(20).optional(),
  behaviorTraits: z.array(z.string()).max(20).optional(),
  energyLevel: z.enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']).nullable().optional(),
  socialLevel: z.enum(['SHY', 'CAUTIOUS', 'FRIENDLY', 'VERY_SOCIAL', 'OVERLY_SOCIAL']).nullable().optional(),
  trainingLevel: z.enum(['UNTRAINED', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL']).nullable().optional(),
  allergies: z.array(z.string()).max(20).optional(),
  medicalConditions: z.array(z.string()).max(20).optional(),
  medications: z.array(z.string()).max(20).optional(),
  specialNeeds: z.string().max(1000).nullable().optional(),
  dietaryRestrictions: z.array(z.string()).max(20).optional(),
  isVaccinated: z.boolean().optional(),
  lastVetVisit: z.string().datetime().nullable().optional(),
  nextVetVisit: z.string().datetime().nullable().optional(),
  compatibility: z.object({
    dogs: z.string().optional(),
    cats: z.string().optional(),
    children: z.string().optional(),
    strangers: z.string().optional()
  }).nullable().optional(),
  playStyle: z.array(z.string()).max(10).optional(),
  favoriteActivities: z.array(z.string()).max(15).optional(),
  fearsTriggers: z.array(z.string()).max(15).optional(),
  feedingSchedule: z.object({
    times: z.array(z.string()).optional(),
    amount: z.string().optional(),
    food_type: z.string().optional()
  }).nullable().optional(),
  exerciseNeeds: z.object({
    daily_minutes: z.number().int().min(0).max(600).optional(),
    intensity: z.string().optional(),
    preferred_activities: z.array(z.string()).optional()
  }).nullable().optional(),
  careInstructions: z.string().max(2000).nullable().optional(),
  isPublic: z.boolean().optional(),
  isLost: z.boolean().optional(),
  lostDetails: z.object({
    date: z.string().datetime().optional(),
    location: z.string().optional(),
    description: z.string().optional()
  }).nullable().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Invalid phone number format').optional(),
    relationship: z.string().optional()
  }).nullable().optional(),
  registrationNumber: z.string().max(50).nullable().optional(),
  pedigree: z.boolean().optional(),
  insuranceInfo: z.record(z.string(), z.unknown()).nullable().optional()
})

export const updatePetSchema = createPetSchema.partial().extend({
  id: z.string().cuid('Invalid pet ID')
})

// Posts Validation Schema
export const createPostSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(2000, 'Post content too long'),
  images: z.array(z.string().url()).max(10).optional(),
  videos: z.array(z.string().url()).max(5).optional(),
  postType: z.enum(['TEXT', 'PHOTO', 'VIDEO', 'POLL', 'QUESTION', 'TIP_ADVICE', 'ALERT_LOST', 'ALERT_FOUND', 'ANNOUNCEMENT', 'REVIEW', 'STORY', 'LIVE_UPDATE', 'MEMORIAL', 'ADOPTION_POST', 'SERVICE_RECOMMENDATION', 'EVENT_RECAP']).default('TEXT'),
  category: z.enum(['HEALTH_MEDICAL', 'TRAINING_BEHAVIOR', 'NUTRITION_DIET', 'GROOMING_CARE', 'EXERCISE_ACTIVITY', 'SOCIAL_MEETUPS', 'EMERGENCY_SAFETY', 'PRODUCT_REVIEW', 'SERVICE_REVIEW', 'COMMUNITY_NEWS', 'FUNNY_CUTE', 'EDUCATIONAL', 'LOST_FOUND', 'ADOPTION', 'MEMORIAL']).optional(),
  petId: z.string().cuid().optional(),
  hashtags: z.array(z.string()).max(20).optional(),
  location: z.object({
    name: z.string().optional(),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180)
    }).optional(),
    address: z.string().optional()
  }).nullable().optional(),
  tags: z.array(z.string()).max(20).optional(),
  visibility: z.enum(['PUBLIC', 'NEIGHBORHOOD', 'FRIENDS_ONLY', 'FOLLOWERS_ONLY', 'PRIVATE', 'MEMBERS_ONLY']).optional().default('NEIGHBORHOOD'),
  isUrgent: z.boolean().optional().default(false),
  expiresAt: z.string().datetime().optional(),
  title: z.string().max(200).optional(),
  excerpt: z.string().max(500).optional()
})

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().cuid('Invalid post ID')
})

// Comments Validation Schema
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(500, 'Comment too long'),
  postId: z.string().cuid('Invalid post ID'),
  parentId: z.string().cuid().optional() // For replies
})

// File Upload Validation
export const uploadFileSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['avatar', 'pet_photo', 'document', 'post_media'])
})

// Utility function to handle validation errors
export function formatValidationErrors(error: z.ZodError) {
  return error.issues.map((err: z.ZodIssue) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }))
}
