import { defineStore } from 'pinia'

interface Pet {
  id: string
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
  isActive?: boolean
  isPublic?: boolean
  isLost?: boolean
  lostDetails?: Record<string, unknown>
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  registrationNumber?: string
  pedigree?: boolean
  insuranceInfo?: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, unknown>
  }
}

interface PetsState {
  pets: Pet[]
  isLoading: boolean
  currentPet: Pet | null
}

export const usePetsStore = defineStore('pets', {
  state: (): PetsState => ({
    pets: [],
    isLoading: false,
    currentPet: null
  }),

  getters: {
    activePets: (state) => state.pets.filter(pet => pet.isActive !== false),
    totalPets: (state) => state.pets.length,
    petsBySpecies: (state) => {
      return state.pets.reduce((acc, pet) => {
        acc[pet.species] = (acc[pet.species] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  },

  actions: {
  // Cookies are sent automatically; no Authorization header needed

    // Fetch all user's pets
    async fetchPets() {
      this.isLoading = true
      try {
  const response = await $fetch<ApiResponse<{ pets: Pet[]; total: number; message: string }>>('/api/pets')

        if (response.success && response.data) {
          // The API returns { pets: Pet[], total: number, message: string }
          this.pets = response.data.pets || []
        } else {
          throw new Error(response.error?.message || 'Failed to fetch pets')
        }
      } catch (error: unknown) {
        console.error('Fetch pets error:', error)
        this.pets = [] // Reset to empty array on error
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Get specific pet
    async fetchPet(id: string) {
      this.isLoading = true
      try {
  const response = await $fetch<ApiResponse<Pet>>(`/api/pets/${id}`)

        if (response.success && response.data) {
          this.currentPet = response.data
          
          // Update pet in the pets array if it exists
          const index = this.pets.findIndex(pet => pet.id === id)
          if (index !== -1) {
            this.pets.splice(index, 1, response.data)
          }
          
          return response.data
        } else {
          throw new Error(response.error?.message || 'Failed to fetch pet')
        }
      } catch (error: unknown) {
        console.error('Fetch pet error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Create new pet
    async createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) {
      this.isLoading = true
      try {
        const response = await $fetch<ApiResponse<{ pet: Pet; message?: string }>>('/api/pets', {
          method: 'POST',
          body: petData
        })

        if (response.success && response.data) {
          this.pets.unshift(response.data.pet)
          this.currentPet = response.data.pet
          
          return { 
            success: true, 
            pet: response.data.pet,
            message: response.data.message || 'Pet created successfully'
          }
        } else {
          throw new Error(response.error?.message || 'Failed to create pet')
        }
      } catch (error: unknown) {
        console.error('Create pet error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Update existing pet
    async updatePet(id: string, petData: Partial<Pet>) {
      this.isLoading = true
      try {
        const response = await $fetch<ApiResponse<{ pet: Pet; message?: string }>>(`/api/pets/${id}`, {
          method: 'PUT',
          body: petData
        })

        if (response.success && response.data) {
          const updatedPet = response.data.pet
          
          // Update pet in the pets array
          const index = this.pets.findIndex(pet => pet.id === id)
          if (index !== -1) {
            this.pets.splice(index, 1, updatedPet)
          }
          
          // Update current pet if it's the same
          if (this.currentPet?.id === id) {
            this.currentPet = updatedPet
          }
          
          return { 
            success: true, 
            pet: updatedPet,
            message: response.data.message || 'Pet updated successfully'
          }
        } else {
          throw new Error(response.error?.message || 'Failed to update pet')
        }
      } catch (error: unknown) {
        console.error('Update pet error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete pet (soft delete)
    async deletePet(id: string) {
      this.isLoading = true
      try {
        const response = await $fetch<ApiResponse<{ message?: string }>>(`/api/pets/${id}`, {
          method: 'DELETE'
        })

        if (response.success) {
          // Remove pet from the pets array
          this.pets = this.pets.filter(pet => pet.id !== id)
          
          // Clear current pet if it's the deleted one
          if (this.currentPet?.id === id) {
            this.currentPet = null
          }
          
          return { 
            success: true,
            message: response.data?.message || 'Pet deleted successfully'
          }
        } else {
          throw new Error(response.error?.message || 'Failed to delete pet')
        }
      } catch (error: unknown) {
        console.error('Delete pet error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Clear pets data
    clearPets() {
      this.pets = []
      this.currentPet = null
    },

    // Set current pet
    setCurrentPet(pet: Pet | null) {
      this.currentPet = pet
    }
  }
})
