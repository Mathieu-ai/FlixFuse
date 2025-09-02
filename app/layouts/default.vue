<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
  <AppNavDrawer />

    <main class="flex-1">
      <slot />
    </main>

    <!-- Mobile bottom nav for fast access (3-click rule) -->
    <ClientOnly>
      <div v-if="authStore.isLoggedIn" class="md:hidden border-t bg-white dark:bg-gray-800 sticky bottom-0">
        <nav class="flex justify-around py-2">
          <UButton to="/dashboard" variant="ghost" size="sm"><UIcon name="i-heroicons-home" class="text-lg" /></UButton>
          <UButton to="/pets" variant="ghost" size="sm"><UIcon name="i-heroicons-heart" class="text-lg" /></UButton>
          <UButton to="/members" variant="ghost" size="sm"><UIcon name="i-heroicons-users" class="text-lg" /></UButton>
          <UButton to="/messages" variant="ghost" size="sm"><UIcon name="i-heroicons-chat-bubble-left-right" class="text-lg" /></UButton>
        </nav>
      </div>
      <template #fallback>
        <div class="md:hidden border-t bg-white dark:bg-gray-800">
          <nav class="flex justify-around py-2">
            <USkeleton class="h-8 w-8" v-for="i in 4" :key="i" />
          </nav>
        </div>
      </template>
    </ClientOnly>
  <AppFooter />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>
