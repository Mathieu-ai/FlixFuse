<script setup lang="ts">
import { storeToRefs } from 'pinia'
const ui = useUiStore()
const auth = useAuthStore()
const utils = useUtilsStore()
const { languages } = storeToRefs(utils)
const { setLanguage } = utils

function go(path: string) {
  ui.closeSidebar()
  navigateTo(path)
}
</script>

<template>
  <UModal v-model:open="ui.sidebarOpen">
    <template #content>
      <UCard class="max-w-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="/logo.png" class="w-6 h-6 rounded" alt="PawGo" />
              <span class="font-semibold">Menu</span>
            </div>
            <UButton icon="i-heroicons-x-mark" variant="ghost" @click="ui.closeSidebar()" />
          </div>
        </template>

        <nav class="flex flex-col gap-2">
          <UButton block variant="ghost" icon="i-heroicons-home" @click="go('/dashboard')">Dashboard</UButton>
          <UButton block variant="ghost" icon="i-heroicons-heart" @click="go('/pets')">Pets</UButton>
          <UButton block variant="ghost" icon="i-heroicons-users" @click="go('/members')">Members</UButton>
          <UButton block variant="ghost" icon="i-heroicons-chat-bubble-left-right" @click="go('/messages')">Messages</UButton>
          <UButton block variant="ghost" icon="i-heroicons-information-circle" @click="go('/about')">About</UButton>
        </nav>

        <div class="mt-4">
          <label class="text-xs text-gray-500">Language</label>
          <USelectMenu :items="languages" option-attribute="name" by="code" @update:model-value="(l:any)=> setLanguage(l)">
            <UButton block variant="outline">
              <span class="mr-2">🌐</span> Change language
            </UButton>
          </USelectMenu>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <template v-if="auth.isLoggedIn">
              <UButton block variant="outline" @click="go('/profile')">Profile</UButton>
              <UButton block color="primary" @click="() => { auth.logout(); go('/') }">Logout</UButton>
            </template>
            <template v-else>
              <UButton block variant="outline" @click="go('/auth/login')">Login</UButton>
              <UButton block color="primary" @click="go('/auth/register')">Sign up</UButton>
            </template>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
