<template>
  <div class="committee-list">
    <div class="grid">
      <Card v-for="member in data.committee" :key="member.id" :member="member" v-show="member.name" />
    </div>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('committee', () => queryContent('/_data/committee').findOne());
</script>

<style scoped>
.committee-list {
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding: 3rem 5rem 0.2rem;
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {
  .committee-list {
    padding: 2rem;
  }
}
</style>