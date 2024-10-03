<template>
    <header>
        <nav class="wide">
            <nuxt-link to="/">Home</nuxt-link> <!-- TODO: Replace with logo -->
            <ul :class="{ open: isOpen }">
                <li v-for="link in data.body" :key="link.url">
                    <nuxt-link :to="link.url" @click="isOpen = false">{{ link.text }}</nuxt-link>
                </li>
            </ul>
        </nav>
        <nav class="narrow">
            <div>
                <nuxt-link to="/">Home</nuxt-link> <!-- TODO: Replace with logo -->
                <button @click="isOpen = !isOpen" :class="{ open: isOpen }">
                    ☰ <!-- TODO: Replace with actual icon + change to X when menu is open -->
                </button>
            </div>
            <ul :class="{ open: isOpen }"> <!-- TODO: Add animation -->
                <li v-for="link in data.body" :key="link.url">
                    <nuxt-link :to="link.url" @click="isOpen = false">{{ link.text }}</nuxt-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
const { data } = await useAsyncData('header', () => queryContent('/_data/header').findOne());
const isOpen = ref(false);
</script>

<style scoped>
header {
    background-color: #5d2656;
    color: #fff;
    box-shadow: 0px 7px 7px 0 rgba(13, 2, 11, 0.3);
    width: 100%;
    padding: 1rem;
}

nav {
    display: flex;
    justify-content: space-between;
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 0 4rem;
    width: 100%;
}

nav ul {
    list-style: none;
    display: flex;
    width: 100%;
    justify-content: right;
    gap: 1rem;
    padding: 0;
}

nav a {
    color: #fff;
}

button {
    display: none;
}

nav a:hover,
nav a:active,
nav a:focus {
    color: #ffc425;
    text-decoration: none;
}

.narrow {
    display: none;
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {

    .wide {
        display: none;
    }

    .narrow {
        display: flex;
        flex-direction: column;
    }

    .narrow div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    button {
        display: block;
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    nav {
        padding: 0 1rem;
    }

    nav ul {
        display: none;
    }

    nav ul.open {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}
</style>