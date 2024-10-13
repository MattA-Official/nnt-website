<template>
    <header>
        <nav class="wide">
            <NuxtLink to="/" aria-label="Home | The Nottingham New Theatre">
                <Logo />
            </NuxtLink>
            <ul :class="{ open: isOpen }">
                <li v-for="link in data.links" :key="link.url">
                    <NuxtLink :to="link.url">
                        <template v-if="link.button">
                            <NavButton :type="link.type">
                                {{ link.text }}
                            </NavButton>
                        </template>
                        <template v-else>
                            {{ link.text }}
                        </template>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
        <nav class="narrow">
            <div>
                <NuxtLink to="/" aria-label="Home | The Nottingham New Theatre">
                    <Logo />
                </NuxtLink>
                <button class="icon" @click="isOpen = !isOpen">
                    <span v-if="isOpen">
                        <Icon name="icon:clear" />
                    </span>
                    <span v-else>
                        <Icon name="icon:menu" />
                    </span>
                </button>
            </div>
            <ul :class="{ open: isOpen }" class="menu">
                <li v-for="link in data.links" :key="link.url">
                    <NuxtLink :to="link.url">
                        <template v-if="link.button">
                            <NavButton :type="link.type">
                                {{ link.text }}
                            </NavButton>
                        </template>
                        <template v-else>
                            {{ link.text }}
                        </template>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
const { data } = await useAsyncData('header', () => queryContent('/_nav/header').findOne());
const isOpen = ref(false);
</script>

<style scoped>
header {
    border-bottom: 1px solid #232323;
}

nav {
    max-width: var(--page-max-width);
    display: flex;
    padding: 1.2rem 3rem;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: right;
    gap: 1rem;
    padding: 0;
    align-items: center;
}

a {
    color: var(--primary-text-color);
}

a:hover,
a:active,
a:focus {
    color: var(--link-color);
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

    .narrow .icon {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--primary-text-color);
        font-size: 2rem;
    }

    .narrow ul {
        display: none;
        flex-direction: column;
        gap: 1rem;
        padding: 4rem 0;
        width: 100%;
    }

    .narrow ul.open {
        display: flex;
    }
}
</style>