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
    <div class="content-wrapper">
      <ContentPage class="page">
        <slot />
      </ContentPage>
      <TableOfContents :page class="toc" />
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
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.toc {
  display: none;
  position: sticky;
  top: 4rem;
  height: fit-content;
  margin-top: 4rem;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 0.5rem;
}

@media (min-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr 300px;
  }

  .toc {
    display: block;
  }

  .page {
    padding-right: 0rem;
  }
}

.page {
  width: 100%;
}
</style>