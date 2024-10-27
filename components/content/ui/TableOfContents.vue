<template>
  <div class="table-of-contents">
    <ul>
      <li v-for="link in page.body.toc.links" :key="link.id">
        <a :href="'#' + link.id">{{ link.text }}</a>
        <ul v-if="link.children">
          <li v-for="child in link.children" :key="child.id">
            <a :href="'#' + child.id">{{ child.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  page: Object
})
</script>

<style scoped>
.table-of-contents {
  position: sticky;
  top: 0;
  padding: 2rem;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 0.5rem;
  margin-left: auto;
}
</style>