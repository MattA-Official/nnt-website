<template>
  <div>
    <nuxt-link :href="url">
      <button :class="[color]" class="wide">
        <ContentSlot :use="$slots.default" unwrap="p" />
      </button>
    </nuxt-link>
  </div>
</template>

<script setup>
defineProps(['url', 'color']);
</script>

<style scoped>
div {
  max-width: var(--page-max-width);
  width: 100%;
  margin: 0 auto;
  padding: 1rem 5rem;
}

button {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  line-height: 1.2rem;
  cursor: pointer;
}

p {
  padding: 2rem 5rem;
}

button.orange {
  background-color: var(--nnt-orange);
  color: var(--alt-text-color);
}

button.orange:hover,
button.orange:active,
button.orange:focus {
  background-color: var(--nnt-orange-lighter);
}

button.purple {
  background-color: var(--nnt-purple);
  color: var(--primary-text-color);
}

button.purple:hover,
button.purple:active,
button.purple:focus {
  background-color: var(--nnt-purple-lighter);
}
</style>

<!-- TODO: Change div padding on small screens -->
<!-- TODO: Add icon for 'external' links -->