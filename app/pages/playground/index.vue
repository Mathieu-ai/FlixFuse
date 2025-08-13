<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
    <h2 class="text-2xl font-bold">{{ $t('playground.title') }}</h2>
    <btn to="/playground/chat" color="primary">{{ $t('playground.chat.btn.start') }}</btn>
  </div>
</template>
