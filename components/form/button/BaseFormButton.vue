<template>
  <NavButton :disabled="disabled || loading" class="base-form-button" :class="{ 'loading': loading }">
    <slot />
  </NavButton>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading {
  cursor: not-allowed;
  opacity: 0.5;
}

.base-form-button {
  width: 100%;
}
</style>