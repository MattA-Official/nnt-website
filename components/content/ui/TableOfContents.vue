<template>
  <div class="table-of-contents">
    <pre>{{ page.body.toc }}</pre>
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