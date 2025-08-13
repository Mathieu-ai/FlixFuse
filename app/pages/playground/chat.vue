<template>
  <UContainer class="py-8 flex flex-col items-center">
    <UCard class="w-full max-w-xl">
      <div class="flex flex-col h-[60vh]">
        <div class="flex items-center justify-between mb-4 border-b pb-2">
          <h2 class="text-xl font-semibold">{{ $t('playground.chat.title') }}</h2>
        </div>
        <div class="flex-1 overflow-y-auto space-y-2 px-1" style="scrollbar-width: thin;">
          <div
            v-for="message in playground.messages"
            :key="message.id"
            :class="[
              'rounded px-3 py-2 max-w-[80%] break-words',
              message.isSelf ? 'bg-blue-900 ml-auto text-right' : 'bg-lime-800 mr-auto text-left'
            ]"
          >
            {{ message.text }}
          </div>
        </div>
        <div class="mt-4 flex gap-2 items-end">
          <UInput
            v-model="newMessage"
            @keyup.enter="handleSend"
            :placeholder="$t('playground.chat.btn.placeholder')"
            class="flex-1"
            size="lg"
            autofocus
          />
          <btn @click="handleSend" color="primary" size="lg">{{ $t('playground.chat.btn.send') }}</btn>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlaygroundStore } from '../../stores/playground'

const playground = usePlaygroundStore()
const newMessage = ref('')

function handleSend() {
  const text = newMessage.value.trim()
  if (text) {
    playground.sendMessage(text)
    newMessage.value = ''
    setTimeout(() => {
      const chatArea = document.querySelector('.overflow-y-auto')
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight
    }, 50)
  }
}

onMounted(() => {
  playground.initSocket()
})
onUnmounted(() => {
  playground.closeSocket()
})
</script>
