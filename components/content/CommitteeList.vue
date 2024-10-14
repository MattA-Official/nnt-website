<template>
  <div class="committee-list">
    <div class="grid">
      <CommitteeCard v-for="member in data.committee" :key="member.id" :member="member" v-show="member.name" />
    </div>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('committee', () => queryContent('/_data/committee').findOne());
</script>

<style scoped>
.committee-list {
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>