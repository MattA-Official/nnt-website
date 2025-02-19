<template>
  <NuxtLayout :name="data?.layout || 'default'" :page="data">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()

const { data } = await useAsyncData(route.path, () => queryContent(route.path).findOne(), { watch: route })
</script>