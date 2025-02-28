<template>
  <div>
    <Header />
    <Hero :img="pageData?.meta?.hero?.img" v-if="pageData?.meta?.hero">
      <template #default>
        <h1>{{ pageData?.meta?.hero?.title || '' }}</h1>
      </template>
      <template #subtitle>
        <p>{{ pageData?.meta?.hero?.subtitle || '' }}</p>
      </template>
    </Hero>
    <Banner :img="pageData?.meta?.banner?.img" v-if="pageData?.meta?.banner">
      <h1>{{ pageData?.meta?.banner?.text || '' }}</h1>
    </Banner>
    <ContentPage class="page">
      <slot />
    </ContentPage>
    <Footer />
  </div>
</template>

<script setup>
const { pageData } = usePageData()
</script>