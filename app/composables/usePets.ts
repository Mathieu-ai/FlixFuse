import { usePetsStore } from '~/stores/pets'

export const usePets = () => {
  const petsStore = usePetsStore()

  // Fetch all pets
  const fetchPets = async () => {
    await petsStore.fetchPets()
  }

  // Fetch specific pet
  const fetchPet = async (id: string) => {
    return await petsStore.fetchPet(id)
  }

  // Create new pet
  const createPet = async (petData: Record<string, unknown>) => {
    return await petsStore.createPet(petData as Parameters<typeof petsStore.createPet>[0])
  }

  // Update pet
  const updatePet = async (id: string, petData: Record<string, unknown>) => {
    return await petsStore.updatePet(id, petData)
  }

  // Delete pet
  const deletePet = async (id: string) => {
    return await petsStore.deletePet(id)
  }

  // Get pets list
  const pets = computed(() => petsStore.pets)

  // Get active pets only
  const activePets = computed(() => petsStore.activePets)

  // Get current pet
  const currentPet = computed(() => petsStore.currentPet)

  // Get total pets count
  const totalPets = computed(() => petsStore.totalPets)

  // Get pets by species
  const petsBySpecies = computed(() => petsStore.petsBySpecies)

  // Check loading state
  const isLoading = computed(() => petsStore.isLoading)

  // Set current pet
  const setCurrentPet = (pet: Record<string, unknown> | null) => {
    petsStore.setCurrentPet(pet as Parameters<typeof petsStore.setCurrentPet>[0])
  }

  // Clear pets data
  const clearPets = () => {
    petsStore.clearPets()
  }

  return {
    // Functions
    fetchPets,
    fetchPet,
    createPet,
    updatePet,
    deletePet,
    setCurrentPet,
    clearPets,
    
    // Computed properties
    pets,
    activePets,
    currentPet,
    totalPets,
    petsBySpecies,
    isLoading
  }
}
