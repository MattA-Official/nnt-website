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
    <div class="content">
      <TableOfContents :page class="toc" />
      <ContentPage class="page">
        <slot />
      </ContentPage>
    </div>
    <Footer />
  </div>
</template>

<script setup>
defineProps({
  page: Object
})
</script>

<style scoped>
.toc {
  position: sticky;
  top: 0;
  padding: 2rem;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 0.5rem;
  margin-left: auto;
  width: auto;
  height: 0;
}
</style>