<template>
  <main>
    <div v-if="page">
      <ContentRenderer :value="page" />
    </div>
    <div v-else id="error">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <NuxtLink to="/">
        <NavButton>Go back home</NavButton>
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

// Use direct query for current page to render its content
const { data: page } = await useAsyncData(
  `page-content-${route.path}`,
  () => queryCollection('pages').path(route.path).first(),
  { watch: [route] }
)

// The layout management and page data are now handled by usePageData in app.vue
</script>

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
