<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { layout, fetchPageData } = usePageData()

// Initial data fetch based on the route
await fetchPageData()

// Refetch data when route changes
const route = useRoute()
watch(() => route.path, async () => {
  await fetchPageData()
}, { immediate: false })
</script>