<template>
  <div v-if="message" class="error-message">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<style scoped>
.error-message {
  color: var(--danger-color, #dc3545);
  font-size: 0.875rem;
  margin-top: -0.75rem;
  margin-bottom: 0.5rem;
}
</style>