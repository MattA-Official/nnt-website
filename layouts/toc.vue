<template>
  <div>
    <Header />
    <Hero :img="page.hero.img" v-if="page?.hero">
      <template #default>
        <h1>{{ page.hero.title }}</h1>
      </template>
      <template #subtitle>
        <p>{{ page.hero.subtitle }}</p>
      </template>
    </Hero>
    <Banner :img="page.banner.img" v-if="page?.banner">
      <h1>{{ page.banner.text }}</h1>
    </Banner>
    <TableOfContents :page />
    <ContentPage>
      <slot />
    </ContentPage>
    <Footer />
  </div>
</template>

<script setup>
defineProps({
  page: Object
})
</script>