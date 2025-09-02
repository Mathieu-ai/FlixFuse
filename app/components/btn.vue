<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useLocalePath } from '#imports'

const props = defineProps({
  to: [String, Object],
  color: {
    type: String as () => 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral',
    default: 'primary'
  },
  variant: {
    type: String as () => 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost',
    default: 'solid'
  },
  size: {
    type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    default: 'md'
  },
  icon: String,
  iconRight: String,
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  rounded: Boolean,
  ariaLabel: String,
  type: {
    type: String as () => 'button' | 'reset' | 'submit',
    default: 'button'
  }
})

const attrs = useAttrs()

const normalized = computed(() => {
  if (!props.to) return undefined
  const localePath = useLocalePath()
  const to = props.to
  if (typeof to === 'string') {
    const path = to.startsWith('/') ? to : `/${to}`
    return localePath({ path })
  }
  return localePath(to)
})
</script>

<template>
  <UButton 
    v-bind="attrs" 
    :to="normalized" 
    :color="props.color" 
    :variant="props.variant" 
    :size="props.size"
    :icon="props.icon" 
    :icon-right="props.iconRight" 
    :loading="props.loading" 
    :disabled="props.disabled"
    :block="props.block" 
    :rounded="props.rounded" 
    :aria-label="props.ariaLabel" 
    :type="props.type"
  >
    <slot />
  </UButton>
</template>