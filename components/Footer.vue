<template>
    <footer>
        <hr />
        <div class="container">
            <ul class="socials-list">
                <li v-for="link in data.socials" :key="link.url">
                    <a :href="link.url">
                        <Icon class="icon" :name="'icon:' + link.icon" v-if="link.icon" />
                        <span v-else class="missing-icon">Icon Missing</span>
                    </a>
                </li>
            </ul>
            <div class="legal">
                <p>&copy; The Nottingham New Theatre, {{ new Date().getFullYear() }}</p>
                <p><em>Proudly part of the Staging Change Network</em></p>
            </div>
            <nav>
                <ul>
                    <li v-for="link in data.links" :key="link.url">
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
    justify-items: center;
}

.legal {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    justify-content: center;
    text-align: center;
    width: auto;
    margin: 0;
}

ul {
    list-style: none;
    display: flex;
    padding: 0;
    gap: 1rem;
    width: 14ch
}

nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: .4rem;
    text-align: right;
}

.socials-list {
    font-size: 1.5rem;
    align-items: center;
}

.missing-icon {
    font-size: 0.6rem;
    width: min-content;
    display: inline-block;
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