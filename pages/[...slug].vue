<template>
  <main>
    <ContentDoc>
      <template #not-found>
        <div id="not-found">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </template>
      <template #empty>
        <h1>Nothing has been written for this page yet!</h1>
      </template>
    </ContentDoc>
  </main>
</template>

<style scoped>
#not-found {
  max-width: var(--page-max-width);
  width: 100%;
  margin: 0 auto;
  padding: 1rem 5rem;
  text-align: center;
}
</style>
