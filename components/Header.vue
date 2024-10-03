<template>
    <header>
        <nav>
            <ul>
                <li v-for="link in data.body" :key="link.url">
                    <nuxt-link :to="link.url">{{ link.text }}</nuxt-link>
                </li>
            </ul>
        </nav>
    </header>
    <!-- <p>{{ data }}</p> -->
</template>

<script setup>
const { data } = await useAsyncData('header', () => queryContent('/_data/header').findOne());
</script>

<style scoped>
header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
}

nav a {
    color: #fff;
    text-decoration: none;
}
</style>