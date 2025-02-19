<template>
  <div class="alert" :class="type">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'error'].includes(value)
  }
})
</script>

<style>
.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 0.25rem;
}

.info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

.warning {
  color: #664d03;
  background-color: #fff3cd;
  border-color: #ffeeba;
}

.error {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}
</style>