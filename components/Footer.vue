<template>
    <footer>
        <hr />
        <section>
            <div class="container" id="socials">
                <h2>Find Us On Social Media</h2>
                <ul class="socials-list">
                    <li v-for="link in data.socials" :key="link.url">
                        <a :href="link.url">
                            <Icon class="icon" :name="'icon:' + link.icon" v-if="link.icon" />
                            <span v-else class="missing-icon">Icon Missing</span>
                        </a>
                    </li>
                </ul>
            </div>
            <nav class="container" id="links">
                <ul>
                    <li v-for="link in data.links" :key="link.url">
                        <nuxt-link :to="link.url">{{ link.text }}</nuxt-link>
                    </li>
                </ul>
            </nav>
        </section>
        <section>
            <div class="legal">
                <p>{{ data.legal.copyright }}</p>
                <span class="hide">&bull;</span>
                <span>
                    <p>Part of <a href="https://su.nottingham.ac.uk">UoNSU</a></p>
                    <span>&bull;</span>
                    <p>Source on <a href="https://github.com/newtheatre/website/">GitHub</a></p>
                </span>
            </div>
        </section>
    </footer>
</template>

<script setup>
const { data } = await useAsyncData('footer', () => queryContent('/_nav/footer').findOne())
</script>

<style scoped>
footer {
    display: flex;
    padding: 2.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    align-self: stretch;
}

hr {
    max-width: var(--page-max-width);
    width: 100%;
    border: none;
    border-top: 3px solid #191919;
}

section {
    display: flex;
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 1.2rem;
    width: 100%;
    justify-content: space-between;
    justify-items: center;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1 0 0;
}

#socials {
    align-items: flex-start;
}

#links {
    align-items: flex-end;
}

.legal,
span {
    display: flex;
    justify-content: center;
    text-align: center;
    align-self: stretch;
    gap: 1rem;
    margin: 0;
}

.legal p {
    width: fit-content;
    margin: 0;
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
    justify-content: center;
    align-items: flex-end;
    align-self: stretch;
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

.icon {
    color: var(--primary-text-color);
}

.icon:hover,
.icon:active,
.icon:focus {
    color: var(--link-color);
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {

    footer,
    section {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .container,
    #socials {
        align-items: center;
    }

    ul {
        justify-content: center;
    }

    nav ul {
        text-align: center;
        align-items: center;
        padding: 2rem 0;
    }

    .hide {
        display: none;
    }

    .legal {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        align-items: center;
    }
}
</style>