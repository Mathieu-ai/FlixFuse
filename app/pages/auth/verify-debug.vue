<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Email Verification Debug</h1>
    <div class="space-y-4">
      <p><strong>Current Route:</strong> {{ $route.path }}</p>
      <p><strong>Query Params:</strong> {{ JSON.stringify($route.query) }}</p>
      <p><strong>Token:</strong> {{ token || 'No token provided' }}</p>
      
      <div v-if="token" class="mt-6">
        <UButton @click="testVerification" :loading="isVerifying">
          Test Verification API
        </UButton>
      </div>
      
      <div v-if="result" class="mt-4 p-4 border rounded">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const token = computed(() => route.query.token)
const isVerifying = ref(false)
const result = ref(null)

const testVerification = async () => {
  isVerifying.value = true
  try {
    const response = await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: { token: token.value }
    })
    result.value = { success: true, data: response }
  } catch (error) {
    result.value = { success: false, error: error.data || error.message }
  } finally {
    isVerifying.value = false
  }
}
</script>
