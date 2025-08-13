<script setup lang="ts">
import { useUtilsStore } from './stores/utils'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const utils = useUtilsStore()
const { languages } = storeToRefs(utils)
const { setLanguage } = utils
const { locale, setLocale } = useI18n()

const selectedLanguage = computed({
  get () {
    return languages.value.find(l => l.code === locale.value)
  },
  set (lang) {
    if (lang && lang.code) {
      setLanguage(lang)
      setLocale(lang.code as 'en' | 'nl')
    }
  }
})
</script>

<template>
  <UHeader>
    <template #left>
      <span class="flex items-center gap-2">
        <img src="/favicon.ico" alt="FlixFuse Logo" class="w-6 h-6" />
        <span class="font-bold text-lg">FlixFuse</span>
      </span>
    </template>
    <template #right>
      <ClientOnly>
        <UInputMenu v-model="selectedLanguage" :items="languages" label-key="name"
          :search-input="{ icon: 'i-lucide-search' }" placeholder="Select language" class="w-48">
          <template #leading="{ modelValue, ui }">
            <span v-if="modelValue" class="size-5 text-center">
              {{ modelValue?.emoji }}
            </span>
            <UIcon v-else name="i-lucide-earth" :class="ui.leadingIcon()" />
          </template>
          <template #item-leading="{ item }">
            <span class="size-5 text-center">
              {{ item.emoji }}
            </span>
          </template>
        </UInputMenu>
        <template #fallback>
          <div class="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
        </template>
      </ClientOnly>
      <btn to="/playground" color="primary" variant="ghost">Playground</btn>
    </template>
  </UHeader>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
