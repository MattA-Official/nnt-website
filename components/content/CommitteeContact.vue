<template>
  <span v-if="member">
    <a :href="'mailto:' + member.email + '@newtheatre.org.uk'" target="_blank">{{ member.name }},
      {{ member.role }}</a>
  </span>
  <span v-else-if="group">
    our <a :href="'mailto:' + group.email + '@newtheatre.org.uk'" target="_blank">{{ group.name }} team</a>
  </span>
  <span v-else>
    <a href="/about#committee">committee</a>
  </span>
</template>

<script lang="ts" setup>
// Takes a role and a fallback group, and displays the correct contact info
const props = defineProps({
  role: String,
  group: String,
});

const { data } = await useAsyncData('committee', () => queryContent('/_data/committee').findOne());

const member = data.value?.committee.find((member: { role: string | undefined; }) => member.role === props.role);
const group = data.value?.groups.find((group: { name: string | undefined; }) => group.name === props.group);

</script>

<style></style>