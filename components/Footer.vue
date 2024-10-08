<template>
    <footer>
        <hr />
        <div class="container">
            <ul>
                <!-- TODO: socials will go here -->
            </ul>
            <div class="legal">
                <p>&copy; The Nottingham New Theatre, {{ new Date().getFullYear() }}</p>
                <p>Proudly part of the Staging Change Network</p>
            </div>
            <nav>
                <ul>
                    <li v-for="link in data.body" :key="link.url">
                        <nuxt-link :to="link.url">{{ link.text }}</nuxt-link>
                    </li>
                </ul>
            </nav>
        </div>
    </footer>
</template>

<script setup>
const { data } = await useAsyncData('footer', () => queryContent('/_nav/footer').findOne())
</script>

<style scoped>
footer {
    background-color: var(--primary-bg-color);
    color: #fff;
    padding: 1rem;
    width: 100%;
}

.container {
    display: flex;
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 4rem;
    width: 100%;
    justify-content: space-between;
}

.legal {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    justify-content: center;
    text-align: center;
}

ul {
    list-style: none;
    display: flex;
    padding: 0;
    gap: 1rem;
}

nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: .4rem;
    text-align: right;
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {

    .container {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 0 1rem;
    }

    nav ul {
        text-align: center;
    }
}
</style>