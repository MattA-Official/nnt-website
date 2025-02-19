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
      <div class="toc-wrapper">
        <TableOfContents :page class="toc" />
      </div>
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

.toc-wrapper {
  display: none;
  padding: 4rem 4rem 0 0;
  top: 4rem;
}

.toc {
  top: 4rem;
  position: sticky;
  display: none;
  height: fit-content;
  overflow-y: auto;
  max-height: 80vh;
  color: var(--primary-text-color);
  border-radius: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--nnt-orange) transparent;
}

.toc::-webkit-scrollbar {
  width: 6px;
}

.toc::-webkit-scrollbar-track {
  background: transparent;
}

.toc::-webkit-scrollbar-thumb {
  background-color: var(--nnt-orange);
  border-radius: 3px;
}

@media (min-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr 260px;
  }

  .toc,
  .toc-wrapper {
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