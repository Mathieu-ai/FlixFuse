import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUtilsStore = defineStore('utils', () => {
  const languages = ref([
    { code: 'en', name: 'English', emoji: '🇬🇧' },
    { code: 'nl', name: 'Nederlands', emoji: '🇳🇱' },
    { code: 'cn', name: '中文', emoji: '🇨🇳' },
    { code: 'jp', name: '日本語', emoji: '🇯🇵' }
  ])

  const selectedLanguage = ref(languages.value[0])

  function setLanguage(lang: typeof languages.value[0]) {
    selectedLanguage.value = lang
  }

  function getLanguageByCode(code: string) {
    return languages.value.find(lang => lang.code === code) || languages.value[0]
  }

  return {
    languages,
    selectedLanguage,
    setLanguage,
    getLanguageByCode
  }
})
