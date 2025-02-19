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
  padding: 1.5rem;
  background: var(--header-bg-color);
  border: 1px solid var(--nnt-orange);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.table-of-contents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.table-of-contents ul ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.table-of-contents li {
  margin-bottom: 0.75rem;
}

.table-of-contents li:last-child {
  margin-bottom: 0;
}

.table-of-contents a {
  color: var(--primary-text-color);
  text-decoration: none;
  transition: color 0.2s;
  display: inline-block;
}

.table-of-contents a:hover {
  color: var(--nnt-orange);
  text-decoration: none;
}

.table-of-contents>ul>li>a {
  font-weight: 500;
}
</style>