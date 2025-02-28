<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>

<script setup>
defineProps({
  page: Object
})
</script>