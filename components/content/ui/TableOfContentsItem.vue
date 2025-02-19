<template>
    <ul>
        <li v-for="link in links" :key="link.id">
            <a :href="'#' + link.id" :class="{ active: activeId === link.id }">{{ link.text }}</a>
            <TableOfContentsItem v-if="link.children && link.children.length" :links="link.children"
                :activeId="activeId" />
        </li>
    </ul>
</template>

<script setup>
defineProps({
    links: {
        type: Array,
        required: true
    },
    activeId: {
        type: String,
        default: ''
    }
})
</script>

<style scoped>
.table-of-contents {
    padding: 1.5rem;
    background: var(--header-bg-color);
    border: 1px solid var(--nnt-orange);
    border-radius: 0.5rem;
    font-size: 0.9rem;
}

.table-of-contents ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.table-of-contents ul ul {
    padding-left: 1rem;
    margin-top: 0.5rem;
}

.table-of-contents li {
    margin-bottom: 0.75rem;
}

.table-of-contents li:last-child {
    margin-bottom: 0;
}

.table-of-contents a {
    color: var(--primary-text-color);
    text-decoration: none;
    transition: color 0.2s;
    display: inline-block;
}

.table-of-contents a:hover {
    color: var(--nnt-orange);
    text-decoration: none;
}

.table-of-contents>ul>li>a {
    font-weight: 500;
}

.table-of-contents a.active {
    color: var(--nnt-orange);
    position: relative;
}

.table-of-contents a.active::before {
    content: '';
    position: absolute;
    left: -1rem;
    top: 0;
    /* Changed from 50% */
    height: 1.2rem;
    /* Fixed height instead of 100% */
    width: 4px;
    background-color: var(--nnt-orange);
    border-radius: 2px;
}
</style>
