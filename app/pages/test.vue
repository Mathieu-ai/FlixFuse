<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Test Page</h1>
    <p>If you can see this, routing is working!</p>
    <p>Current route: {{ $route.path }}</p>
    <p>Query params: {{ JSON.stringify($route.query) }}</p>
  </div>
</template>

<script setup>
// Test page to verify routing is working
</script>
