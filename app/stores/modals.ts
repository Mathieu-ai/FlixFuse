import { defineStore } from 'pinia'

export const useModalsStore = defineStore('modals', () => {
  // Pet modals
  const petCreateOpen = ref(false)
  const petDeleteOpen = ref(false)
  
  // Pet modal actions
  const openPetCreate = () => {
    petCreateOpen.value = true
  }
  
  const closePetCreate = () => {
    petCreateOpen.value = false
  }
  
  const openPetDelete = () => {
    petDeleteOpen.value = true
  }
  
  const closePetDelete = () => {
    petDeleteOpen.value = false
  }

  // Profile modals
  const profileEditOpen = ref(false)
  
  const openProfileEdit = () => {
    profileEditOpen.value = true
  }
  
  const closeProfileEdit = () => {
    profileEditOpen.value = false
  }

  // Auth modals
  const loginOpen = ref(false)
  const registerOpen = ref(false)
  const forgotPasswordOpen = ref(false)
  
  const openLogin = () => {
    loginOpen.value = true
  }
  
  const closeLogin = () => {
    loginOpen.value = false
  }
  
  const openRegister = () => {
    registerOpen.value = true
  }
  
  const closeRegister = () => {
    registerOpen.value = false
  }
  
  const openForgotPassword = () => {
    forgotPasswordOpen.value = true
  }
  
  const closeForgotPassword = () => {
    forgotPasswordOpen.value = false
  }

  // Generic modal
  const genericOpen = ref(false)
  
  const openGeneric = () => {
    genericOpen.value = true
  }
  
  const closeGeneric = () => {
    genericOpen.value = false
  }

  return {
    // Pet modals
    petCreateOpen,
    petDeleteOpen,
    openPetCreate,
    closePetCreate,
    openPetDelete,
    closePetDelete,
    
    // Profile modals
    profileEditOpen,
    openProfileEdit,
    closeProfileEdit,
    
    // Auth modals
    loginOpen,
    registerOpen,
    forgotPasswordOpen,
    openLogin,
    closeLogin,
    openRegister,
    closeRegister,
    openForgotPassword,
    closeForgotPassword,
    
    // Generic modal
    genericOpen,
    openGeneric,
    closeGeneric
  }
})
