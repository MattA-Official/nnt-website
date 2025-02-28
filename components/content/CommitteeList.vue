<template>
  <div class="committee-list">
    <div class="grid">
      <CommitteeCard v-for="member in committee?.committee" :key="member.name" :member="member" v-show="member.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: committee } = useAsyncData('committee', () => {
  return queryCollection('committee').first()
})
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