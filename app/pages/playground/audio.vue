<template>
  <UContainer class="py-8">
    <UCard class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Audio Playground</h2>
          <UButton to="/playground" variant="ghost" size="sm" icon="i-heroicons-arrow-left">
            Back
          </UButton>
        </div>
      </template>

      <div class="space-y-6">
        <p class="text-gray-600 dark:text-gray-300">
          WhatsApp-like audio message player with waveform, click-to-seek, and speed control.
        </p>

  <WaAudio :src="testSrc" />

        <div class="text-xs text-gray-500 dark:text-gray-400">
          Source: <code>{{ testSrc }}</code>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
defineOptions({ name: 'PlaygroundAudio' })
import WaAudio from '~/components/WaAudio.vue'

const testSrc = '/uploads/2025-08-21/304bb431-83c0-41cd-adf9-f2fd355c2801.mp3'
</script>
