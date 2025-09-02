<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
const authStore = useAuthStore()
const ui = useUiStore()
const utils = useUtilsStore()
const { languages } = storeToRefs(utils)
const { setLanguage } = utils
const { locale, setLocale } = useI18n()

const selectedLanguage = computed({
  get () {
    return languages.value.find(l => l.code === locale.value)
  },
  set (lang) {
    if (lang && (lang as any).code) {
      setLanguage(lang as any)
      setLocale((lang as any).code as 'en' | 'nl' | 'cn' | 'jp')
    }
  }
})

async function logout () {
  await authStore.logout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <UHeader class="border-b">
    <template #left>
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-bars-3" variant="ghost" class="md:hidden" @click="ui.toggleSidebar?.()" />
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo.png" alt="PawGo" class="w-8 h-8 rounded" />
          <span class="font-semibold">PawGo</span>
        </NuxtLink>
        <ClientOnly>
          <UInput placeholder="Search" leading-icon="i-heroicons-magnifying-glass" class="hidden md:block w-72" />
        </ClientOnly>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-1 md:gap-2">
        <UButton to="/dashboard" variant="ghost" class="hidden sm:inline-flex">Dashboard</UButton>
        <UButton to="/pets" variant="ghost" class="hidden sm:inline-flex">Pets</UButton>
        <UButton to="/members" variant="ghost" class="hidden sm:inline-flex">Members</UButton>
        <UButton to="/messages" variant="ghost" class="hidden sm:inline-flex">Messages</UButton>

        <ClientOnly>
          <UInputMenu v-model="selectedLanguage" :items="languages" label-key="name" placeholder="Lang" class="w-32">
            <template #leading="{ modelValue, ui }">
              <span v-if="modelValue" class="size-5 text-center">{{ (modelValue as any)?.emoji }}</span>
              <UIcon v-else name="i-lucide-earth" :class="ui.leadingIcon()" />
            </template>
            <template #item-leading="{ item }">
              <span class="size-5 text-center">{{ (item as any).emoji }}</span>
            </template>
          </UInputMenu>
        </ClientOnly>

        <ClientOnly>
          <template v-if="authStore.isLoggedIn">
            <UButton to="/profile" variant="ghost">Profile</UButton>
            <UButton @click="logout" variant="ghost">Logout</UButton>
          </template>
          <template v-else>
            <UButton to="/auth/login" variant="ghost">Login</UButton>
            <UButton to="/auth/register" color="primary">Sign up</UButton>
          </template>
        </ClientOnly>
      </div>
    </template>
  </UHeader>
</template>

<style scoped>
</style>
