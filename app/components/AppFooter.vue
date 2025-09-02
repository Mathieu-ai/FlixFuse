<template>
  <footer class="border-t bg-white/70 dark:bg-gray-900/70">
    <UContainer class="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
      <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <img src="/logo.png" alt="PawGo" class="w-6 h-6 rounded" />
        <span>&copy; {{ new Date().getFullYear() }} PawGo</span>
      </div>
      <nav class="flex items-center gap-4">
        <NuxtLink to="/about" class="hover:underline">About</NuxtLink>
        <NuxtLink to="/privacy" class="hover:underline">Privacy</NuxtLink>
        <NuxtLink to="/terms" class="hover:underline">Terms</NuxtLink>
      </nav>
    </UContainer>
  </footer>
</template>
