<template>
    <footer>
        <nav>
            <ul>
                <li v-for="link in data.body" :key="link.url">
                    <nuxt-link :to="link.url">{{ link.text }}</nuxt-link>
                </li>
            </ul>
        </nav>
    </footer>
</template>

<script setup>
const { data } = await useAsyncData('footer', () => queryContent('/_data/footer').findOne())
</script>

<style scoped>
footer {
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