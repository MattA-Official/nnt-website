<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <NuxtLayout>
    <div id="error">
      <h1>{{ error?.statusCode }} - {{ error?.statusMessage }}</h1>
      <p>{{ error?.message }}</p>
      <NuxtLink to="/">
        <NavButton>Go back home</NavButton>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style scoped>
#error {
  max-width: var(--page-max-width);
  min-height: 55vh;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#error a {
  padding-top: 1rem;
  text-decoration: none;
}
</style>
