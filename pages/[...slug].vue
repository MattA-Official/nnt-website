<template>
  <main>
    <!-- <ContentDoc>
      <template #not-found>
        <div id="error">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <NuxtLink to="/">
            <NavButton>Go back home</NavButton>
          </NuxtLink>
        </div>
      </template>
<template #empty>
        <div id="error">
          <h1>Nothing has been written for this page yet!</h1>
        </div>
      </template>
</ContentDoc> -->
    <div v-if="page">
      <Hero :img="page.meta.hero.img" v-if="page.meta.hero">
        <template #default>
          <h1>{{ page.meta.hero.title }}</h1>
        </template>
        <template #subtitle>
          <p>{{ page.meta.hero.subtitle }}</p>
        </template>
      </Hero>
      <Banner :img="page.meta.banner.img" v-if="page.meta.banner">
        <h1>{{ page.meta.banner.text }}</h1>
      </Banner>
      <ContentPage>
        <ContentRenderer :value="page" />
      </ContentPage>
    </div>
  </main>
</template>

<script setup>
const route = useRoute()

const { data: page } = useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
})
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
