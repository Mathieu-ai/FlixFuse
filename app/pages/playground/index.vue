<template>
  <UContainer class="py-8">
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <UCard class="text-center max-w-md">
        <div class="p-8">
          <h2 class="text-3xl font-bold mb-4">{{ $t('playground.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Explore our experimental features and tools</p>
          <div class="flex flex-col gap-4">
            <UButton to="/playground/chat" color="primary" size="lg" icon="i-heroicons-chat-bubble-left-right">
              {{ $t('playground.chat.btn.start') }}
            </UButton>
            <UButton to="/playground/map" color="info" size="lg" icon="i-heroicons-map">
              Mapbox Playground
            </UButton>
            <UButton to="/playground/audio" color="success" size="lg" icon="i-heroicons-musical-note">
              Audio Player
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
