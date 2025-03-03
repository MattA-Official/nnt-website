<template>
  <main>
    <div v-if="page">
      <ContentRenderer :value="page" />
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

// if page doesn't exist, return 404
if (!page.value) {
  throw createError({
    statusCode: 404,
    message: 'In amongst the props, lights and wires, we couldn’t find that page for you.',
  })
}
</script>