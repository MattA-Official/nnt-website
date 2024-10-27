<template>
  <NuxtLayout>
    <Hero :img="data.hero.img" v-if="data.hero">
      <template #default>
        <h1>{{ data.hero.title }}</h1>
      </template>
      <template #subtitle>
        <p>{{ data.hero.subtitle }}</p>
      </template>
    </Hero>
    <Banner :img="data.banner.img" v-if="data.banner">
      <h1>{{ data.banner.text }}</h1>
    </Banner>
    <ContentPage>
      <NuxtPage />
    </ContentPage>
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()

const { data } = await useAsyncData(route.path, () => queryContent(route.path).findOne(), { watch: route })
</script>
